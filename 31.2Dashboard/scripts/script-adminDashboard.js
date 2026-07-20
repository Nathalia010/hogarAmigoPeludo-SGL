import { obtenerSolicitudes } from "./solicitudes.js";
import { obtenerMascotas } from "./mascotas.js";
/*
===========================================================
Referencias a los elementos del Dashboard
-----------------------------------------------------------
Este objeto almacena las referencias a los elementos del DOM
que serán actualizados dinámicamente con la información del
dashboard, evitando realizar múltiples búsquedas en el HTML.
===========================================================
*/
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
};
/*
===========================================================
renderDashboard()  Obtiene la información de mascotas y solicitudes, calcula
las métricas generales y actualiza todos los componentes
visuales del dashboard como indicadores, gráfico de estados,
actividad reciente y próximas entregas.
===========================================================
*/
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
}
//calcularResumen(solicitudes) -Recorre todas las solicitudes y las clasifica según su 
//  estado para obtener un resumen general del sistema.
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

//Retorna:
//true  -> adopción completada.
//false -> aún no finaliza.
function esAdopcionCompletada(solicitud) {
  return solicitud.estadoSolicitud === "Adoptada" ||
    solicitud.envio?.estadoEntrega === "Recibido";
}
// Retorna true cuando la entrega está siendo coordinada o el envío ya fue despachado.
function esEntregaEnProceso(solicitud) {
  const estadoEnvio = solicitud.envio?.estadoEntrega;
  return solicitud.estadoSolicitud === "Coordinando entrega" ||
    estadoEnvio === "De camino" ||
    estadoEnvio === "En proceso de entrega";
}
//Actualiza el gráfico circular (Donut Chart) mostrando la 
// proporción de solicitudes pendientes, en proceso y completadas.
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

// Actualiza la lista de actividad reciente mostrando las últimas 3 solicitudes registradas,
// ordenadas de la más reciente a la más antigua, con su estado y tiempo relativo.
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

// Determina el tipo de actividad según el estado de la solicitud y el envío,
// retornando un objeto con el título, color y icono correspondiente.
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

// Actualiza la lista de próximas entregas mostrando las siguientes 3 solicitudes programadas,
// ordenadas de la más inmediata a la más lejana, con su fecha y destino.
function renderNextDeliveries(solicitudes) {
  const container = dashboardElements.nextDeliveriesList;
  if (!container) return;

  const proximas = solicitudes
    .filter((solicitud) =>
      solicitud.envio?.fechaEntrega &&
      solicitud.envio?.estadoEntrega !== "Recibido",
    )
    .sort((a, b) => convertirFecha(a.envio.fechaEntrega) - convertirFecha(b.envio.fechaEntrega))
    .slice(0, 3);

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

    return `
      <article>
        <span class="pet-avatar"><i class="fa-solid ${esGato ? "fa-cat" : "fa-dog"}"></i></span>
        <div>
          <strong>${escapeHTML(mascota.nombre || "Mascota")}</strong>
          <small>${escapeHTML(formatearFecha(envio.fechaEntrega))} · ${escapeHTML(destino)}</small>
        </div>
        <span class="delivery-status">${escapeHTML(envio.estadoEntrega || "Programada")}</span>
      </article>
    `;
  }).join("");
}
// Convierte una fecha en formato "YYYY-MM-DD" a un timestamp numérico.
function convertirFecha(valor) {
  if (!valor) return Number.MAX_SAFE_INTEGER;
  const fecha = new Date(`${valor}T00:00:00`);
  return Number.isNaN(fecha.getTime()) ? Number.MAX_SAFE_INTEGER : fecha.getTime();
}

// Formatea una fecha en formato "YYYY-MM-DD" a un string legible.
function formatearFecha(valor) {
  const timestamp = convertirFecha(valor);
  if (timestamp === Number.MAX_SAFE_INTEGER) return "Fecha pendiente";
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" })
    .format(new Date(timestamp));
}
// Formatea un timestamp relativo a la fecha actual, retornando un string como "Hace 5 min" o "Ahora".
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
// Crea un elemento de lista indicando que no hay datos disponibles, con un mensaje personalizado.
function crearEstadoVacio(mensaje) {
  return `<li class="dashboard-empty"><small>${escapeHTML(mensaje)}</small></li>`;
}
// Actualiza el contenido de un elemento con un valor dado, asegurando que sea una cadena.
function setText(element, value) {
  if (element) element.textContent = String(value);
}
// Escapa caracteres especiales en un string para prevenir inyección de HTML.
//prevenir el XSS es la codificación de salida (o escapado), que convierte los caracteres especiales en sus equivalentes seguros (entidades HTML).  
function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("storage", (event) => {
  if (["solicitudes", "mascotas"].includes(event.key)) renderDashboard();
});
window.addEventListener("pageshow", renderDashboard);
window.addEventListener("focus", renderDashboard);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) renderDashboard();
});

renderDashboard();
