import {
  obtenerSolicitudes,
  cambiarEstadoSolicitud,
  actualizarEnvio,
} from "../31.2Dashboard/scripts/solicitudes.js";

const tbody = document.getElementById("tablaSolicitudes");
const panelDetalle = document.getElementById("panelDetalle");
const filtroFecha = document.getElementById("filtroFecha");
const filtroEstado = document.getElementById("filtroEstado");

let solicitudes = [];

/* =====================================================
   INICIALIZACIÓN
===================================================== */

async function iniciar() {
  if (!tbody) {
    console.error(
      'No se encontró el elemento con id="tablaSolicitudes".'
    );
    return;
  }

  if (!panelDetalle) {
    console.error(
      'No se encontró el elemento con id="panelDetalle".'
    );
    return;
  }

  try {
    solicitudes = await obtenerSolicitudes();
    mostrarSolicitudes(solicitudes);
  } catch (error) {
    console.error(error);
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-danger">
          No se pudieron cargar las solicitudes. ¿Backend en :8080?
        </td>
      </tr>
    `;
  }

  filtroFecha?.addEventListener("change", filtrar);
  filtroEstado?.addEventListener("change", filtrar);
}

async function refrescarSolicitudes() {
  solicitudes = await obtenerSolicitudes();
  filtrar();
}

/* =====================================================
   FILTROS
===================================================== */

function filtrar() {
  let resultado = [...solicitudes];

  const fechaSeleccionada = filtroFecha?.value ?? "";
  const estadoSeleccionado = filtroEstado?.value ?? "";

  if (fechaSeleccionada !== "") {
    resultado = resultado.filter((solicitud) => {
      return convertirFecha(solicitud.fechaSolicitud) === fechaSeleccionada;
    });
  }

  if (estadoSeleccionado !== "") {
    resultado = resultado.filter((solicitud) => {
      return solicitud.estadoSolicitud === estadoSeleccionado;
    });
  }

  mostrarSolicitudes(resultado);
}

/**
 * Convierte fechas como:
 * 4/7/2026 -> 2026-07-04
 * 2026-07-04 -> 2026-07-04
 */
function convertirFecha(fecha) {
  if (!fecha) {
    return "";
  }

  const fechaTexto = String(fecha).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)) {
    return fechaTexto;
  }

  const partes = fechaTexto.split(/[/-]/);

  if (partes.length !== 3) {
    return "";
  }

  let primeraParte = Number(partes[0]);
  let segundaParte = Number(partes[1]);
  const anio = partes[2];

  let dia;
  let mes;

  /*
   * Si la primera parte es mayor que 12:
   * se entiende como día/mes/año.
   *
   * Si la segunda parte es mayor que 12:
   * se entiende como mes/día/año.
   *
   * Si ambas son menores o iguales a 12:
   * se usa día/mes/año.
   */
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

/* =====================================================
   TABLA DE SOLICITUDES
===================================================== */

function mostrarSolicitudes(lista) {
  if (!Array.isArray(lista) || lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center">
          No hay solicitudes.
        </td>
      </tr>
    `;

    return;
  }

  tbody.innerHTML = lista
    .map((solicitud) => {
      const color = obtenerColorEstado(
        solicitud.estadoSolicitud
      );

      const propietario = solicitud.propietario ?? {};
      const mascota = solicitud.mascota ?? {};

      return `
        <tr>
          <td>
            ${propietario.nombre ?? ""}
            ${propietario.apellido ?? ""}
          </td>

          <td>
            ${mascota.nombre ?? "Sin información"}
          </td>

          <td>
            <span class="badge bg-${color}">
              ${solicitud.estadoSolicitud ?? "Sin estado"}
            </span>
          </td>

          <td>
            <button
              type="button"
              class="btn btn-outline-primary btn-sm btn-ver"
              data-id="${solicitud.idSolicitud}"
            >
              Ver
            </button>
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

/* =====================================================
   BOTÓN VER
===================================================== */

tbody.addEventListener("click", (evento) => {
  const botonVer = evento.target.closest(".btn-ver");

  if (!botonVer) {
    return;
  }

  const idSolicitud = Number(botonVer.dataset.id);

  const solicitud = solicitudes.find((item) => {
    return Number(item.idSolicitud) === idSolicitud;
  });

  if (!solicitud) {
    alert("No se encontró la solicitud seleccionada.");
    return;
  }

  mostrarDetalle(solicitud);
});

/* =====================================================
   DETALLE DE LA SOLICITUD
===================================================== */

function mostrarDetalle(solicitud) {
  if (!solicitud) {
    panelDetalle.innerHTML = `
      <div class="alert alert-warning">
        No se encontró la solicitud.
      </div>
    `;
    return;
  }

  const propietario = solicitud.propietario ?? {};
  const mascota = solicitud.mascota ?? {};

  const envio = solicitud.envio ?? {
    modalidad: "Recoger en fundación",
    direccion: "",
    fechaEntrega: "",
    estadoEntrega: "No enviado",
    estadoProceso:
      "Nos estaremos contactando para coordinar la fecha.",
  };

  panelDetalle.innerHTML = `
    <img
      src="${mascota.imagen ?? ""}"
      class="img-fluid rounded mb-3"
      alt="${mascota.nombre ?? "Mascota"}"
    >

    <h3>${mascota.nombre ?? "Sin nombre"}</h3>

    <span class="badge bg-${obtenerColorEstado(
      solicitud.estadoSolicitud
    )} mb-3">
      ${solicitud.estadoSolicitud ?? "Sin estado"}
    </span>

    <hr>

    <h5>Información del solicitante</h5>

    <p>
      <strong>Nombre:</strong>
      ${propietario.nombre ?? "No registrado"}
      ${propietario.apellido ?? ""}
    </p>

    <p>
      <strong>Documento:</strong>
      ${propietario.documento ?? "No registrado"}
    </p>

    <p>
      <strong>Edad:</strong>
      ${propietario.edad ?? "No registrada"}
    </p>

    <p>
      <strong>Correo:</strong>
      ${propietario.correo ?? "No registrado"}
    </p>

    <p>
      <strong>Teléfono:</strong>
      ${propietario.telefono ?? "No registrado"}
    </p>

    <p>
      <strong>País:</strong>
      ${propietario.pais ?? "No registrado"}
    </p>

    <p>
      <strong>Ciudad:</strong>
      ${propietario.ciudad ?? "No registrada"}
    </p>

    <hr>

    <h5>Información de la vivienda</h5>

    <p>
      <strong>Tipo:</strong>
      ${propietario.tipoVivienda ?? "No registrado"}
    </p>

    <p>
      <strong>Régimen:</strong>
      ${propietario.regimenVivienda ?? "No registrado"}
    </p>

    <p>
      <strong>Horas solo:</strong>
      ${propietario.horasSola ?? "No registrado"}
    </p>

    <p>
      <strong>Otras mascotas:</strong>
      ${propietario.otrasMascotas ?? "No registrado"}
    </p>

    <hr>

    <h5>Mascota</h5>

    <p>
      <strong>Nombre:</strong>
      ${mascota.nombre ?? "No registrado"}
    </p>

    <p>
      <strong>Especie:</strong>
      ${mascota.especie ?? "No registrada"}
    </p>

    <p>
      <strong>Sexo:</strong>
      ${mascota.sexo ?? "No registrado"}
    </p>

    <p>
      <strong>Edad:</strong>
      ${mascota.edad ?? "No registrada"}
    </p>

    <p>
      <strong>Tamaño:</strong>
      ${mascota.tamano ?? "No registrado"}
    </p>

    <p>
      <strong>Estado:</strong>
      ${mascota.estado ?? "No registrado"}
    </p>

    <hr>

    <h5>Motivo de adopción</h5>

    <p>
      ${propietario.motivo ?? "No se registró un motivo."}
    </p>

    <hr>

    <h5>Cambiar estado de la solicitud</h5>

    <div class="mb-3">
      <select
        class="form-select"
        id="nuevoEstado"
      >
        <option
          value="Solicitud llenada"
          ${
            solicitud.estadoSolicitud === "Solicitud llenada"
              ? "selected"
              : ""
          }
        >
          Solicitud llenada
        </option>

        <option
          value="En revisión"
          ${
            solicitud.estadoSolicitud === "En revisión"
              ? "selected"
              : ""
          }
        >
          En revisión
        </option>

        <option
          value="Aceptada"
          ${
            solicitud.estadoSolicitud === "Aceptada"
              ? "selected"
              : ""
          }
        >
          Aceptada
        </option>

        <option
          value="Negada"
          ${
            solicitud.estadoSolicitud === "Negada"
              ? "selected"
              : ""
          }
        >
          Negada
        </option>

        <option
          value="Coordinando entrega"
          ${
            solicitud.estadoSolicitud === "Coordinando entrega"
              ? "selected"
              : ""
          }
        >
          Coordinando entrega
        </option>
      </select>
    </div>

    <button
      type="button"
      class="btn-submit"
      id="guardarEstado"
    >
      Guardar cambios
    </button>

    ${
      solicitud.estadoSolicitud === "Coordinando entrega"
        ? `
          <hr>

          <h5>Información de entrega</h5>

          <div class="mb-3">
            <label
              for="modalidadEntrega"
              class="form-label"
            >
              Modalidad
            </label>

            <select
              id="modalidadEntrega"
              class="form-select"
            >
              <option
                value="Recoger en fundación"
                ${
                  envio.modalidad === "Recoger en fundación"
                    ? "selected"
                    : ""
                }
              >
                Recoger en fundación
              </option>

              <option
                value="Entrega a domicilio"
                ${
                  envio.modalidad === "Entrega a domicilio"
                    ? "selected"
                    : ""
                }
              >
                Entrega a domicilio
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label
              for="direccionEntrega"
              class="form-label"
            >
              Dirección
            </label>

            <input
              type="text"
              class="form-control"
              id="direccionEntrega"
              value="${envio.direccion ?? ""}"
            >
          </div>

          <div class="mb-3">
            <label
              for="fechaEntrega"
              class="form-label"
            >
              Fecha de entrega
            </label>

            <input
              type="date"
              class="form-control"
              id="fechaEntrega"
              value="${envio.fechaEntrega ?? ""}"
            >
          </div>

          <div class="mb-3">
            <label
              for="estadoEntrega"
              class="form-label"
            >
              Estado del envío
            </label>

            <select
              id="estadoEntrega"
              class="form-select"
            >
              <option
                value="No enviado"
                ${
                  envio.estadoEntrega === "No enviado"
                    ? "selected"
                    : ""
                }
              >
                No enviado
              </option>

              <option
                value="De camino"
                ${
                  envio.estadoEntrega === "De camino"
                    ? "selected"
                    : ""
                }
              >
                De camino
              </option>

              <option
                value="Recibido"
                ${
                  envio.estadoEntrega === "Recibido"
                    ? "selected"
                    : ""
                }
              >
                Recibido
              </option>
            </select>
          </div>

          <button
            type="button"
            id="guardarEntrega"
            class="btn-submit"
          >
            Guardar información de entrega
          </button>
        `
        : ""
    }
  `;

  agregarEventosDetalle(solicitud);
}

/* =====================================================
   EVENTOS DEL PANEL DE DETALLE
===================================================== */

function agregarEventosDetalle(solicitud) {
  const botonGuardarEstado =
    document.getElementById("guardarEstado");

  botonGuardarEstado?.addEventListener("click", async () => {
    const selectorEstado =
      document.getElementById("nuevoEstado");

    if (!selectorEstado) {
      return;
    }

    const nuevoEstado = selectorEstado.value;

    try {
      await cambiarEstadoSolicitud(
        solicitud.idSolicitud,
        nuevoEstado
      );

      await refrescarSolicitudes();

      const solicitudActualizada = solicitudes.find((item) => {
        return (
          Number(item.idSolicitud) ===
          Number(solicitud.idSolicitud)
        );
      });

      if (solicitudActualizada) {
        mostrarDetalle(solicitudActualizada);
      }

      alert("Estado de la solicitud actualizado.");
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el estado.");
    }
  });

  const botonGuardarEntrega =
    document.getElementById("guardarEntrega");

  botonGuardarEntrega?.addEventListener("click", async () => {
    const modalidad =
      document.getElementById("modalidadEntrega")?.value;

    const direccion =
      document.getElementById("direccionEntrega")?.value.trim();

    const fechaEntrega =
      document.getElementById("fechaEntrega")?.value;

    const estadoEntrega =
      document.getElementById("estadoEntrega")?.value;

    if (!modalidad || !estadoEntrega) {
      alert("Completa la información de entrega.");
      return;
    }

    if (
      modalidad === "Entrega a domicilio" &&
      !direccion
    ) {
      alert(
        "Debes escribir una dirección para la entrega a domicilio."
      );
      return;
    }

    const envioActualizado = {
      modalidad,
      direccion:
        modalidad === "Entrega a domicilio"
          ? direccion
          : "",
      fechaEntrega: fechaEntrega ?? "",
      estadoEntrega,
      estadoProceso:
        estadoEntrega === "Recibido"
          ? "La mascota fue recibida."
          : "Nos estaremos contactando para coordinar la fecha.",
    };

    try {
      await actualizarEnvio(
        solicitud.idSolicitud,
        envioActualizado
      );

      await refrescarSolicitudes();

      const solicitudActualizada = solicitudes.find((item) => {
        return (
          Number(item.idSolicitud) ===
          Number(solicitud.idSolicitud)
        );
      });

      if (solicitudActualizada) {
        mostrarDetalle(solicitudActualizada);
      }

      alert("Información de entrega actualizada.");
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar la entrega.");
    }
  });
}

iniciar();