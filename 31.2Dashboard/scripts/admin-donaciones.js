import {
  agregarDonacion,
  actualizarDonacionPendiente,
  eliminarDonacion,
  obtenerDonaciones,
  obtenerResumenDonaciones,
} from "./donaciones.js";

const form = document.getElementById("donationForm");
const tableBody = document.getElementById("donationsTableBody");
const typeField = document.getElementById("donationType");
const amountField = document.getElementById("amountField");
const amountInput = document.getElementById("donationAmount");
const newDonationButton = document.getElementById("newDonationButton");
const modalTitle = document.getElementById("donationModalTitle");
const saveButtonText = document.querySelector("#saveDonationButton span");
const modalElement = document.getElementById("donationModal");
const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
const toastElement = document.getElementById("donationToast");
const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
let editingDonationId = null;

function renderDonations() {
  const donations = obtenerDonaciones().sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
  const summary = obtenerResumenDonaciones();

  document.getElementById("totalCollected").textContent = formatMoney(summary.dinero);
  document.getElementById("donationsReceived").textContent = String(summary.total);
  document.getElementById("donationCount").textContent = `${summary.total} ${summary.total === 1 ? "donación" : "donaciones"}`;
  document.getElementById("donationsRange").textContent = `Mostrando ${summary.total} de ${summary.total} ${summary.total === 1 ? "donación" : "donaciones"}.`;

  if (!donations.length) {
    tableBody.innerHTML = '<tr><td class="donations-empty" colspan="9"><i class="fa-regular fa-folder-open me-2"></i>No hay donaciones registradas.</td></tr>';
    return;
  }

  tableBody.innerHTML = donations.map((donation) => `
    <tr>
      <td><strong>#${escapeHTML(donation.id)}</strong></td>
      <td>${escapeHTML(formatDate(donation.fecha))}</td>
      <td>${escapeHTML(donation.donante || "—")}</td>
      <td><span class="badge donation-type ${donation.tipo === "En especie" ? "kind" : ""}">${escapeHTML(donation.tipo)}</span></td>
      <td>${escapeHTML(donation.concepto)}</td>
      <td>${escapeHTML(donation.metodo || "—")}</td>
      <td><strong>${donation.tipo === "Económica" ? formatMoney(donation.monto) : "—"}</strong></td>
      <td><span class="badge donation-status ${donation.estado === "Pendiente" ? "pending" : ""}">
        <i class="fa-solid ${donation.estado === "Confirmada" ? "fa-circle-check" : "fa-clock"} me-1"></i>${escapeHTML(donation.estado)}
      </span></td>
      <td class="text-end">
        ${donation.estado === "Pendiente" ? `
          <button class="btn btn-sm edit-donation me-1" type="button" data-edit-donation="${escapeHTML(donation.id)}" aria-label="Editar donación ${escapeHTML(donation.id)}">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
        ` : ""}
        <button class="btn btn-sm delete-donation" type="button" data-delete-donation="${escapeHTML(donation.id)}" aria-label="Eliminar donación ${escapeHTML(donation.id)}">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

function updateAmountField() {
  const isMoney = typeField.value === "Económica";
  amountField.hidden = !isMoney;
  amountInput.disabled = !isMoney;
  amountInput.required = isMoney;
  if (!isMoney) amountInput.value = "";
}

function resetForm() {
  form.reset();
  document.getElementById("donationDate").value = new Date().toISOString().slice(0, 10);
  updateAmountField();
}

function prepareNewDonation() {
  editingDonationId = null;
  modalTitle.textContent = "Registrar donación";
  saveButtonText.textContent = "Guardar donación";
  resetForm();
}

function editPendingDonation(id) {
  const donation = obtenerDonaciones().find((item) => item.id === id);
  if (!donation || donation.estado !== "Pendiente") {
    showMessage("Solo se pueden editar donaciones pendientes.");
    renderDonations();
    return;
  }

  editingDonationId = donation.id;
  modalTitle.textContent = "Editar donación pendiente";
  saveButtonText.textContent = "Guardar cambios";
  form.elements.fecha.value = donation.fecha || "";
  form.elements.donante.value = donation.donante || "";
  form.elements.tipo.value = donation.tipo;
  form.elements.concepto.value = donation.concepto;
  form.elements.metodo.value = donation.metodo;
  form.elements.monto.value = donation.monto || "";
  form.elements.estado.value = donation.estado;
  updateAmountField();
  modal.show();
}

function showMessage(message) {
  document.getElementById("donationToastMessage").textContent = message;
  toast.show();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const donationData = {
    fecha: data.get("fecha"),
    donante: String(data.get("donante") ?? "").trim(),
    tipo: data.get("tipo"),
    concepto: String(data.get("concepto") ?? "").trim(),
    metodo: data.get("metodo"),
    monto: data.get("monto"),
    estado: data.get("estado"),
  };

  const wasEditing = editingDonationId !== null;
  const saved = wasEditing
    ? actualizarDonacionPendiente(editingDonationId, donationData)
    : Boolean(agregarDonacion(donationData));

  if (!saved) {
    modal.hide();
    prepareNewDonation();
    renderDonations();
    showMessage("La donación ya no está pendiente y no puede editarse.");
    return;
  }

  renderDonations();
  modal.hide();
  prepareNewDonation();
  showMessage(wasEditing ? "Donación actualizada correctamente." : "Donación registrada correctamente.");
});

typeField.addEventListener("change", updateAmountField);
newDonationButton.addEventListener("click", prepareNewDonation);
tableBody.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-donation]");
  if (editButton) {
    editPendingDonation(editButton.dataset.editDonation);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-donation]");
  if (!deleteButton) return;

  if (!window.confirm("¿Deseas eliminar esta donación?")) return;
  eliminarDonacion(deleteButton.dataset.deleteDonation);
  renderDonations();
  showMessage("Donación eliminada.");
});

window.addEventListener("storage", (event) => { if (event.key === "donaciones") renderDonations(); });

function formatMoney(value) {
  return `$${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(Number(value) || 0)}`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

prepareNewDonation();
renderDonations();
