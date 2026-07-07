import {
  obtenerSolicitudes,
  cambiarEstadoSolicitud,
  actualizarEnvio,
} from "../31.2Dashboard/scripts/solicitudes.js";

const tbody = document.getElementById("tablaSolicitudes");
const panelDetalle = document.getElementById("panelDetalle");
const filtroFecha = document.getElementById("filtroFecha");
const filtroEstado = document.getElementById("filtroEstado");

let solicitudes = obtenerSolicitudes();

mostrarSolicitudes(solicitudes);
// Eventos de filtros
filtroFecha.addEventListener("change", filtrar);
filtroEstado.addEventListener("change", filtrar);











-------------------------------------------------------------------------

function filtrar() {
  let resultado = [...solicitudes];

  // Fecha

  if (filtroFecha.value != "") {
    resultado = resultado.filter((s) => {
      const fecha = convertirFecha(s.fechaSolicitud);

      return fecha == filtroFecha.value;
    });
  }

  // Estado

  if (filtroEstado.value != "") {
    resultado = resultado.filter(
      (s) => s.estadoSolicitud == filtroEstado.value,
    );
  }

  mostrarSolicitudes(resultado);
}

function mostrarSolicitudes(lista) {
  tbody.innerHTML = "";

  if (lista.length == 0) {
    tbody.innerHTML = `

        <tr>

            <td colspan="4" class="text-center">

                No hay solicitudes.

            </td>

        </tr>

        `;

    return;
  }

  lista.forEach((solicitud) => {
    let color = "secondary";

    switch (solicitud.estadoSolicitud) {
      case "Solicitud llenada":
        color = "primary";
        break;

      case "En revisión":
        color = "warning";
        break;

      case "Aceptada":
        color = "success";
        break;

      case "Negada":
        color = "danger";
        break;

      case "Coordinando entrega":
        color = "info";
        break;
    }

    tbody.innerHTML += `

        <tr>

            <td>

                ${solicitud.propietario.nombre}
                ${solicitud.propietario.apellido}

            </td>

            <td>

                ${solicitud.mascota.nombre}

            </td>

            <td>

                <span class="badge bg-${color}">

                    ${solicitud.estadoSolicitud}

                </span>

            </td>

            <td>

                <button
                    class="btn btn-outline-primary btn-sm btn-ver"
                    data-id="${solicitud.idSolicitud}">

                    Ver

                </button>

            </td>

        </tr>

        `;
  });
}

// Convierte 4/7/2026 -> 2026-07-04

function convertirFecha(fecha) {
  const partes = fecha.split("/");

  const dia = partes[0].padStart(2, "0");

  const mes = partes[1].padStart(2, "0");

  const anio = partes[2];

  return `${anio}-${mes}-${dia}`;
}

//-------------------------------------------------------------------------
//lado derecho formulario

// Evento para los botones "Ver"

tbody.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-ver")) return;

  const idSolicitud = Number(e.target.dataset.id);

  const solicitud = solicitudes.find((s) => s.idSolicitud === idSolicitud);

  mostrarDetalle(solicitud);
});

function mostrarDetalle(solicitud) {
    if (!solicitud.envio) {

    solicitud.envio = {

        modalidad: "Recoger en fundación",

        direccion: "",

        fechaEntrega: "",

        estadoEntrega: "No enviado",

        estadoProceso: ""

    };

}
    
  panelDetalle.innerHTML = `

        <img
            src="${solicitud.mascota.imagen}"
            class="img-fluid rounded mb-3"
            alt="${solicitud.mascota.nombre}">

        <h3>${solicitud.mascota.nombre}</h3>

        <span class="badge bg-primary mb-3">
            ${solicitud.estadoSolicitud}
        </span>

        <hr>

        <h5>Información del solicitante</h5>

        <p><strong>Nombre:</strong>
            ${solicitud.propietario.nombre}
            ${solicitud.propietario.apellido}
        </p>

        <p><strong>Documento:</strong>
            ${solicitud.propietario.documento}
        </p>

        <p><strong>Edad:</strong>
            ${solicitud.propietario.edad}
        </p>

        <p><strong>Correo:</strong>
            ${solicitud.propietario.correo}
        </p>

        <p><strong>Teléfono:</strong>
            ${solicitud.propietario.telefono}
        </p>

        <p><strong>País:</strong>
            ${solicitud.propietario.pais}
        </p>

        <p><strong>Ciudad:</strong>
            ${solicitud.propietario.ciudad}
        </p>

        <hr>

        <h5>Información de la vivienda</h5>

        <p><strong>Tipo:</strong>
            ${solicitud.propietario.tipoVivienda}
        </p>

        <p><strong>Régimen:</strong>
            ${solicitud.propietario.regimenVivienda}
        </p>

        <p><strong>Horas solo:</strong>
            ${solicitud.propietario.horasSola}
        </p>

        <p><strong>Otras mascotas:</strong>
            ${solicitud.propietario.otrasMascotas}
        </p>

        <hr>

        <h5>Mascota</h5>

        <p><strong>Nombre:</strong>
            ${solicitud.mascota.nombre}
        </p>

        <p><strong>Especie:</strong>
            ${solicitud.mascota.especie}
        </p>

        <p><strong>Sexo:</strong>
            ${solicitud.mascota.sexo}
        </p>

        <p><strong>Edad:</strong>
            ${solicitud.mascota.edad}
        </p>

        <p><strong>Tamaño:</strong>
            ${solicitud.mascota.tamano}
        </p>

        <p><strong>Estado:</strong>
            ${solicitud.mascota.estado}
        </p>

        <hr>

        <h5>Motivo de adopción</h5>

        <p>${solicitud.propietario.motivo}</p>
        <hr>

<h5>Cambiar estado de la solicitud</h5>

<div class="mb-3">

    <select
        class="form-select"
        id="nuevoEstado">

        <option
            value="Solicitud llenada"
            ${solicitud.estadoSolicitud == "Solicitud llenada" ? "selected" : ""}>

            Solicitud llenada

        </option>

        <option
            value="En revisión"
            ${solicitud.estadoSolicitud == "En revisión" ? "selected" : ""}>

            En revisión

        </option>

        <option
            value="Aceptada"
            ${solicitud.estadoSolicitud == "Aceptada" ? "selected" : ""}>

            Aceptada

        </option>

        <option
            value="Negada"
            ${solicitud.estadoSolicitud == "Negada" ? "selected" : ""}>

            Negada

        </option>

        <option
            value="Coordinando entrega"
            ${solicitud.estadoSolicitud == "Coordinando entrega" ? "selected" : ""}>

            Coordinando entrega

        </option>

    </select>

</div>

<button
    class="btn-submit"
    id="guardarEstado">

    Guardar cambios

</button>
${solicitud.estadoSolicitud === "Coordinando entrega" ? `

<hr>

<h5>Información de entrega</h5>

<div class="mb-3">

    <label class="form-label">
        Modalidad
    </label>

    <select
        id="modalidadEntrega"
        class="form-select">

        <option
            value="Recoger en fundación"
            ${solicitud.envio.modalidad === "Recoger en fundación" ? "selected" : ""}>

            Recoger en fundación

        </option>

        <option
            value="Entrega a domicilio"
            ${solicitud.envio.modalidad === "Entrega a domicilio" ? "selected" : ""}>

            Entrega a domicilio

        </option>

    </select>

</div>

<div class="mb-3">

    <label class="form-label">
        Dirección
    </label>

    <input
        type="text"
        class="form-control"
        id="direccionEntrega"
        value="${solicitud.envio.direccion}">

</div>

<div class="mb-3">

    <label class="form-label">
        Fecha de entrega
    </label>

    <input
        type="date"
        class="form-control"
        id="fechaEntrega"
        value="${solicitud.envio.fechaEntrega}">

</div>

<div class="mb-3">

    <label class="form-label">
        Estado del envío
    </label>

    <select
        id="estadoEntrega"
        class="form-select">

        <option
            value="No enviado"
            ${solicitud.envio.estadoEntrega === "No enviado" ? "selected" : ""}>

            No enviado

        </option>

        <option
            value="De camino"
            ${solicitud.envio.estadoEntrega === "De camino" ? "selected" : ""}>

            De camino

        </option>

        <option
            value="Recibido"
            ${solicitud.envio.estadoEntrega === "Recibido" ? "selected" : ""}>

            Recibido

        </option>

    </select>

</div>

<button
    id="guardarEntrega"
    class="btn-submit">

    Guardar información de entrega

</button>


`;
}

const botonGuardar = document.getElementById("guardarEstado");

botonGuardar.addEventListener("click", () => {

    const nuevoEstado =
        document.getElementById("nuevoEstado").value;

    cambiarEstadoSolicitud(
        solicitud.idSolicitud,
        nuevoEstado
    );

    solicitudes = obtenerSolicitudes();

    mostrarSolicitudes(solicitudes);

    const actualizada = solicitudes.find(
        s => s.idSolicitud === solicitud.idSolicitud
    );

    mostrarDetalle(actualizada);

});

const botonEntrega = document.getElementById("guardarEntrega");

if (botonEntrega) {

    botonEntrega.addEventListener("click", () => {

        actualizarEnvio(

            solicitud.idSolicitud,

            {

                modalidad:
                    document.getElementById("modalidadEntrega").value,

                direccion:
                    document.getElementById("direccionEntrega").value,

                fechaEntrega:
                    document.getElementById("fechaEntrega").value,

                estadoEntrega:
                    document.getElementById("estadoEntrega").value,

                estadoProceso:
                    "Nos estaremos contactando para coordinar la fecha."

            }

        );

        solicitudes = obtenerSolicitudes();

        const actualizada = solicitudes.find(
            s => s.idSolicitud === solicitud.idSolicitud
        );

        mostrarDetalle(actualizada);

        alert("Información de entrega actualizada.");

    });

}

