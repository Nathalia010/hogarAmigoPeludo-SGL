import {
  obtenerSolicitudes,
  actualizarEnvio,
  cambiarEstadoSolicitud,
} from "./solicitudes.js";
import { obtenerMascotas, actualizarMascota } from "./mascotas.js";

const $ = (selector) => document.querySelector(selector);
const table = $("#deliveryTable");
const detail = $("#deliveryDetailContent");
const pagination = $("#deliveryPagination");
const filters = $("#deliveryFilters");
const search = $("#searchDelivery");
const statusFilter = $("#statusFilter");
const carrierFilter = $("#carrierFilter");
const dateFilter = $("#dateFilter");
const toastElement = $("#deliveryToast");
const toast = bootstrap.Toast.getOrCreateInstance(toastElement);

const state = {
  deliveries: [],
  filtered: [],
  selectedId: null,
  page: 1,
  perPage: 5,
};

async function loadDeliveries() {
  try {
    const solicitudes = await obtenerSolicitudes();
    state.deliveries = (Array.isArray(solicitudes) ? solicitudes : []).filter(
      (request) =>
        ["Coordinando entrega", "Adoptada"].includes(request.estadoSolicitud) ||
        Boolean(request.envio?.id)
    );
  } catch (error) {
    console.error("Error al cargar entregas:", error);
    state.deliveries = [];
    showToast(
      "No se pudieron cargar las entregas. Verifica el backend en :8080",
      false
    );
  }

  fillCarriers();
  applyFilters();
}

function fillCarriers() {
  const selected = carrierFilter.value;
  const carriers = [
    ...new Set(
      state.deliveries
        .map((request) => request.envio?.transportistaNombre)
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b, "es"));

  carrierFilter.innerHTML =
    '<option value="">Todos los transportistas</option>' +
    carriers
      .map(
        (name) =>
          `<option value="${escapeHTML(name)}">${escapeHTML(name)}</option>`
      )
      .join("");
  carrierFilter.value = carriers.includes(selected) ? selected : "";
}

function applyFilters() {
  const term = normalize(search.value);
  const status = statusFilter.value;
  const carrier = carrierFilter.value;
  const date = dateFilter.value;

  state.filtered = state.deliveries.filter((request) => {
    const pet = request.mascota ?? {};
    const owner = request.propietario ?? {};
    const shipping = request.envio ?? {};
    const searchable = normalize(
      [
        pet.nombre,
        owner.nombre,
        owner.apellido,
        owner.documento,
        shipping.direccion,
        shipping.origen,
        shipping.transportistaNombre,
      ].join(" ")
    );

    return (
      (!term || searchable.includes(term)) &&
      (!status || shipping.estadoEntrega === status) &&
      (!carrier || shipping.transportistaNombre === carrier) &&
      (!date || normalizeDate(shipping.fechaEntrega) === date)
    );
  });

  const pages = Math.max(1, Math.ceil(state.filtered.length / state.perPage));
  state.page = Math.min(state.page, pages);
  renderTable();
  renderPagination(pages);
  $("#deliveryTotal").textContent = `${state.filtered.length} ${
    state.filtered.length === 1 ? "entrega" : "entregas"
  }`;
}

function renderTable() {
  if (!state.filtered.length) {
    table.innerHTML = `<tr><td colspan="7"><div class="empty-table">
      <i class="fa-regular fa-folder-open"></i>No hay entregas con estos filtros.
    </div></td></tr>`;
    $("#deliveryRange").textContent = "Mostrando 0 entregas";
    return;
  }

  const start = (state.page - 1) * state.perPage;
  const rows = state.filtered.slice(start, start + state.perPage);
  $("#deliveryRange").textContent = `Mostrando ${start + 1} a ${
    start + rows.length
  } de ${state.filtered.length} entregas`;
  table.innerHTML = rows
    .map((request) => {
      const pet = request.mascota ?? {};
      const owner = request.propietario ?? {};
      const shipping = request.envio ?? {};
      return `<tr>
      <td><div class="pet-cell">${petImage(pet)}<span class="cell-copy">
        <strong>${escapeHTML(pet.nombre ?? "Mascota")}</strong><small>${escapeHTML(pet.especie ?? "")}</small>
      </span></div></td>
      <td><span class="cell-copy"><strong>${escapeHTML(fullName(owner))}</strong><small>${escapeHTML(owner.documento ?? "Sin documento")}</small></span></td>
      <td><span class="cell-copy"><strong>${escapeHTML(shipping.direccion || shipping.modalidad || "Pendiente")}</strong><small>${escapeHTML(shipping.origen || "Origen pendiente")}</small></span></td>
      <td><span class="cell-copy"><strong>${escapeHTML(formatDate(shipping.fechaEntrega))}</strong><small>${escapeHTML(formatTime(shipping.horaEstimada))}</small></span></td>
      <td><span class="cell-copy"><strong>${escapeHTML(shipping.transportistaNombre || "Sin asignar")}</strong><small>${escapeHTML(shipping.transportistaTelefono || "Sin teléfono")}</small></span></td>
      <td>${statusBadge(shipping.estadoEntrega)}</td>
      <td class="text-end"><button class="btn btn-sm view-delivery" type="button" data-view-delivery="${Number(request.idSolicitud)}">Ver</button></td>
    </tr>`;
    })
    .join("");
}

function renderPagination(pages) {
  const items = [];
  items.push(pageButton(state.page - 1, "‹", state.page === 1));
  for (let page = 1; page <= pages; page += 1) {
    items.push(pageButton(page, page, false, page === state.page));
  }
  items.push(pageButton(state.page + 1, "›", state.page === pages));
  pagination.innerHTML = items.join("");
}

function pageButton(page, label, disabled, active = false) {
  return `<li class="page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}">
    <button class="page-link" type="button" data-page="${page}" ${disabled ? "disabled" : ""}>${label}</button>
  </li>`;
}

function showDetail(request, scrollToDetail = false) {
  state.selectedId = Number(request.idSolicitud);
  const pet = request.mascota ?? {};
  const owner = request.propietario ?? {};
  const shipping = request.envio ?? {};
  const esRecoger = String(shipping.modalidad || "")
    .toLowerCase()
    .includes("recoger");
  $("#deliveryDetail").hidden = false;

  detail.innerHTML = `<article class="card border-0 shadow-sm detail-card">
    <div class="card-body p-4">
      <div class="detail-heading"><div><span class="section-kicker">DETALLE DE LA ENTREGA</span>
        <h2 class="h5 mt-1 mb-0">Solicitud #${Number(request.idSolicitud)}</h2></div>${statusBadge(shipping.estadoEntrega)}</div>
      <div class="detail-pet">${petImage(pet)}<span class="cell-copy"><strong>${escapeHTML(pet.nombre ?? "Mascota")}</strong>
        <small>${escapeHTML([pet.especie, pet.tamano].filter(Boolean).join(" · "))}</small></span></div>
      <div class="detail-list">
        ${detailRow("fa-regular fa-user", "Adoptante", fullName(owner))}
        ${detailRow("fa-solid fa-phone", "Teléfono", owner.telefono ?? "Sin registrar")}
        ${detailRow(
          "fa-solid fa-location-dot",
          esRecoger ? "Lugar de recogida" : "Dirección",
          esRecoger
            ? shipping.origen || "Fundación Hogar Amigo Peludo"
            : shipping.direccion || shipping.modalidad || "Pendiente"
        )}
        ${detailRow(
          "fa-regular fa-calendar",
          esRecoger ? "Fecha de recogida" : "Fecha de entrega",
          `${formatDate(shipping.fechaEntrega)}${
            esRecoger ? "" : ` · ${formatTime(shipping.horaEstimada)}`
          }`
        )}
        ${
          esRecoger
            ? detailRow(
                "fa-solid fa-house",
                "Modalidad",
                "Recoger en fundación (sin transportadora)"
              )
            : detailRow(
                "fa-solid fa-truck",
                "Transportista",
                `${shipping.transportistaNombre || "Sin asignar"} · ${
                  shipping.transportistaTelefono || "Sin teléfono"
                }`
              )
        }
        ${
          esRecoger
            ? ""
            : detailRow(
                "fa-solid fa-route",
                "Distancia y tiempo",
                `${Number(shipping.distanciaRestante) || 0} km · ${
                  Number(shipping.tiempoRestante) || 0
                } min`
              )
        }
      </div>
      ${timeline(shipping.estadoEntrega)}
      <label class="form-label fw-bold" for="detailStatus">Cambiar estado</label>
      <select class="form-select mb-3" id="detailStatus">
        ${[
          ["No enviado", "No enviado"],
          ["De camino", "De camino"],
          [
            "Recibido",
            String(shipping.modalidad || "").toLowerCase().includes("recoger")
              ? "Recibido / Recogido"
              : "Recibido",
          ],
        ]
          .map(
            ([value, label]) =>
              `<option value="${value}" ${
                value === shipping.estadoEntrega ? "selected" : ""
              }>${label}</option>`
          )
          .join("")}
      </select>
      <button class="btn btn-save w-100" id="saveDeliveryStatus" type="button">
        <i class="fa-regular fa-floppy-disk me-1"></i> Guardar cambios
      </button>
    </div>
  </article>`;

  $("#saveDeliveryStatus").addEventListener("click", () => {
    void saveStatus();
  });
  if (scrollToDetail) {
    requestAnimationFrame(() => {
      $("#deliveryDetail").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

async function saveStatus() {
  const request = state.deliveries.find(
    (item) => Number(item.idSolicitud) === state.selectedId
  );
  const status = $("#detailStatus")?.value;
  if (!request || !status) return;

  const esRecoger = String(request.envio?.modalidad || "")
    .toLowerCase()
    .includes("recoger");

  try {
    await actualizarEnvio(request.idSolicitud, {
      ...request.envio,
      // En recogida no se exige dirección ni transportadora.
      ...(esRecoger
        ? {
            direccion: "",
            transportistaNombre: "Recogida en fundación",
            transportistaTelefono: "",
          }
        : {}),
      estadoEntrega: status,
      estadoProceso: statusMessage(status, request.envio?.modalidad),
      ...(esEntregaFinalizada(status)
        ? { tiempoRestante: 0, distanciaRestante: 0 }
        : {}),
    });
    await syncAdoption(request, status);
    document.dispatchEvent(new CustomEvent("admin-requests-updated"));
    showToast("Entrega actualizada y guardada en la base de datos.", true);
    await loadDeliveries();
    const updated = state.deliveries.find(
      (item) => Number(item.idSolicitud) === state.selectedId
    );
    if (updated) showDetail(updated);
  } catch (error) {
    console.error(error);
    showToast("No se pudo guardar la entrega en el servidor.", false);
  }
}

function esEntregaFinalizada(status) {
  const valor = String(status || "").trim().toLowerCase();
  return ["recibido", "recogido", "entregado"].includes(valor);
}

async function syncAdoption(request, status) {
  const received = esEntregaFinalizada(status);
  await cambiarEstadoSolicitud(
    request.idSolicitud,
    received ? "Adoptada" : "Coordinando entrega"
  );

  const requestedPet = request.mascota ?? {};
  const petId = requestedPet.id ?? requestedPet.idMascota;
  let pets = [];
  try {
    pets = await obtenerMascotas();
  } catch (error) {
    console.error(error);
    return;
  }

  const pet =
    pets.find((item) => Number(item.id) === Number(petId)) ??
    pets.find(
      (item) => normalize(item.nombre) === normalize(requestedPet.nombre)
    );
  if (!pet) return;

  // Backend espera "Adoptado" para que deje de salir en el catálogo.
  await actualizarMascota(
    pet.id,
    received
      ? {
          estado: "Adoptado",
          fechaAdopcion: new Date().toISOString(),
          solicitudAdopcionId: request.idSolicitud,
        }
      : {
          estado: "Disponible",
          fechaAdopcion: null,
          solicitudAdopcionId: null,
        }
  );
}

function timeline(status) {
  const level = esEntregaFinalizada(status)
    ? 3
    : { "No enviado": 1, "De camino": 2, Recibido: 3, Recogido: 3 }[status] ??
      1;
  return `<div class="timeline">
    ${timelineStep("Solicitud aprobada", "Lista para coordinar", level >= 1)}
    ${timelineStep("En camino / lista", "Coordinación en curso", level >= 2)}
    ${timelineStep("Finalizada", "Adopción completada", level >= 3)}
  </div>`;
}

function timelineStep(title, text, done) {
  return `<div class="timeline-step ${done ? "done" : ""}"><span class="timeline-dot"><i class="fa-solid fa-check"></i></span>
    <div><strong>${title}</strong><small>${text}</small></div></div>`;
}

function detailRow(icon, label, value) {
  return `<div class="detail-row"><i class="${icon}"></i><div><span>${label}</span><strong>${escapeHTML(String(value))}</strong></div></div>`;
}

function statusBadge(status = "No enviado") {
  const className =
    status === "Recibido"
      ? "status-received"
      : status === "De camino"
        ? "status-route"
        : "status-pending";
  return `<span class="status-badge ${className}"><i class="fa-solid fa-circle"></i>${escapeHTML(status)}</span>`;
}

function petImage(pet) {
  const source = safeImage(pet.imagen);
  return source
    ? `<img class="pet-picture" src="${escapeHTML(source)}" alt="${escapeHTML(pet.nombre ?? "Mascota")}">`
    : '<span class="pet-picture pet-placeholder"><i class="fa-solid fa-paw"></i></span>';
}

function fullName(owner) {
  return (
    `${owner.nombre ?? ""} ${owner.apellido ?? ""}`.trim() || "Sin registrar"
  );
}

function formatDate(value) {
  const normalized = normalizeDate(value);
  if (!normalized) return "Pendiente";
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${normalized}T00:00:00Z`));
}

function normalizeDate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parts = String(value)
    .split(/[/-]/)
    .map(Number);
  if (parts.length !== 3) return "";
  const [day, month, year] = parts;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatTime(value) {
  if (!value) return "Hora pendiente";
  const [hour, minute] = String(value).split(":").map(Number);
  if (!Number.isFinite(hour)) return value;
  return new Intl.DateTimeFormat("es-CO", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2000, 0, 1, hour, minute || 0));
}

function statusMessage(status, modalidad = "") {
  const esRecoger = String(modalidad || "")
    .toLowerCase()
    .includes("recoger");

  if (esRecoger && esEntregaFinalizada(status)) {
    return "La mascota fue recogida en la fundación.";
  }

  return {
    "No enviado": "Estamos preparando la entrega.",
    "De camino": "La mascota está en ruta.",
    Recibido: "La mascota fue recibida en su nuevo hogar.",
    Recogido: "La mascota fue recogida en la fundación.",
  }[status];
}

function safeImage(value) {
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:", "data:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character]
  );
}

function showToast(message, success) {
  $("#deliveryToastMessage").textContent = message;
  toastElement.classList.toggle("text-bg-success", success);
  toastElement.classList.toggle("text-bg-danger", !success);
  toast.show();
}

filters.addEventListener("input", () => {
  state.page = 1;
  applyFilters();
});
filters.addEventListener("change", () => {
  state.page = 1;
  applyFilters();
});
$("#clearFilters").addEventListener("click", () => {
  filters.reset();
  state.page = 1;
  applyFilters();
});
table.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view-delivery]");
  const request =
    button &&
    state.deliveries.find(
      (item) => Number(item.idSolicitud) === Number(button.dataset.viewDelivery)
    );
  if (request) showDetail(request, true);
});
pagination.addEventListener("click", (event) => {
  const button = event.target.closest("[data-page]");
  if (!button || button.disabled) return;
  state.page = Number(button.dataset.page);
  renderTable();
  renderPagination(
    Math.max(1, Math.ceil(state.filtered.length / state.perPage))
  );
});

document.addEventListener("admin-requests-updated", () => {
  void loadDeliveries();
});

loadDeliveries();
