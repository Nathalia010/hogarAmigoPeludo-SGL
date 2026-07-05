import { obtenerSolicitudes, eliminarSolicitud } from "../../31.2Dashboard/scripts/solicitudes.js";

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

let solicitudes = obtenerSolicitudes();

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

    solicitudes.forEach((solicitud) => {
        const mascota = solicitud.mascota;
        cantidadMascotas.textContent = solicitudes.length;
        cantidadSolicitudes.textContent = solicitudes.length;
        totalMascotas.textContent = `${solicitudes.length} solicitud(es)`;

        listaAdopciones.innerHTML += `
            <div class="card mb-4 adoption-card">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${mascota.imagen}" class="img-fluid rounded-start adoption-image" alt="${mascota.nombre}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <span class="estado-solicitud mb-2"> ${solicitud.estadoSolicitud} </span>
                            <h4> ${mascota.nombre} </h4>
                            <p> ${mascota.descripcion} </p>
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
                                <button id="btnContinuar" class="btn  flex-fill"> Continuar proceso </button>
                                <button id="btnCancelar" class="btn btn-outline-danger" onclick="cancelarSolicitud(${solicitud.idSolicitud})"> Cancelar solicitud </button>
                            </div>
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
    solicitudes = obtenerSolicitudes();
    mostrarAdopciones();
}
window.cancelarSolicitud = cancelarSolicitud;


const btnEditarPerfil = document.getElementById("btnEditarPerfil");
btnEditarPerfil.addEventListener("click", () => {
    alert("Pendiente de edicion con base de datos.");
});