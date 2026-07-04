import { obtenerSolicitudes } from "../../31.2Dashboard/scripts/solicitudes.js";

const contenedor = document.getElementById("contenedorSolicitudes");

mostrarSolicitudes();

function mostrarSolicitudes() {

    const solicitudes = obtenerSolicitudes();

    contenedor.innerHTML = "";

    if (solicitudes.length === 0) {

        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-paw fa-4x text-secondary mb-3"></i>
                <h3>No tienes solicitudes de adopción.</h3>
                <p class="text-muted">
                    Cuando envíes una solicitud aparecerá aquí.
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

        }

        contenedor.innerHTML += `

        <div class="col-lg-6">

            <div class="card shadow-sm h-100">

                <img
                    src="${solicitud.mascota.imagen}"
                    class="card-img-top"
                    alt="${solicitud.mascota.nombre}"
                    style="height:250px; object-fit:cover;">

                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-center">

                        <h4>${solicitud.mascota.nombre}</h4>

                        <span class="badge bg-${colorEstado}">
                            ${solicitud.estadoSolicitud}
                        </span>

                    </div>

                    <hr>

                    <p>
                        <strong>Especie:</strong>
                        ${solicitud.mascota.especie}
                    </p>

                    <p>
                        <strong>Género:</strong>
                        ${solicitud.mascota.sexo}
                    </p>

                    <p>
                        <strong>Edad:</strong>
                        ${solicitud.mascota.edad}
                    </p>

                    <p>
                        <strong>Tamaño:</strong>
                        ${solicitud.mascota.tamano}
                    </p>

                    <p>
                        <strong>Estado de salud:</strong>
                        ${solicitud.mascota.estado}
                    </p>

                    <p>
                        <strong>Fecha de solicitud:</strong>
                        ${solicitud.fechaSolicitud}
                    </p>

                    <button
                        class="btn btn-outline-primary mt-2"
                        data-bs-toggle="collapse"
                        data-bs-target="#detalle${index}">

                        Ver información

                    </button>

                    ${
                        solicitud.estadoSolicitud === "Coordinando entrega"

                        ?

                        `<a
                            href="../Proceso-Entrega/proceso-entrega.html?id=${solicitud.idSolicitud}"
                            class="btn btn-success mt-2">

                            Ver envío

                        </a>`

                        :

                        ""

                    }

                    <div
                        class="collapse mt-4"
                        id="detalle${index}">

                        <hr>

                        <h5>Información del solicitante</h5>

                        <p>
                            <strong>Nombre:</strong>
                            ${solicitud.propietario.nombre}
                            ${solicitud.propietario.apellido}
                        </p>

                        <p>
                            <strong>Documento:</strong>
                            ${solicitud.propietario.documento}
                        </p>

                        <p>
                            <strong>Correo:</strong>
                            ${solicitud.propietario.correo}
                        </p>

                        <p>
                            <strong>Teléfono:</strong>
                            ${solicitud.propietario.telefono}
                        </p>

                        <p>
                            <strong>Ciudad:</strong>
                            ${solicitud.propietario.ciudad}
                        </p>

                        <p>
                            <strong>Tipo de vivienda:</strong>
                            ${solicitud.propietario.tipoVivienda}
                        </p>

                        <p>
                            <strong>Motivo:</strong>
                        </p>

                        <p>
                            ${solicitud.propietario.motivo}
                        </p>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

}