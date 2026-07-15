import { obtenerSolicitudes, eliminarSolicitud } from "../../31.2Dashboard/scripts/solicitudes.js";
import { obtenerUsuarioLogueado } from "../../registro/scripts/usuarios.js";

const listaAdopciones = document.getElementById("listaAdopciones");
const sinAdopciones = document.getElementById("sinAdopciones");

const cantidadMascotas = document.getElementById("cantidadMascotas");
const cantidadSolicitudes = document.getElementById("cantidadSolicitudes");
const totalMascotas = document.getElementById("totalMascotas");

const nombreUsuario = document.getElementById("nombreUsuario");
const correoUsuario = document.getElementById("correoUsuario");
const telefonoUsuario = document.getElementById("telefonoUsuario");
const ciudadUsuario = document.getElementById("ciudadUsuario");
const miembroDesde = document.getElementById("miembroDesde");

const usuarioLogueado = obtenerUsuarioLogueado();

let solicitudes = obtenerSolicitudes().filter(
    (solicitud) => solicitud.propietario?.correo?.toLowerCase() === usuarioLogueado?.email?.toLowerCase()
);

mostrarAdopciones();
cargarInformacionUsuario();

function cargarInformacionUsuario() {
    if (solicitudes.length === 0) {
        return;
    }
    const usuario = solicitudes[0].propietario;
    nombreUsuario.textContent = `${usuario.nombre} ${usuario.apellido}`;
    correoUsuario.textContent = usuario.correo;
    telefonoUsuario.textContent = usuario.telefono;
    ciudadUsuario.textContent = usuario.ciudad;
    miembroDesde.textContent = `Miembro desde ${solicitudes[0].fechaSolicitud}`;
}

function mostrarAdopciones() {

    listaAdopciones.innerHTML = "";

    if (solicitudes.length === 0) {

        sinAdopciones.style.display = "block";

        cantidadMascotas.textContent = "0";
        cantidadSolicitudes.textContent = "0";
        totalMascotas.textContent = "0 mascotas";

        return;
    }

    sinAdopciones.style.display = "none";

    console.log(solicitudes);
    solicitudes.forEach((solicitud, index) => {
        const mascota = solicitud.mascota;
        cantidadMascotas.textContent = solicitudes.length;
        cantidadSolicitudes.textContent = solicitudes.length;
        totalMascotas.textContent = `${solicitudes.length} solicitud(es)`;

        listaAdopciones.innerHTML += `
            <div class="card mb-4 adoption-card">
                <div class="row g-0">
                    <div class="col-md-4 d-flex align-items-center">
                        <img src="${mascota.imagen}" class="card-img-top mascota-img rounded-start adoption-image" alt="${mascota.nombre}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <span class="estado-solicitud mb-2"> ${solicitud.estadoSolicitud} </span>
                            <h4> ${mascota.nombre} </h4>
                            <p class="descripcion-mascota"> ${mascota.descripcion} </p>
                            <p class="mb-2"><strong>Fecha de solicitud :</strong> ${solicitud.fechaSolicitud} </p>
                            <p class="mb-3"><strong>Proceso:</strong>${solicitud.envio.estadoProceso} </p>
                            <div class="row">
                                <div class="col-6">
                                    <strong>Especie</strong>
                                    <br>
                                    ${mascota.especie}
                                </div>
                                <div class="col-6">
                                    <strong>Edad</strong>
                                    <br>
                                    ${mascota.edad}
                                </div>
                                <div class="col-6 mt-3">
                                    <strong>Sexo</strong>
                                    <br>
                                    ${mascota.sexo}
                                </div>
                                <div class="col-6 mt-3">
                                    <strong>Tamaño</strong>
                                    <br>
                                    ${mascota.tamano}
                                </div>
                            </div>
                            <div class="d-flex gap-2 mt-4">
                                <button id="btnInfo" class="btn flex-fill" data-bs-toggle="modal" data-bs-target="#modalSolicitud${index}"> Ver información</button>
                                <button id="btnCancelar" class="btn btn-outline-danger" onclick="cancelarSolicitud(${solicitud.idSolicitud})"> Cancelar solicitud </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="modalSolicitud${index}" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">

                    <div class="modal-content">

                        <div class="modal-header">

                            <h4 class="modal-title">
                                 Información de la solicitud
                            </h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"> </button>
                        </div>

                        <div class="modal-body">

                            <div class="text-center mb-4">

                                <img src="${mascota.imagen}" class="img-fluid rounded shadow" style="max-height:250px; object-fit:cover;">

                                <h3 class="mt-3">${mascota.nombre}</h3>

                                <span class="estado-solicitud">
                                    ${solicitud.estadoSolicitud}
                                </span>

                            </div>

                            <hr>

                            <h5 class="mb-3">
                                 Datos del adoptante
                            </h5>

                            <div class="row">

                                <div class="col-md-6 mb-3">
                                    <strong>Nombre</strong><br>
                                    ${solicitud.propietario.nombre}
                                    ${solicitud.propietario.apellido}
                                </div>

                                <div class="col-md-6 mb-3">
                                    <strong>Documento</strong><br>
                                    ${solicitud.propietario.documento}
                                </div>

                                <div class="col-md-6 mb-3">
                                    <strong>Correo</strong><br>
                                    ${solicitud.propietario.correo}
                                </div>

                                <div class="col-md-6 mb-3">
                                    <strong>Teléfono</strong><br>
                                    ${solicitud.propietario.telefono}
                                </div>

                                <div class="col-md-6 mb-3">
                                    <strong>Edad</strong><br>
                                    ${solicitud.propietario.edad}
                                </div>

                                <div class="col-md-6 mb-3">
                                    <strong>Ciudad</strong><br>
                                    ${solicitud.propietario.ciudad}
                                </div>

                                <div class="col-md-6 mb-3">
                                    <strong>País</strong><br>
                                    ${solicitud.propietario.pais}
                                </div>

                            </div>

                            <hr>

                            <h5 class="mb-3">
                                 Información del hogar
                            </h5>

                            <div class="row">

                                <div class="col-md-6 mb-3">
                                    <strong>Tipo de vivienda</strong><br>
                                    ${solicitud.propietario.tipoVivienda}
                                </div>

                                <div class="col-md-6 mb-3">
                                    <strong>Régimen</strong><br>
                                    ${solicitud.propietario.regimenVivienda}
                                </div>

                                <div class="col-md-6 mb-3">
                                    <strong>Otras mascotas</strong><br>
                                    ${solicitud.propietario.otrasMascotas}
                                </div>

                                <div class="col-md-6 mb-3">
                                    <strong>Horas solo</strong><br>
                                    ${solicitud.propietario.horasSolo}
                                </div>

                            </div>

                            <hr>

                            <h5 class="mb-3">
                                 Información de entrega
                            </h5>

                            <div class="row">

                                <div class="col-md-6 mb-3">
                                    <strong>Modalidad</strong><br>
                                    ${solicitud.envio.modalidad}
                                </div>

                                <div class="col-md-6 mb-3">
                                    <strong>Estado de entrega</strong><br>
                                    ${solicitud.envio.estadoEntrega}
                                </div>

                                <div class="col-md-6 mb-3">
                                    <strong>Fecha de entrega</strong><br>
                                    ${solicitud.envio.fechaEntrega || "Pendiente"}
                                </div>

                                <div class="col-md-6 mb-3">
                                    <strong>Dirección</strong><br>
                                    ${solicitud.envio.direccion || "Pendiente"}
                                </div>

                            </div>

                            <hr>

                            <h5 class="mb-3">
                                 Motivo de adopción
                            </h5>

                            <div class="alert alert-light border">
                                ${solicitud.propietario.motivo}
                            </div>

                        </div>

                        <div class="modal-footer">
                            <button class="btn btn-secondary" data-bs-dismiss="modal"> Cerrar </button>
                        </div>

                    </div>

                </div>
            </div>
        `;
    });
}
function cancelarSolicitud(idSolicitud){
    const confirmar = confirm("¿Deseas cancelar esta solicitud de adopción?");
    if(!confirmar){
        return;
    }
    eliminarSolicitud(idSolicitud);
    solicitudes = obtenerSolicitudes().filter(
        (solicitud) => solicitud.propietario?.correo?.toLowerCase() === usuarioLogueado?.email?.toLowerCase()
    );
    mostrarAdopciones();
}
window.cancelarSolicitud = cancelarSolicitud;


const btnEditarPerfil = document.getElementById("btnEditarPerfil");
btnEditarPerfil.addEventListener("click", () => {
    alert("Pendiente de edicion con base de datos.");
});