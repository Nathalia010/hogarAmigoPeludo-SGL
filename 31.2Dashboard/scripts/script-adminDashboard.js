import { obtenerSolicitudes } from "./solicitudes.js";
import { obtenerMascotas } from "./mascotas.js";
import { obtenerResumenDonaciones } from "./donaciones.js";

const dashboardElements = {
  metricRequests: document.getElementById("metricRequests"),
  metricDeliveries: document.getElementById("metricDeliveries"),
  metricAdoptions: document.getElementById("metricAdoptions"),
  metricPets: document.getElementById("metricPets"),
  sidebarRequestCount: document.getElementById("sidebarRequestCount"),
  notificationCount: document.getElementById("notificationCount"),
  statusDonut: document.getElementById("statusDonut"),
  statusTotal: document.getElementById("statusTotal"),
  statusPending: document.getElementById("statusPending"),
  statusProgress: document.getElementById("statusProgress"),
  statusCompleted: document.getElementById("statusCompleted"),
  recentActivityList: document.getElementById("recentActivityList"),
  nextDeliveriesList: document.getElementById("nextDeliveriesList"),
  donationSummaryLabel: document.getElementById("donationSummaryLabel"),
  donationSummaryValue: document.getElementById("donationSummaryValue"),
  donationViewButtons: document.querySelectorAll("[data-donation-view]"),
};

let selectedDonationView = "money";

function renderDashboard() {
  const solicitudes = obtenerSolicitudes();
  const mascotas = obtenerMascotas();
  const resumen = calcularResumen(solicitudes);

  setText(dashboardElements.metricRequests, resumen.pendientes);
  setText(dashboardElements.metricDeliveries, resumen.enProceso);
  setText(dashboardElements.metricAdoptions, resumen.completadas);
  setText(dashboardElements.metricPets, mascotas.length);
  setText(dashboardElements.sidebarRequestCount, resumen.pendientes);
  setText(dashboardElements.notificationCount, resumen.pendientes);

  renderStatusChart(resumen);
  renderRecentActivity(solicitudes);
  renderNextDeliveries(solicitudes);
  renderDonationSummary();
}

// Permite consultar el recaudo registrado por dinero o por donaciones en especie.
function initializeDonationSummary() {
  dashboardElements.donationViewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedView = button.dataset.donationView;
      if (!['money', 'things'].includes(selectedView)) return;
      selectedDonationView = selectedView;
      renderDonationSummary();

      dashboardElements.donationViewButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
    });
  });
}

function renderDonationSummary() {
  const summary = obtenerResumenDonaciones();
  const isMoney = selectedDonationView === "money";
  setText(dashboardElements.donationSummaryLabel, isMoney ? "Recaudo en dinero" : "Recaudo en cosas");
  setText(
    dashboardElements.donationSummaryValue,
    isMoney ? formatMoney(summary.dinero) : String(summary.cosas),
  );
}

function formatMoney(value) {
  return `$${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(Number(value) || 0)}`;
}

function calcularResumen(solicitudes) {
  let pendientes = 0;
  let enProceso = 0;
  let completadas = 0;

  solicitudes.forEach((solicitud) => {
    if (esAdopcionCompletada(solicitud)) {
      completadas += 1;
    } else if (esEntregaEnProceso(solicitud)) {
      enProceso += 1;
    } else {
      pendientes += 1;
    }
  });

  return {
    pendientes,
    enProceso,
    completadas,
    total: solicitudes.length,
  };
}

function esAdopcionCompletada(solicitud) {
  return solicitud.estadoSolicitud === "Adoptada" ||
    solicitud.envio?.estadoEntrega === "Recibido";
}

function esEntregaEnProceso(solicitud) {
  const estadoEnvio = solicitud.envio?.estadoEntrega;
  return solicitud.estadoSolicitud === "Coordinando entrega" ||
    estadoEnvio === "De camino" ||
    estadoEnvio === "En proceso de entrega";
}

function renderStatusChart(resumen) {
  setText(dashboardElements.statusTotal, resumen.total);
  setText(dashboardElements.statusPending, resumen.pendientes);
  setText(dashboardElements.statusProgress, resumen.enProceso);
  setText(dashboardElements.statusCompleted, resumen.completadas);

  if (!dashboardElements.statusDonut) return;

  const total = resumen.total || 1;
  const pendingDegrees = (resumen.pendientes / total) * 360;
  const progressDegrees = pendingDegrees + (resumen.enProceso / total) * 360;

  dashboardElements.statusDonut.style.background = resumen.total
    ? `conic-gradient(
        #f2a083 0deg ${pendingDegrees}deg,
        #7ea4ed ${pendingDegrees}deg ${progressDegrees}deg,
        #91c798 ${progressDegrees}deg 360deg
      )`
    : "#e8e9ef";
  dashboardElements.statusDonut.setAttribute(
    "aria-label",
    `${resumen.total} solicitudes en total`,
  );
}

function renderRecentActivity(solicitudes) {
  const container = dashboardElements.recentActivityList;
  if (!container) return;

  const recientes = [...solicitudes]
    .sort((a, b) => Number(b.idSolicitud) - Number(a.idSolicitud))
    .slice(0, 3);

  if (recientes.length === 0) {
    container.innerHTML = crearEstadoVacio("No hay actividad registrada.");
    return;
  }

  container.innerHTML = recientes.map((solicitud) => {
    const actividad = obtenerActividad(solicitud);
    const nombre = solicitud.mascota?.nombre || "Mascota";

    return `
      <li>
        <span class="activity-icon ${actividad.color}"><i class="fa-solid ${actividad.icono}"></i></span>
        <div>
          <strong>${escapeHTML(actividad.titulo)}</strong>
          <small>${escapeHTML(nombre)} · ${escapeHTML(formatearTiempoRelativo(solicitud.idSolicitud))}</small>
        </div>
      </li>
    `;
  }).join("");
}

function obtenerActividad(solicitud) {
  if (esAdopcionCompletada(solicitud)) {
    return { titulo: "Adopción completada", color: "green", icono: "fa-check" };
  }

  if (esEntregaEnProceso(solicitud)) {
    return { titulo: "Entrega puesta en proceso", color: "blue", icono: "fa-truck" };
  }

  return {
    titulo: `Solicitud: ${solicitud.estadoSolicitud || "Registrada"}`,
    color: "orange",
    icono: "fa-paw",
  };
}

function renderNextDeliveries(solicitudes) {
  const container = dashboardElements.nextDeliveriesList;
  if (!container) return;

  const proximas = solicitudes
    .filter((solicitud) => solicitud.estadoSolicitud === "Coordinando entrega")
    .sort((a, b) =>
      convertirFecha(a.envio?.fechaEntrega) - convertirFecha(b.envio?.fechaEntrega),
    )
    .slice(0, 4);

  if (proximas.length === 0) {
    container.innerHTML = crearEstadoVacio("No hay entregas programadas.");
    return;
  }

  container.innerHTML = proximas.map((solicitud) => {
    const mascota = solicitud.mascota ?? {};
    const envio = solicitud.envio ?? {};
    const propietario = solicitud.propietario ?? {};
    const esGato = String(mascota.especie || "").toLocaleLowerCase("es").includes("gato");
    const destino = envio.direccion || propietario.ciudad || envio.modalidad || "Por definir";
    const imagen = obtenerUrlImagenSegura(mascota.imagen);
    const estado = envio.estadoEntrega || "No enviado";

    return `
      <article>
        <span class="pet-avatar ${imagen ? "has-photo" : ""}">
          ${
            imagen
              ? `<img src="${escapeHTML(imagen)}" alt="${escapeHTML(mascota.nombre || "Mascota")}">`
              : `<i class="fa-solid ${esGato ? "fa-cat" : "fa-dog"}"></i>`
          }
        </span>
        <div>
          <strong>${escapeHTML(mascota.nombre || "Mascota")}</strong>
          <small>${escapeHTML(formatearFecha(envio.fechaEntrega))} · ${escapeHTML(destino)}</small>
        </div>
        <span class="delivery-status ${obtenerClaseEstadoEntrega(estado)}">${escapeHTML(estado)}</span>
      </article>
    `;
  }).join("");
}

// Valida la imagen antes de agregarla al HTML de la agenda.
function obtenerUrlImagenSegura(valor) {
  if (!valor) return "";

  try {
    const url = new URL(valor, window.location.href);
    return ["http:", "https:", "data:", "blob:", "file:"].includes(url.protocol)
      ? url.href
      : "";
  } catch {
    return "";
  }
}

function obtenerClaseEstadoEntrega(estado) {
  if (estado === "De camino") return "is-route";
  if (estado === "Recibido") return "is-received";
  return "is-pending";
}

function convertirFecha(valor) {
  if (!valor) return Number.MAX_SAFE_INTEGER;
  const fecha = new Date(`${valor}T00:00:00`);
  return Number.isNaN(fecha.getTime()) ? Number.MAX_SAFE_INTEGER : fecha.getTime();
}

function formatearFecha(valor) {
  const timestamp = convertirFecha(valor);
  if (timestamp === Number.MAX_SAFE_INTEGER) return "Fecha pendiente";
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" })
    .format(new Date(timestamp));
}

function formatearTiempoRelativo(idSolicitud) {
  const timestamp = Number(idSolicitud);
  if (!Number.isFinite(timestamp) || timestamp < 1_000_000_000_000) return "Fecha registrada";

  const diferencia = Math.max(0, Date.now() - timestamp);
  const minutos = Math.floor(diferencia / 60_000);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (minutos < 1) return "Ahora";
  if (minutos < 60) return `Hace ${minutos} min`;
  if (horas < 24) return `Hace ${horas} h`;
  return `Hace ${dias} día${dias === 1 ? "" : "s"}`;
}

function crearEstadoVacio(mensaje) {
  return `<li class="dashboard-empty"><small>${escapeHTML(mensaje)}</small></li>`;
}

function setText(element, value) {
  if (element) element.textContent = String(value);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("storage", (event) => {
  if (["solicitudes", "mascotas", "donaciones"].includes(event.key)) renderDashboard();
});
window.addEventListener("pageshow", renderDashboard);
window.addEventListener("focus", renderDashboard);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) renderDashboard();
});

initializeDonationSummary();
renderDashboard();
