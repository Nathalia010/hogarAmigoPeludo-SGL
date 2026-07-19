import { obtenerSolicitudPorId } from "../../31.2Dashboard/scripts/solicitudes.js";

const params = new URLSearchParams(window.location.search);
const idSolicitud = params.get("id");

console.log("ID URL:", idSolicitud);

const solicitud = obtenerSolicitudPorId(idSolicitud);
console.log("Solicitud encontrada:", solicitud);

const deliveryContent = document.getElementById("deliveryContent");
const deliveryEmpty = document.getElementById("deliveryEmpty");

if (!solicitud) {
  deliveryContent.hidden = true;
  deliveryEmpty.hidden = false;
} else {
  cargarEntrega(solicitud);
}

function cargarEntrega(solicitud) {
  const mascota = solicitud.mascota || {};
  const envio = solicitud.envio || {};
  const entregaFinalizada = normalizarEstado(envio.estadoEntrega).includes("recibido");

  document.getElementById("deliveryTitle").textContent = entregaFinalizada
    ? "Entrega finalizada"
    : "Entrega en proceso";
  document.getElementById("deliverySubtitle").innerHTML =
    entregaFinalizada
      ? `Tu mascota ${mascota.nombre ? `<strong>${mascota.nombre}</strong>` : ""} fue entregada correctamente <span aria-hidden="true">♥</span>`
      : `Tu mascota ${mascota.nombre ? `<strong>${mascota.nombre}</strong>` : ""} está siendo transportada con cuidado y amor <span aria-hidden="true">♥</span>`;
  document.getElementById("deliveryStatusBadge").textContent = envio.estadoEntrega || "No enviado";

  // Estos datos comienzan en 0 hasta que se conecte el seguimiento de la entrega.
  document.getElementById("deliveryEta").textContent = formatearHora(envio.horaEstimada);
  document.getElementById("deliveryRemainingTime").textContent = formatearMedida(envio.tiempoRestante, "min");
  document.getElementById("deliveryDistance").textContent = formatearMedida(envio.distanciaRestante, "km");

  document.getElementById("deliveryPetName").textContent = mascota.nombre || "Mascota";
  document.getElementById("deliveryPetBreed").textContent = mascota.raza || mascota.especie || "Información de la mascota";
  document.getElementById("deliveryRequestId").textContent = `ID: ${solicitud.idSolicitud || solicitud.id || idSolicitud || "Pendiente"}`;

  cargarImagenMascota(mascota);

  cargarInformacion(solicitud);
  cargarTimeline(solicitud);
}

function cargarImagenMascota(mascota) {
  const imagen = document.getElementById("deliveryPetImage");
  const respaldo = document.getElementById("deliveryPetImageFallback");
  const imagenMascota = obtenerImagenMascota(mascota);

  if (!imagenMascota) {
    imagen.hidden = true;
    respaldo.hidden = false;
    return;
  }

  imagen.alt = `Foto de ${mascota.nombre || "la mascota"}`;
  imagen.src = imagenMascota;
  imagen.hidden = false;
  respaldo.hidden = true;

  imagen.addEventListener("error", () => {
    imagen.hidden = true;
    respaldo.hidden = false;
  }, { once: true });
}

function obtenerImagenMascota(mascota) {
  const primeraImagen = Array.isArray(mascota.imagenes) ? mascota.imagenes[0] : "";

  return mascota.imagen ||
    mascota.foto ||
    mascota.image ||
    mascota.imageUrl ||
    mascota.urlImagen ||
    primeraImagen ||
    "";
}

function formatearHora(valor) {
  if (!valor) return "0";

  const coincidencia = String(valor).match(/^(\d{1,2}):(\d{2})$/);
  if (!coincidencia) return String(valor);

  const fecha = new Date();
  fecha.setHours(Number(coincidencia[1]), Number(coincidencia[2]), 0, 0);

  return new Intl.DateTimeFormat("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(fecha);
}

function formatearMedida(valor, unidad) {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero > 0 ? `${numero} ${unidad}` : "0";
}

function cargarInformacion(solicitud) {
  const envio = solicitud.envio || {};
  const info = document.getElementById("deliveryInfo");
  const transportistaNombre = envio.transportistaNombre || "Hogar Amigo Peludo";
  const transportistaTelefono = envio.transportistaTelefono || "1234567890";

  info.innerHTML = `
    <article class="delivery-info-item delivery-info-origin">
      <span class="delivery-info-icon"><i class="fa-solid fa-location-dot"></i></span>
      <div><strong>Origen</strong><p>${envio.origen || "Pendiente"}</p></div>
    </article>

    <article class="delivery-info-item delivery-info-destination">
      <span class="delivery-info-icon"><i class="fa-solid fa-location-dot"></i></span>
      <div><strong>Destino</strong><p>${envio.direccion || "Pendiente"}</p></div>
    </article>

    <article class="delivery-info-item">
      <span class="delivery-info-icon"><i class="fa-regular fa-calendar"></i></span>
      <div><strong>Fecha de entrega</strong><p>${envio.fechaEntrega || "Pendiente"}</p></div>
    </article>

    <article class="delivery-info-item">
      <span class="delivery-info-icon"><i class="fa-regular fa-id-badge"></i></span>
      <div><strong>Transportista asignado</strong><p>${escaparHTML(transportistaNombre)}</p><small>${escaparHTML(transportistaTelefono)}</small></div>
    </article>
  `;
}

// Línea de tiempo
function cargarTimeline(solicitud) {
  const timeline = document.getElementById("deliveryTimeline");
  const estado = normalizarEstado(solicitud.envio?.estadoEntrega);
  const indiceActual = obtenerIndiceEstado(estado);

  const pasos = [
    { nombre: "Solicitud creada", detalle: "Registrada", icono: "fa-check" },
    { nombre: "Confirmada", detalle: "Confirmada", icono: "fa-check" },
    { nombre: "En camino", detalle: "En ruta", icono: "fa-check" },
    { nombre: "En proceso de entrega", detalle: "Ahora", icono: "fa-truck" },
    { nombre: "Entregada", detalle: indiceActual === 4 ? "Completada" : "Pendiente", icono: "fa-box-open" }
  ];

  timeline.innerHTML = pasos.map((paso, indice) => {
    const entregaCompletada = indiceActual === pasos.length - 1;
    const clase = entregaCompletada || indice < indiceActual
      ? "complete"
      : indice === indiceActual
        ? "active"
        : "";

    return `
      <div class="delivery-step ${clase}">
        <span class="step-dot"><i class="fa-solid ${paso.icono}"></i></span>
        <strong>${paso.nombre}</strong>
        <small>${paso.detalle}</small>
      </div>
    `;
  }).join("");
}

function normalizarEstado(estado = "") {
  return estado.trim().toLowerCase();
}

function obtenerIndiceEstado(estado) {
  if (estado.includes("recibido") || estado.includes("entregad")) return 4;
  if (estado.includes("proceso")) return 3;
  if (estado.includes("camino") || estado.includes("ruta")) return 2;
  if (estado.includes("confirm")) return 1;
  return 0;
}

function escaparHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
