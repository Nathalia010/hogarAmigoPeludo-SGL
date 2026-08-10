import {
  obtenerSolicitudes,
  cambiarEstadoSolicitud,
  actualizarEnvio,
} from "./solicitudes.js";
import {
  obtenerMascotas,
  actualizarMascota,
} from "./mascotas.js";

const tbody = document.getElementById("tablaSolicitudes");
const panelDetalle = document.getElementById("panelDetalle");
const filtroFecha = document.getElementById("filtroFecha");
const filtroEstado = document.getElementById("filtroEstado");
const limpiarFiltros = document.getElementById("limpiarFiltros");
const modalEntregaElement = document.getElementById("modalEntrega");
const modalidadEntrega = document.getElementById("modalidadEntrega");
const direccionEntrega = document.getElementById("direccionEntrega");
const origenEntrega = document.getElementById("origenEntrega");
const fechaEntrega = document.getElementById("fechaEntrega");
const horaEstimadaEntrega = document.getElementById("horaEstimadaEntrega");
const tiempoRestanteEntrega = document.getElementById("tiempoRestanteEntrega");
const distanciaRestanteEntrega = document.getElementById("distanciaRestanteEntrega");
const transportistaNombreEntrega = document.getElementById("transportistaNombreEntrega");
const transportistaTelefonoEntrega = document.getElementById("transportistaTelefonoEntrega");
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
  guardarEntrega?.addEventListener("click", () => {
    guardarDatosEntrega();
  });
}

async function refrescarSolicitudes() {
  try {
    solicitudes = await obtenerSolicitudes();
    if (!Array.isArray(solicitudes)) {
      solicitudes = [];
    }
  } catch (error) {
    console.error("Error al cargar solicitudes del API:", error);
    solicitudes = [];
    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="table-empty-state">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <strong>No se pudieron cargar las solicitudes</strong>
            <span>Verifica que el backend esté en http://localhost:8080</span>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  const sidebarRequestCount = document.getElementById("sidebarRequestCount");
  if (sidebarRequestCount) {
    sidebarRequestCount.textContent = String(solicitudes.length);
  }

  document.dispatchEvent(new CustomEvent("admin-requests-updated"));
  filtrar();
}

function solicitudesSonDeLaMismaMascota(primera, segunda) {
  const primeraMascota = primera.mascota ?? {};
  const segundaMascota = segunda.mascota ?? {};
  const primerId = primeraMascota.id ?? primeraMascota.idMascota;
  const segundoId = segundaMascota.id ?? segundaMascota.idMascota;

  if (primerId != null && segundoId != null) {
    return Number(primerId) === Number(segundoId);
  }

  return normalizarTexto(primeraMascota.nombre) === normalizarTexto(segundaMascota.nombre) &&
    (!primeraMascota.imagen || !segundaMascota.imagen || primeraMascota.imagen === segundaMascota.imagen);
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
      const mostrarEntrega = ["Coordinando entrega", "Adoptada"].includes(estado);

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
    Adoptada: "success",
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
    void guardarNuevoEstado(solicitud);
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
    "Adoptada",
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

async function guardarNuevoEstado(solicitud) {
  const nuevoEstado = document.getElementById("nuevoEstado")?.value;
  if (!nuevoEstado) return;

  try {
    await cambiarEstadoSolicitud(solicitud.idSolicitud, nuevoEstado);
    const mascotaActualizada = await sincronizarDesdeEstadoSolicitud(
      solicitud,
      nuevoEstado
    );
    await refrescarSolicitudes();

    const solicitudActualizada = buscarSolicitud(solicitud.idSolicitud);
    if (solicitudActualizada) mostrarDetalle(solicitudActualizada);

    mostrarMensaje(
      mascotaActualizada
        ? "Estado de la solicitud y de la mascota actualizados."
        : "La solicitud cambió, pero no se encontró la mascota asociada.",
      mascotaActualizada ? "success" : "error"
    );
  } catch (error) {
    console.error(error);
    mostrarMensaje("No se pudo actualizar el estado.", "error");
  }
}

async function sincronizarDesdeEstadoSolicitud(solicitud, nuevoEstado) {
  const solicitudAdoptada = nuevoEstado === "Adoptada";

  await actualizarEnvio(solicitud.idSolicitud, {
    ...solicitud.envio,
    estadoEntrega: solicitudAdoptada ? "Recibido" : "No enviado",
    estadoProceso: solicitudAdoptada
      ? "La mascota fue recibida/recogida correctamente."
      : "Estamos preparando la entrega.",
    tiempoRestante: solicitudAdoptada ? solicitud.envio?.tiempoRestante ?? 0 : 0,
    distanciaRestante: solicitudAdoptada
      ? solicitud.envio?.distanciaRestante ?? 0
      : 0,
  });

  return actualizarEstadoMascotaAsociada(
    solicitud,
    solicitudAdoptada ? "Adoptado" : "Disponible"
  );
}

async function actualizarEstadoMascotaAsociada(solicitud, estadoMascota) {
  const mascotaSolicitud = solicitud.mascota ?? {};
  const idMascota =
    mascotaSolicitud.id ??
    mascotaSolicitud.idMascota ??
    solicitud._api?.mascotaId ??
    solicitud.mascotaId;

  let mascotaRegistrada = null;

  try {
    const mascotas = await obtenerMascotas();
    mascotaRegistrada = mascotas.find(
      (mascota) => Number(mascota.id) === Number(idMascota)
    );

    if (!mascotaRegistrada) {
      mascotaRegistrada = mascotas.find((mascota) => {
        const mismoNombre =
          normalizarTexto(mascota.nombre) ===
          normalizarTexto(mascotaSolicitud.nombre);
        const mismaImagen =
          mascotaSolicitud.imagen && mascota.imagen === mascotaSolicitud.imagen;
        return mismoNombre && (!mascotaSolicitud.imagen || mismaImagen);
      });
    }
  } catch (error) {
    console.error(error);
    return false;
  }

  if (!mascotaRegistrada) {
    console.warn(
      "No se encontró la mascota asociada a la solicitud:",
      solicitud.idSolicitud
    );
    return false;
  }

  const adoptada =
    estadoMascota === "Adoptado" || estadoMascota === "Adoptada";

  return actualizarMascota(
    mascotaRegistrada.id,
    adoptada
      ? {
          estado: "Adoptado",
          fechaAdopcion: new Date().toISOString(),
          solicitudAdopcionId: solicitud.idSolicitud,
        }
      : {
          estado: "Disponible",
          fechaAdopcion: null,
          solicitudAdopcionId: null,
        }
  );
}

function abrirModalEntrega(solicitud) {
  solicitudEntregaId = Number(solicitud.idSolicitud);
  const envio = solicitud.envio ?? {
    modalidad: "Recoger en fundación",
    direccion: "",
    origen: "",
    fechaEntrega: "",
    horaEstimada: "",
    tiempoRestante: 0,
    distanciaRestante: 0,
    transportistaNombre: "Hogar Amigo Peludo",
    transportistaTelefono: "1234567890",
    estadoEntrega: "No enviado",
  };
  const mascota = solicitud.mascota ?? {};

  modalidadEntrega.value = envio.modalidad ?? "Recoger en fundación";
  direccionEntrega.value = envio.direccion ?? "";
  origenEntrega.value = envio.origen ?? "";
  fechaEntrega.value = envio.fechaEntrega ?? "";
  horaEstimadaEntrega.value = envio.horaEstimada ?? "";
  tiempoRestanteEntrega.value = envio.tiempoRestante ?? 0;
  distanciaRestanteEntrega.value = envio.distanciaRestante ?? 0;
  transportistaNombreEntrega.value = envio.transportistaNombre ?? "Hogar Amigo Peludo";
  transportistaTelefonoEntrega.value = envio.transportistaTelefono ?? "1234567890";
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

function esRecogerEnFundacion(modalidad = modalidadEntrega?.value) {
  return String(modalidad || "")
    .toLowerCase()
    .includes("recoger");
}

function esEntregaFinalizada(estado) {
  const valor = String(estado || "").trim().toLowerCase();
  return ["recibido", "recogido", "entregado"].includes(valor);
}

function actualizarCampoDireccion() {
  const esDomicilio = modalidadEntrega?.value === "Entrega a domicilio";
  const esRecoger = esRecogerEnFundacion();

  if (direccionEntrega) {
    direccionEntrega.disabled = !esDomicilio;
    if (!esDomicilio) direccionEntrega.value = "";
  }
  grupoDireccionEntrega?.classList.toggle("field-disabled", !esDomicilio);
  grupoDireccionEntrega?.toggleAttribute("hidden", !esDomicilio);

  const grupoTransportista = document.getElementById("grupoTransportistaEntrega");
  const grupoTracking = document.getElementById("grupoTrackingEntrega");
  const grupoOrigen = document.getElementById("grupoOrigenEntrega");
  const ayudaRecoger = document.getElementById("ayudaRecogerFundacion");

  grupoTransportista?.toggleAttribute("hidden", esRecoger);
  grupoTracking?.toggleAttribute("hidden", esRecoger);
  grupoOrigen?.toggleAttribute("hidden", esRecoger);
  ayudaRecoger?.toggleAttribute("hidden", !esRecoger);

  if (esRecoger) {
    if (transportistaNombreEntrega) transportistaNombreEntrega.value = "";
    if (transportistaTelefonoEntrega) transportistaTelefonoEntrega.value = "";
    if (origenEntrega) origenEntrega.value = "Fundación Hogar Amigo Peludo";
    if (tiempoRestanteEntrega) tiempoRestanteEntrega.value = "0";
    if (distanciaRestanteEntrega) distanciaRestanteEntrega.value = "0";
  }
}

async function guardarDatosEntrega() {
  const solicitud = buscarSolicitud(solicitudEntregaId);
  if (!solicitud) {
    mostrarMensaje("No se encontró la solicitud de entrega.", "error");
    return;
  }

  const modalidad = modalidadEntrega?.value;
  const esRecoger = esRecogerEnFundacion(modalidad);
  const direccion = direccionEntrega?.value.trim() ?? "";
  const origen = esRecoger
    ? origenEntrega?.value.trim() || "Fundación Hogar Amigo Peludo"
    : origenEntrega?.value.trim() ?? "";
  const fecha = fechaEntrega?.value ?? "";
  const horaEstimada = esRecoger ? "" : horaEstimadaEntrega?.value ?? "";
  const tiempoRestante = esRecoger
    ? 0
    : Math.max(0, Number(tiempoRestanteEntrega?.value) || 0);
  const distanciaRestante = esRecoger
    ? 0
    : Math.max(0, Number(distanciaRestanteEntrega?.value) || 0);
  const transportistaNombre = esRecoger
    ? "Recogida en fundación"
    : transportistaNombreEntrega?.value.trim() ?? "";
  const transportistaTelefono = esRecoger
    ? ""
    : transportistaTelefonoEntrega?.value.trim() ?? "";
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

  // Solo domicilio exige datos de transportadora.
  if (!esRecoger && (!transportistaNombre || !transportistaTelefono)) {
    mostrarMensaje("Escribe el nombre y teléfono del transportista.", "error");
    return;
  }

  try {
    await actualizarEnvio(solicitud.idSolicitud, {
      modalidad,
      direccion: modalidad === "Entrega a domicilio" ? direccion : "",
      origen,
      fechaEntrega: fecha,
      horaEstimada,
      tiempoRestante,
      distanciaRestante,
      transportistaNombre,
      transportistaTelefono,
      estadoEntrega: estado,
      estadoProceso: obtenerMensajeEstadoEntrega(estado, modalidad),
    });

    const estadosSincronizados = await sincronizarEstadoAdopcion(
      solicitud,
      estado
    );

    await refrescarSolicitudes();
    modalEntrega?.hide();
    mostrarMensaje(
      estadosSincronizados
        ? "Información de entrega y estado de adopción actualizados."
        : "La entrega se guardó, pero no se encontró la mascota para actualizar su estado.",
      estadosSincronizados ? "success" : "error"
    );
  } catch (error) {
    console.error(error);
    mostrarMensaje("No se pudo guardar la entrega.", "error");
  }
}

async function sincronizarEstadoAdopcion(solicitud, estadoEntregaActual) {
  const mascotaSolicitud = solicitud.mascota ?? {};
  const idMascota =
    mascotaSolicitud.id ??
    mascotaSolicitud.idMascota ??
    solicitud._api?.mascotaId ??
    solicitud.mascotaId;
  const entregaRecibida = esEntregaFinalizada(estadoEntregaActual);
  const estadoSolicitud = entregaRecibida ? "Adoptada" : "Coordinando entrega";

  await cambiarEstadoSolicitud(solicitud.idSolicitud, estadoSolicitud);

  let mascotas = [];
  try {
    mascotas = await obtenerMascotas();
  } catch (error) {
    console.error(error);
    return false;
  }

  let mascotaRegistrada = mascotas.find(
    (mascota) => Number(mascota.id) === Number(idMascota)
  );

  if (!mascotaRegistrada) {
    mascotaRegistrada = mascotas.find((mascota) => {
      const mismoNombre =
        normalizarTexto(mascota.nombre) ===
        normalizarTexto(mascotaSolicitud.nombre);
      const mismaImagen =
        mascotaSolicitud.imagen && mascota.imagen === mascotaSolicitud.imagen;
      return mismoNombre && (!mascotaSolicitud.imagen || mismaImagen);
    });
  }

  if (!mascotaRegistrada) {
    console.warn(
      "No se encontró la mascota asociada a la solicitud:",
      solicitud.idSolicitud
    );
    return false;
  }

  return actualizarMascota(
    mascotaRegistrada.id,
    entregaRecibida
      ? {
          estado: "Adoptado",
          fechaAdopcion: new Date().toISOString(),
          solicitudAdopcionId: solicitud.idSolicitud,
        }
      : {
          estado: "Disponible",
          fechaAdopcion: null,
          solicitudAdopcionId: null,
        }
  );
}

function normalizarTexto(valor) {
  return String(valor ?? "").trim().toLocaleLowerCase("es");
}

function obtenerMensajeEstadoEntrega(estado, modalidad = "") {
  if (esRecogerEnFundacion(modalidad) && esEntregaFinalizada(estado)) {
    return "La mascota fue recogida en la fundación.";
  }

  const mensajes = {
    "No enviado": "Estamos preparando la entrega.",
    "De camino": "La mascota está en ruta hacia el destino.",
    "En proceso de entrega": "El transportista está realizando la entrega.",
    Recibido: "La mascota fue recibida correctamente.",
    Recogido: "La mascota fue recogida en la fundación.",
  };

  return mensajes[estado] ?? "La entrega está siendo coordinada.";
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
