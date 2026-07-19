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

  document.getElementById("deliveryTitle").textContent = "Entrega en proceso";
  document.getElementById("deliverySubtitle").innerHTML =
    `Tu mascota ${mascota.nombre ? `<strong>${mascota.nombre}</strong>` : ""} está siendo transportada con cuidado y amor <span aria-hidden="true">♥</span>`;
  document.getElementById("deliveryStatusBadge").textContent = envio.estadoEntrega || "No enviado";

  // Estos datos comienzan en 0 hasta que se conecte el seguimiento de la entrega.
  document.getElementById("deliveryEta").textContent = envio.horaEstimada || "0";
  document.getElementById("deliveryRemainingTime").textContent = envio.tiempoRestante || "0";
  document.getElementById("deliveryDistance").textContent = envio.distanciaRestante || "0";

  document.getElementById("deliveryPetName").textContent = mascota.nombre || "Mascota";
  document.getElementById("deliveryPetBreed").textContent = mascota.raza || mascota.especie || "Información de la mascota";
  document.getElementById("deliveryRequestId").textContent = `ID: ${solicitud.id || idSolicitud || "Pendiente"}`;

  cargarInformacion(solicitud);
  cargarTimeline(solicitud);
}

function cargarInformacion(solicitud) {
  const envio = solicitud.envio || {};
  const info = document.getElementById("deliveryInfo");

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
      <div><strong>Transportista asignado</strong><p>Hogar Amigo Peludo</p><small>1234567890</small></div>
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
    { nombre: "Entregada", detalle: "Pendiente", icono: "fa-box-open" }
  ];

  timeline.innerHTML = pasos.map((paso, indice) => {
    const clase = indice < indiceActual ? "complete" : indice === indiceActual ? "active" : "";

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
