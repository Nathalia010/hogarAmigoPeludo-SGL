import {
  obtenerSolicitudes,
  cambiarEstadoSolicitud,
  actualizarEnvio,
} from "./solicitudes.js";

const tbody = document.getElementById("tablaSolicitudes");
const panelDetalle = document.getElementById("panelDetalle");
const filtroFecha = document.getElementById("filtroFecha");
const filtroEstado = document.getElementById("filtroEstado");
const limpiarFiltros = document.getElementById("limpiarFiltros");
const modalEntregaElement = document.getElementById("modalEntrega");
const modalidadEntrega = document.getElementById("modalidadEntrega");
const direccionEntrega = document.getElementById("direccionEntrega");
const fechaEntrega = document.getElementById("fechaEntrega");
const estadoEntrega = document.getElementById("estadoEntrega");
const grupoDireccionEntrega = document.getElementById("grupoDireccionEntrega");
const resumenMascotaEntrega = document.getElementById("resumenMascotaEntrega");
const guardarEntrega = document.getElementById("guardarEntrega");
const adminToast = document.getElementById("adminToast");

let solicitudes = [];
let solicitudSeleccionadaId = null;
let solicitudEntregaId = null;
let toastTimer;

const modalEntrega = modalEntregaElement
  ? window.bootstrap.Modal.getOrCreateInstance(modalEntregaElement)
  : null;

function iniciar() {
  if (!tbody || !panelDetalle) {
    console.error("No se encontraron los contenedores de solicitudes.");
    return;
  }

  refrescarSolicitudes();

  filtroFecha?.addEventListener("change", filtrar);
  filtroEstado?.addEventListener("change", filtrar);
  limpiarFiltros?.addEventListener("click", restablecerFiltros);
  modalidadEntrega?.addEventListener("change", actualizarCampoDireccion);
  guardarEntrega?.addEventListener("click", guardarDatosEntrega);
}

function refrescarSolicitudes() {
  solicitudes = obtenerSolicitudes();
  filtrar();
}

function filtrar() {
  let resultado = Array.isArray(solicitudes) ? [...solicitudes] : [];
  const fechaSeleccionada = filtroFecha?.value ?? "";
  const estadoSeleccionado = filtroEstado?.value ?? "";

  if (fechaSeleccionada) {
    resultado = resultado.filter(
      (solicitud) => convertirFecha(solicitud.fechaSolicitud) === fechaSeleccionada,
    );
  }

  if (estadoSeleccionado) {
    resultado = resultado.filter(
      (solicitud) => solicitud.estadoSolicitud === estadoSeleccionado,
    );
  }

  mostrarSolicitudes(resultado);
}

function restablecerFiltros() {
  if (filtroFecha) filtroFecha.value = "";
  if (filtroEstado) filtroEstado.value = "";
  mostrarSolicitudes(solicitudes);
}

function convertirFecha(fecha) {
  if (!fecha) return "";

  const fechaTexto = String(fecha).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)) return fechaTexto;

  const partes = fechaTexto.split(/[/-]/);
  if (partes.length !== 3) return "";

  const primeraParte = Number(partes[0]);
  const segundaParte = Number(partes[1]);
  const anio = partes[2];
  let dia;
  let mes;

  if (primeraParte > 12) {
    dia = primeraParte;
    mes = segundaParte;
  } else if (segundaParte > 12) {
    mes = primeraParte;
    dia = segundaParte;
  } else {
    dia = primeraParte;
    mes = segundaParte;
  }

  return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function mostrarSolicitudes(lista) {
  if (!Array.isArray(lista) || lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="table-empty-state">
            <i class="fa-regular fa-folder-open"></i>
            <strong>No hay solicitudes</strong>
            <span>Prueba cambiando los filtros seleccionados.</span>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = lista
    .map((solicitud) => {
      const propietario = solicitud.propietario ?? {};
      const mascota = solicitud.mascota ?? {};
      const estado = solicitud.estadoSolicitud ?? "Sin estado";
      const mostrarEntrega = estado === "Coordinando entrega";

      return `
        <tr class="${Number(solicitud.idSolicitud) === solicitudSeleccionadaId ? "selected-row" : ""}">
          <td>
            <strong class="request-person-name">
              ${escapeHTML(propietario.nombre ?? "")}
              ${escapeHTML(propietario.apellido ?? "")}
            </strong>
          </td>
          <td>${escapeHTML(mascota.nombre ?? "Sin información")}</td>
          <td>
            <span class="badge bg-${obtenerColorEstado(estado)}">
              ${escapeHTML(estado)}
            </span>
          </td>
          <td>
            <div class="request-actions">
              <button
                type="button"
                class="request-button view-button btn-ver"
                data-id="${Number(solicitud.idSolicitud)}"
              >
                <i class="fa-regular fa-eye"></i>
                Ver
              </button>
              ${
                mostrarEntrega
                  ? `
                    <button
                      type="button"
                      class="request-button delivery-button btn-entrega"
                      data-id="${Number(solicitud.idSolicitud)}"
                    >
                      <i class="fa-solid fa-truck"></i>
                      Entrega
                    </button>
                  `
                  : ""
              }
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function obtenerColorEstado(estado) {
  const colores = {
    "Solicitud llenada": "primary",
    "En revisión": "warning",
    Aceptada: "success",
    Negada: "danger",
    "Coordinando entrega": "info",
  };

  return colores[estado] ?? "secondary";
}

tbody?.addEventListener("click", (evento) => {
  const botonEntrega = evento.target.closest(".btn-entrega");
  const botonVer = evento.target.closest(".btn-ver");

  if (botonEntrega) {
    const solicitud = buscarSolicitud(botonEntrega.dataset.id);
    if (solicitud) abrirModalEntrega(solicitud);
    return;
  }

  if (botonVer) {
    const solicitud = buscarSolicitud(botonVer.dataset.id);
    if (!solicitud) {
      mostrarMensaje("No se encontró la solicitud seleccionada.", "error");
      return;
    }

    solicitudSeleccionadaId = Number(solicitud.idSolicitud);
    filtrar();
    mostrarDetalle(solicitud);
  }
});

function buscarSolicitud(id) {
  return solicitudes.find(
    (solicitud) => Number(solicitud.idSolicitud) === Number(id),
  );
}

function mostrarDetalle(solicitud) {
  const propietario = solicitud.propietario ?? {};
  const mascota = solicitud.mascota ?? {};
  const estado = solicitud.estadoSolicitud ?? "Sin estado";
  const imagen = obtenerUrlSegura(mascota.imagen);

  panelDetalle.innerHTML = `
    <div class="detail-cover ${imagen ? "" : "without-image"}">
      ${
        imagen
          ? `<img src="${escapeHTML(imagen)}" alt="${escapeHTML(mascota.nombre ?? "Mascota")}">`
          : `<i class="fa-solid fa-paw"></i>`
      }
    </div>

    <div class="detail-title-row">
      <div>
        <span class="detail-eyebrow">Solicitud #${Number(solicitud.idSolicitud)}</span>
        <h2>${escapeHTML(mascota.nombre ?? "Sin nombre")}</h2>
      </div>
      <span class="badge bg-${obtenerColorEstado(estado)}">${escapeHTML(estado)}</span>
    </div>

    <section class="detail-section">
      <h3><i class="fa-regular fa-user"></i> Solicitante</h3>
      ${crearDato("Nombre", `${propietario.nombre ?? "No registrado"} ${propietario.apellido ?? ""}`)}
      ${crearDato("Documento", propietario.documento ?? "No registrado")}
      ${crearDato("Edad", propietario.edad ?? "No registrada")}
      ${crearDato("Correo", propietario.correo ?? "No registrado")}
      ${crearDato("Teléfono", propietario.telefono ?? "No registrado")}
      ${crearDato("Ubicación", `${propietario.ciudad ?? "No registrada"}, ${propietario.pais ?? "No registrado"}`)}
    </section>

    <section class="detail-section">
      <h3><i class="fa-solid fa-house"></i> Vivienda</h3>
      ${crearDato("Tipo", propietario.tipoVivienda ?? "No registrado")}
      ${crearDato("Régimen", propietario.regimenVivienda ?? "No registrado")}
      ${crearDato("Horas solo", propietario.horasSola ?? "No registrado")}
      ${crearDato("Otras mascotas", propietario.otrasMascotas ?? "No registrado")}
    </section>

    <section class="detail-section">
      <h3><i class="fa-solid fa-paw"></i> Mascota</h3>
      ${crearDato("Especie", mascota.especie ?? "No registrada")}
      ${crearDato("Sexo", mascota.sexo ?? "No registrado")}
      ${crearDato("Edad", mascota.edad ?? "No registrada")}
      ${crearDato("Tamaño", mascota.tamano ?? "No registrado")}
      ${crearDato("Estado", mascota.estado ?? "No registrado")}
    </section>

    <section class="detail-section">
      <h3><i class="fa-regular fa-message"></i> Motivo de adopción</h3>
      <p class="adoption-reason">${escapeHTML(propietario.motivo ?? "No se registró un motivo.")}</p>
    </section>

    <section class="detail-section state-section">
      <h3><i class="fa-solid fa-arrows-rotate"></i> Cambiar estado</h3>
      <select class="form-select" id="nuevoEstado">
        ${crearOpcionesEstado(estado)}
      </select>
      <button type="button" class="primary-button w-100 mt-3" id="guardarEstado">
        <i class="fa-regular fa-floppy-disk"></i>
        Guardar estado
      </button>
    </section>
  `;

  document.getElementById("guardarEstado")?.addEventListener("click", () => {
    guardarNuevoEstado(solicitud);
  });
}

function crearDato(etiqueta, valor) {
  return `
    <div class="detail-data-row">
      <span>${escapeHTML(etiqueta)}</span>
      <strong>${escapeHTML(String(valor).trim())}</strong>
    </div>
  `;
}

function crearOpcionesEstado(estadoActual) {
  return [
    "Solicitud llenada",
    "En revisión",
    "Aceptada",
    "Negada",
    "Coordinando entrega",
  ]
    .map(
      (estado) => `
        <option value="${escapeHTML(estado)}" ${estado === estadoActual ? "selected" : ""}>
          ${escapeHTML(estado)}
        </option>
      `,
    )
    .join("");
}

function guardarNuevoEstado(solicitud) {
  const nuevoEstado = document.getElementById("nuevoEstado")?.value;
  if (!nuevoEstado) return;

  cambiarEstadoSolicitud(solicitud.idSolicitud, nuevoEstado);
  refrescarSolicitudes();

  const solicitudActualizada = buscarSolicitud(solicitud.idSolicitud);
  if (solicitudActualizada) mostrarDetalle(solicitudActualizada);

  mostrarMensaje("Estado de la solicitud actualizado.");
}

function abrirModalEntrega(solicitud) {
  solicitudEntregaId = Number(solicitud.idSolicitud);
  const envio = solicitud.envio ?? {
    modalidad: "Recoger en fundación",
    direccion: "",
    fechaEntrega: "",
    estadoEntrega: "No enviado",
  };
  const mascota = solicitud.mascota ?? {};

  modalidadEntrega.value = envio.modalidad ?? "Recoger en fundación";
  direccionEntrega.value = envio.direccion ?? "";
  fechaEntrega.value = envio.fechaEntrega ?? "";
  estadoEntrega.value = envio.estadoEntrega ?? "No enviado";

  resumenMascotaEntrega.innerHTML = `
    <span><i class="fa-solid fa-paw"></i></span>
    <div>
      <strong>${escapeHTML(mascota.nombre ?? "Mascota")}</strong>
      <small>Solicitud #${Number(solicitud.idSolicitud)}</small>
    </div>
  `;

  actualizarCampoDireccion();
  modalEntrega?.show();
}

function actualizarCampoDireccion() {
  const requiereDireccion = modalidadEntrega?.value === "Entrega a domicilio";
  if (direccionEntrega) direccionEntrega.disabled = !requiereDireccion;
  grupoDireccionEntrega?.classList.toggle("field-disabled", !requiereDireccion);
}

function guardarDatosEntrega() {
  const solicitud = buscarSolicitud(solicitudEntregaId);
  if (!solicitud) {
    mostrarMensaje("No se encontró la solicitud de entrega.", "error");
    return;
  }

  const modalidad = modalidadEntrega?.value;
  const direccion = direccionEntrega?.value.trim() ?? "";
  const fecha = fechaEntrega?.value ?? "";
  const estado = estadoEntrega?.value;

  if (!modalidad || !estado) {
    mostrarMensaje("Completa la información de entrega.", "error");
    return;
  }

  if (modalidad === "Entrega a domicilio" && !direccion) {
    direccionEntrega.focus();
    mostrarMensaje("Escribe la dirección para la entrega a domicilio.", "error");
    return;
  }

  actualizarEnvio(solicitud.idSolicitud, {
    modalidad,
    direccion: modalidad === "Entrega a domicilio" ? direccion : "",
    fechaEntrega: fecha,
    estadoEntrega: estado,
    estadoProceso:
      estado === "Recibido"
        ? "La mascota fue recibida."
        : "Nos estaremos contactando para coordinar la fecha.",
  });

  refrescarSolicitudes();
  modalEntrega?.hide();
  mostrarMensaje("Información de entrega actualizada.");
}

function mostrarMensaje(mensaje, tipo = "success") {
  if (!adminToast) return;

  adminToast.querySelector("span").textContent = mensaje;
  adminToast.classList.toggle("toast-error", tipo === "error");
  adminToast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => adminToast.classList.remove("visible"), 3200);
}

function obtenerUrlSegura(valor) {
  if (!valor) return "";
  try {
    const url = new URL(String(valor), window.location.href);
    return ["http:", "https:", "file:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function escapeHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

iniciar();
