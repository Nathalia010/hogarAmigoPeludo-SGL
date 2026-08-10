import {
  obtenerSolicitudes,
  eliminarSolicitud,
} from "../../31.2Dashboard/scripts/solicitudes.js";
import { actualizarMascota } from "../../31.2Dashboard/scripts/mascotas.js";
import { obtenerUsuarioLogueado } from "../../registro/scripts/usuarios.js";

const contenedor = document.getElementById("contenedorSolicitudes");
const inputDocumento = document.getElementById("buscarDocumento");
const btnBuscar = document.getElementById("btnBuscar");
const filtroEstado = document.getElementById("filtroEstado");

let cacheSolicitudes = [];

async function cargarSolicitudes() {
  try {
    cacheSolicitudes = await obtenerSolicitudes();
    if (!Array.isArray(cacheSolicitudes)) {
      cacheSolicitudes = [];
    }
  } catch (error) {
    console.error(error);
    contenedor.classList.add("vacio");
    contenedor.innerHTML = `
      <div class="estado-vacio">
        <h3>No se pudieron cargar las solicitudes</h3>
        <p>Verifica que el backend esté en http://localhost:8080</p>
      </div>
    `;
    return [];
  }
  return cacheSolicitudes;
}

/**
 * Base: solo solicitudes del correo logueado.
 * Extra: filtro por cédula (documento) y por estado.
 */
function filtrarSolicitudes() {
  const usuario = obtenerUsuarioLogueado();
  const documento = inputDocumento?.value.trim() || "";
  const estado = filtroEstado?.value || "";

  let lista = [...cacheSolicitudes];

  if (usuario?.email) {
    lista = lista.filter(
      (s) =>
        String(s.propietario?.correo || "")
          .trim()
          .toLowerCase() === String(usuario.email).trim().toLowerCase()
    );
  } else if (documento) {
    // Sin sesión: permite consultar por cédula.
    lista = lista.filter(
      (s) => String(s.propietario?.documento || "") === documento
    );
  } else {
    return [];
  }

  if (usuario?.email && documento) {
    lista = lista.filter(
      (s) => String(s.propietario?.documento || "") === documento
    );
  }

  if (estado) {
    lista = lista.filter((s) => s.estadoSolicitud === estado);
  }

  return lista;
}

async function buscarSolicitudes() {
  await cargarSolicitudes();
  const usuario = obtenerUsuarioLogueado();
  const documento = inputDocumento?.value.trim() || "";

  if (!usuario?.email && !documento) {
    mostrarEstadoBusqueda();
    return;
  }

  mostrarSolicitudes(filtrarSolicitudes());
}

function mostrarEstadoBusqueda() {
  contenedor.classList.add("vacio");
  contenedor.innerHTML = `
    <div class="estado-vacio">
      <i class="bi bi-search"></i>
      <h3>Busca una solicitud</h3>
      <p>
        Inicia sesión para ver tus solicitudes por correo, o ingresa el
        número de documento (cédula) para consultarlas.
      </p>
    </div>
  `;
}

function mostrarSolicitudes(solicitudes) {
  const contadorSolicitudes = document.getElementById("navRequestCount");
  if (contadorSolicitudes) {
    contadorSolicitudes.textContent = solicitudes.length;
  }

  contenedor.innerHTML = "";
  contenedor.classList.remove("vacio");

  if (solicitudes.length === 0) {
    contenedor.classList.add("vacio");
    contenedor.innerHTML = `
      <div class="estado-vacio">
        <i class="bi bi-search"></i>
        <h3>No se encontraron solicitudes</h3>
        <p>
          No hay solicitudes asociadas a tu correo
          ${obtenerUsuarioLogueado()?.email ? `(${obtenerUsuarioLogueado().email})` : ""}
          con los filtros actuales.
        </p>
      </div>
    `;
    return;
  }

  solicitudes.forEach((solicitud, index) => {
    let colorEstado = "secondary";

    switch (solicitud.estadoSolicitud) {
      case "Solicitud llenada":
        colorEstado = "primary";
        break;
      case "En revisión":
        colorEstado = "warning";
        break;
      case "Aceptada":
        colorEstado = "success";
        break;
      case "Negada":
        colorEstado = "danger";
        break;
      case "Coordinando entrega":
        colorEstado = "info";
        break;
      case "Adoptada":
        colorEstado = "success";
        break;
    }

    contenedor.innerHTML += `
      <div class="pet-card">
        <div class="card shadow-sm h-100">
          <img
            src="${solicitud.mascota?.imagen || ""}"
            class="card-img-top"
            alt="${solicitud.mascota?.nombre || "Mascota"}"
            style="height:250px; object-fit:cover;">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <h4>${solicitud.mascota?.nombre || "Mascota"}</h4>
              <span class="badge bg-${colorEstado}">
                ${solicitud.estadoSolicitud}
              </span>
            </div>
            <hr>
            <p><strong>Especie:</strong> ${solicitud.mascota?.especie || ""}</p>
            <p><strong>Género:</strong> ${solicitud.mascota?.sexo || ""}</p>
            <p><strong>Edad:</strong> ${solicitud.mascota?.edad || ""}</p>
            <p><strong>Tamaño:</strong> ${solicitud.mascota?.tamano || ""}</p>
            <p><strong>Fecha de solicitud:</strong> ${solicitud.fechaSolicitud || ""}</p>
            <button
              class="btn btn-outline-primary mt-2"
              data-bs-toggle="collapse"
              data-bs-target="#detalle${index}">
              Ver información
            </button>
            ${
              ["Coordinando entrega", "Adoptada"].includes(
                solicitud.estadoSolicitud
              )
                ? `<a
                    href="../Proceso-Entrega/proceso-entrega.html?id=${solicitud.idSolicitud}"
                    class="btn btn-success mt-2">
                    Ver envío
                  </a>`
                : ""
            }
            <div class="collapse mt-4" id="detalle${index}">
              <hr>
              <h5>Información del solicitante</h5>
              <p>
                <strong>Nombre:</strong>
                ${solicitud.propietario?.nombre || ""}
                ${solicitud.propietario?.apellido || ""}
              </p>
              <p><strong>Documento:</strong> ${solicitud.propietario?.documento || ""}</p>
              <p><strong>Correo:</strong> ${solicitud.propietario?.correo || ""}</p>
              <p><strong>Teléfono:</strong> ${solicitud.propietario?.telefono || ""}</p>
              <p><strong>Ciudad:</strong> ${solicitud.propietario?.ciudad || ""}</p>
              <p><strong>Tipo de vivienda:</strong> ${solicitud.propietario?.tipoVivienda || ""}</p>
              <p><strong>Motivo:</strong></p>
              <p>${solicitud.propietario?.motivo || ""}</p>
              <button
                type="button"
                class="btn btn-outline-danger mt-3 w-100"
                data-eliminar-solicitud="${solicitud.idSolicitud}">
                <i class="fa-regular fa-trash-can"></i>
                Eliminar solicitud
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

btnBuscar?.addEventListener("click", () => {
  buscarSolicitudes();
});

inputDocumento?.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    buscarSolicitudes();
  }
});

filtroEstado?.addEventListener("change", () => {
  const usuario = obtenerUsuarioLogueado();
  if (usuario?.email || inputDocumento?.value.trim()) {
    mostrarSolicitudes(filtrarSolicitudes());
  }
});

contenedor?.addEventListener("click", async (event) => {
  const botonEliminar = event.target.closest("[data-eliminar-solicitud]");
  if (!botonEliminar) return;

  const idSolicitud = botonEliminar.dataset.eliminarSolicitud;
  const solicitud = cacheSolicitudes.find(
    (item) => Number(item.idSolicitud) === Number(idSolicitud)
  );

  if (!solicitud) {
    await buscarSolicitudes();
    return;
  }

  const nombreMascota = solicitud.mascota?.nombre || "esta mascota";
  const confirmar = window.confirm(
    `¿Deseas eliminar la solicitud de ${nombreMascota}? Esta acción no se puede deshacer.`
  );
  if (!confirmar) return;

  const adopcionFinalizada =
    solicitud.estadoSolicitud === "Adoptada" ||
    solicitud.envio?.estadoEntrega === "Recibido";

  try {
    if (!adopcionFinalizada) {
      const idMascota = solicitud.mascota?.id;
      if (idMascota != null) {
        await actualizarMascota(idMascota, { estado: "Disponible" });
      }
    }

    await eliminarSolicitud(idSolicitud);
    await buscarSolicitudes();
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar la solicitud.");
  }
});

(async function iniciar() {
  await cargarSolicitudes();
  const usuario = obtenerUsuarioLogueado();

  if (usuario?.email) {
    // Cliente logueado: muestra solo sus solicitudes por correo.
    mostrarSolicitudes(filtrarSolicitudes());
  } else {
    mostrarEstadoBusqueda();
  }
})();
