import { obtenerSolicitudPorId } from "../../31.2Dashboard/scripts/solicitudes.js";

const params = new URLSearchParams(window.location.search);
const idSolicitud = params.get("id");

const deliveryContent = document.getElementById("deliveryContent");
const deliveryEmpty = document.getElementById("deliveryEmpty");

async function iniciar() {
  if (!idSolicitud) {
    mostrarVacio();
    return;
  }

  try {
    const solicitud = await obtenerSolicitudPorId(idSolicitud);
    if (!solicitud) {
      mostrarVacio();
      return;
    }

    deliveryContent.hidden = false;
    deliveryEmpty.hidden = true;
    cargarEntrega(solicitud);
  } catch (error) {
    console.error("Error al cargar la entrega:", error);
    mostrarVacio();
  }
}

function mostrarVacio() {
  if (deliveryContent) deliveryContent.hidden = true;
  if (deliveryEmpty) deliveryEmpty.hidden = false;
}

function esRecogerEnFundacion(modalidad = "") {
  return normalizarEstado(modalidad).includes("recoger");
}

function esEntregaFinalizada(estado = "") {
  const valor = normalizarEstado(estado);
  return ["recibido", "recogido", "entregado"].some((item) =>
    valor.includes(item)
  );
}

function cargarEntrega(solicitud) {
  const mascota = solicitud.mascota || {};
  const envio = solicitud.envio || {};
  const esRecoger = esRecogerEnFundacion(envio.modalidad);
  const entregaFinalizada = esEntregaFinalizada(envio.estadoEntrega);

  document.getElementById("deliveryTitle").textContent = entregaFinalizada
    ? esRecoger
      ? "Recogida finalizada"
      : "Entrega finalizada"
    : esRecoger
      ? "Recogida en proceso"
      : "Entrega en proceso";
  document.getElementById("deliverySubtitle").innerHTML = entregaFinalizada
    ? `Tu mascota ${
        mascota.nombre ? `<strong>${mascota.nombre}</strong>` : ""
      } ${
        esRecoger
          ? "fue recogida en la fundación"
          : "fue entregada correctamente"
      } <span aria-hidden="true">♥</span>`
    : `Tu mascota ${
        mascota.nombre ? `<strong>${mascota.nombre}</strong>` : ""
      } ${
        esRecoger
          ? "está lista para recoger en la fundación"
          : "está siendo transportada con cuidado y amor"
      } <span aria-hidden="true">♥</span>`;
  document.getElementById("deliveryStatusBadge").textContent =
    entregaFinalizada && esRecoger
      ? "Recogido"
      : envio.estadoEntrega || "No enviado";

  document.getElementById("deliveryEta").textContent = formatearHora(
    envio.horaEstimada
  );
  document.getElementById("deliveryRemainingTime").textContent =
    formatearMedida(envio.tiempoRestante, "min");
  document.getElementById("deliveryDistance").textContent = formatearMedida(
    envio.distanciaRestante,
    "km"
  );

  document.getElementById("deliveryPetName").textContent =
    mascota.nombre || "Mascota";
  document.getElementById("deliveryPetBreed").textContent =
    mascota.raza || mascota.especie || "Información de la mascota";
  document.getElementById("deliveryRequestId").textContent = `ID: ${
    solicitud.idSolicitud || solicitud.id || idSolicitud || "Pendiente"
  }`;

  cargarImagenMascota(mascota);
  cargarInformacion(solicitud);
  cargarTimeline(solicitud);
}

function cargarImagenMascota(mascota) {
  const imagen = document.getElementById("deliveryPetImage");
  const respaldo = document.getElementById("deliveryPetImageFallback");
  const imagenMascota = obtenerImagenMascota(mascota);

  if (!imagen || !respaldo) return;

  if (!imagenMascota) {
    imagen.hidden = true;
    respaldo.hidden = false;
    return;
  }

  imagen.alt = `Foto de ${mascota.nombre || "la mascota"}`;
  imagen.src = imagenMascota;
  imagen.hidden = false;
  respaldo.hidden = true;

  imagen.addEventListener(
    "error",
    () => {
      imagen.hidden = true;
      respaldo.hidden = false;
    },
    { once: true }
  );
}

function obtenerImagenMascota(mascota) {
  const primeraImagen = Array.isArray(mascota.imagenes)
    ? mascota.imagenes[0]
    : "";

  return (
    mascota.imagen ||
    mascota.foto ||
    mascota.image ||
    mascota.imageUrl ||
    mascota.urlImagen ||
    primeraImagen ||
    ""
  );
}

function formatearHora(valor) {
  if (!valor) return "Pendiente";

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
  if (!info) return;

  const esRecoger = esRecogerEnFundacion(envio.modalidad);
  const transportistaNombre = envio.transportistaNombre || "Hogar Amigo Peludo";
  const transportistaTelefono = envio.transportistaTelefono || "Pendiente";
  const lugarRecogida =
    envio.origen || "Fundación Hogar Amigo Peludo";

  if (esRecoger) {
    info.innerHTML = `
      <article class="delivery-info-item delivery-info-origin">
        <span class="delivery-info-icon"><i class="fa-solid fa-house"></i></span>
        <div><strong>Modalidad</strong><p>Recoger en fundación</p></div>
      </article>

      <article class="delivery-info-item delivery-info-destination">
        <span class="delivery-info-icon"><i class="fa-solid fa-location-dot"></i></span>
        <div><strong>Lugar de recogida</strong><p>${escaparHTML(lugarRecogida)}</p></div>
      </article>

      <article class="delivery-info-item">
        <span class="delivery-info-icon"><i class="fa-regular fa-calendar"></i></span>
        <div><strong>Fecha de recogida</strong><p>${escaparHTML(envio.fechaEntrega || "Pendiente")}</p></div>
      </article>

      <article class="delivery-info-item">
        <span class="delivery-info-icon"><i class="fa-solid fa-paw"></i></span>
        <div><strong>Estado</strong><p>${escaparHTML(
          esEntregaFinalizada(envio.estadoEntrega)
            ? "Adoptado · Recogido en fundación"
            : envio.estadoProceso || "Coordinando recogida"
        )}</p></div>
      </article>
    `;
    return;
  }

  info.innerHTML = `
    <article class="delivery-info-item delivery-info-origin">
      <span class="delivery-info-icon"><i class="fa-solid fa-location-dot"></i></span>
      <div><strong>Origen</strong><p>${escaparHTML(envio.origen || "Pendiente")}</p></div>
    </article>

    <article class="delivery-info-item delivery-info-destination">
      <span class="delivery-info-icon"><i class="fa-solid fa-location-dot"></i></span>
      <div><strong>Destino</strong><p>${escaparHTML(envio.direccion || "Pendiente")}</p></div>
    </article>

    <article class="delivery-info-item">
      <span class="delivery-info-icon"><i class="fa-regular fa-calendar"></i></span>
      <div><strong>Fecha de entrega</strong><p>${escaparHTML(envio.fechaEntrega || "Pendiente")}</p></div>
    </article>

    <article class="delivery-info-item">
      <span class="delivery-info-icon"><i class="fa-regular fa-id-badge"></i></span>
      <div><strong>Transportista asignado</strong><p>${escaparHTML(transportistaNombre)}</p><small>${escaparHTML(transportistaTelefono)}</small></div>
    </article>
  `;
}

function cargarTimeline(solicitud) {
  const timeline = document.getElementById("deliveryTimeline");
  if (!timeline) return;

  const envio = solicitud.envio || {};
  const estado = normalizarEstado(envio.estadoEntrega);
  const esRecoger = esRecogerEnFundacion(envio.modalidad);
  const indiceActual = obtenerIndiceEstado(estado, esRecoger);

  const pasos = esRecoger
    ? [
        { nombre: "Solicitud creada", detalle: "Registrada", icono: "fa-check" },
        { nombre: "Confirmada", detalle: "Confirmada", icono: "fa-check" },
        {
          nombre: "Lista para recoger",
          detalle: "En fundación",
          icono: "fa-house",
        },
        {
          nombre: "Recogida",
          detalle: indiceActual >= 3 ? "Completada" : "Pendiente",
          icono: "fa-paw",
        },
      ]
    : [
        { nombre: "Solicitud creada", detalle: "Registrada", icono: "fa-check" },
        { nombre: "Confirmada", detalle: "Confirmada", icono: "fa-check" },
        { nombre: "En camino", detalle: "En ruta", icono: "fa-check" },
        { nombre: "En proceso de entrega", detalle: "Ahora", icono: "fa-truck" },
        {
          nombre: "Entregada",
          detalle: indiceActual === 4 ? "Completada" : "Pendiente",
          icono: "fa-box-open",
        },
      ];

  timeline.innerHTML = pasos
    .map((paso, indice) => {
      const entregaCompletada = indiceActual === pasos.length - 1;
      const clase =
        entregaCompletada || indice < indiceActual
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
    })
    .join("");
}

function normalizarEstado(estado = "") {
  return String(estado).trim().toLowerCase();
}

function obtenerIndiceEstado(estado, esRecoger = false) {
  if (esRecoger) {
    if (
      estado.includes("recibido") ||
      estado.includes("recogido") ||
      estado.includes("entregad")
    ) {
      return 3;
    }
    if (
      estado.includes("camino") ||
      estado.includes("proceso") ||
      estado.includes("no enviado") ||
      estado.includes("pendiente")
    ) {
      return 2;
    }
    if (estado.includes("confirm")) return 1;
    return 0;
  }

  if (
    estado.includes("recibido") ||
    estado.includes("recogido") ||
    estado.includes("entregad")
  ) {
    return 4;
  }
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

iniciar();
