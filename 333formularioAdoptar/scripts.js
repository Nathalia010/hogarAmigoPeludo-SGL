import { obtenerMascotaPorId } from "../31.2Dashboard/scripts/mascotas.js";
import { agregarSolicitud } from "../31.2Dashboard/scripts/solicitudes.js";
import { existeUsuario, registrarUsuario } from "../registro/scripts/usuarios.js";

// Obtener el id de la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Buscar la mascota
const mascota = obtenerMascotaPorId(id);

if (!mascota) {
    alert("No se encontró la mascota.");
} else {
    document.getElementById("imagenMascota").src = mascota.imagen;
    document.getElementById("imagenMascota").alt = mascota.nombre;

    document.getElementById("nombreMascota").textContent = mascota.nombre;
    document.getElementById("estadoMascota").textContent = mascota.estado;

    document.getElementById("edadSexoMascota").textContent =
        `${mascota.edad} • ${mascota.sexo}`;

    document.getElementById("tamanoMascota").textContent = mascota.tamano;
    document.getElementById("especieMascota").textContent = mascota.especie;
    document.getElementById("sexoMascota").textContent = mascota.sexo;
    document.getElementById("descripcionMascota").textContent =
        mascota.descripcion;
}

// Formulario
const formulario = document.getElementById("formContacto");

// Popup de cuenta / inicio de sesión
const modalCuentaEl = document.getElementById("modalCuenta");
const modalCuentaBody = document.getElementById("modalCuentaBody");
const modalCuenta = new bootstrap.Modal(modalCuentaEl);

let solicitudPendiente = null;
let cuentaCreada = false;

formulario.addEventListener("submit", (e) => {

    e.preventDefault();

    const nuevaSolicitud = {

        mascota: {
            id: mascota.id,
            nombre: mascota.nombre,
            imagen: mascota.imagen,
            especie: mascota.especie,
            sexo: mascota.sexo,
            edad: mascota.edad,
            tamano: mascota.tamano,
            estado: mascota.estado,
            descripcion: mascota.descripcion
        },

        propietario: {

            nombre: document.getElementById("nombre").value,

            apellido: document.getElementById("apellidos").value,

            documento: document.getElementById("documento").value,

            edad: document.getElementById("edad").value,

            correo: document.getElementById("email").value,

            telefono: document.getElementById("telefono").value,

            pais: document.getElementById("pais").value,

            ciudad: document.getElementById("estado").value,

            tipoVivienda: document.getElementById("tipo_vivienda").value,

            regimenVivienda: document.getElementById("regimen_vivienda").value,

            horasSola: document.getElementById("horas_sola").value,

            otrasMascotas: document.getElementById("otras_mascotas").value,

            motivo: document.getElementById("motivo").value

        }

    };

    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

    // Ya tiene sesión activa: se envía igual que siempre
    if (usuarioLogueado) {
        enviarYRedirigir(nuevaSolicitud);
        return;
    }

    // No tiene sesión, pero el correo ya está registrado:
    // la solicitud se envía igual y solo se le pide iniciar sesión para ver el estado
    if (existeUsuario(nuevaSolicitud.propietario.correo)) {

        const guardado = agregarSolicitud(nuevaSolicitud);

        if (!guardado) {
            alert(`Ya tienes una solicitud registrada para adoptar a ${mascota.nombre}.`);
            return;
        }

        mostrarPopupYaRegistrado();
        return;
    }

    // Correo nuevo: se pide crear una cuenta antes de enviar la solicitud
    mostrarPopupCrearCuenta(nuevaSolicitud);

});

function enviarYRedirigir(nuevaSolicitud) {

    const guardado = agregarSolicitud(nuevaSolicitud);

    if (!guardado) {
        alert(`Ya tienes una solicitud registrada para adoptar a ${mascota.nombre}.`);
        return;
    }

    alert(`La solicitud para adoptar a ${mascota.nombre} fue enviada correctamente.`);
    formulario.reset();
    window.location.href = "../Usuario/solicitudes/solicitudes-usuario.html";

}

function mostrarPopupCrearCuenta(nuevaSolicitud) {

    solicitudPendiente = nuevaSolicitud;
    cuentaCreada = false;

    modalCuentaBody.innerHTML = `
        <div class="text-center mb-3">
            <div class="popup-icon">🔒</div>
            <h4>Crea una cuenta para ver el estado de tu adopción</h4>
            <p class="text-muted">
                Usaremos el nombre y correo que ya escribiste. Solo falta una contraseña.
            </p>
        </div>

        <div class="mb-3">
            <label class="form-label" for="popupPassword">Contraseña</label>
            <input
                type="password"
                id="popupPassword"
                class="form-control"
                placeholder="Mínimo 6 caracteres"
            >
        </div>

        <div class="mb-3">
            <label class="form-label" for="popupPasswordConfirm">Confirmar contraseña</label>
            <input
                type="password"
                id="popupPasswordConfirm"
                class="form-control"
                placeholder="Repite la contraseña"
            >
        </div>

        <p id="popupError" class="text-danger small mb-3"></p>

        <div class="d-flex gap-2">
            <button type="button" class="btn-submit flex-fill" id="btnCrearCuenta">
                Crear cuenta y enviar solicitud
            </button>
            <button type="button" class="btn btn-outline-secondary" id="btnCancelarRegistro">
                Cancelar
            </button>
        </div>
    `;

    document.getElementById("btnCrearCuenta")
        .addEventListener("click", confirmarCreacionCuenta);

    document.getElementById("btnCancelarRegistro")
        .addEventListener("click", () => modalCuenta.hide());

    modalCuenta.show();
}

function confirmarCreacionCuenta() {

    const password = document.getElementById("popupPassword").value;
    const passwordConfirm = document.getElementById("popupPasswordConfirm").value;
    const popupError = document.getElementById("popupError");

    if (password.length < 6) {
        popupError.textContent = "La contraseña debe tener mínimo 6 caracteres.";
        return;
    }

    if (password !== passwordConfirm) {
        popupError.textContent = "Las contraseñas no coinciden.";
        return;
    }

    const propietario = solicitudPendiente.propietario;

    registrarUsuario({
        email: propietario.correo,
        password,
        nombre: propietario.nombre,
        apellido: propietario.apellido,
        telefono: propietario.telefono
    });

    cuentaCreada = true;

    const guardado = agregarSolicitud(solicitudPendiente);

    modalCuenta.hide();

    if (!guardado) {
        alert(`Ya tienes una solicitud registrada para adoptar a ${solicitudPendiente.mascota.nombre}.`);
        return;
    }

    alert(`Cuenta creada. La solicitud para adoptar a ${solicitudPendiente.mascota.nombre} fue enviada correctamente.`);
    formulario.reset();
    window.location.href = "../Usuario/solicitudes/solicitudes-usuario.html";
}

function mostrarPopupYaRegistrado() {

    solicitudPendiente = null;

    modalCuentaBody.innerHTML = `
        <div class="text-center mb-3">
            <div class="popup-icon">✅</div>
            <h4>Usuario ya registrado</h4>
            <p class="text-muted">
                Ya existe una cuenta con este correo. Tu solicitud para adoptar a
                ${mascota.nombre} fue enviada. Inicia sesión para ver el estado de tu adopción.
            </p>
        </div>

        <div class="d-flex gap-2">
            <a href="../../login/login.html" class="btn-submit flex-fill text-center">
                Iniciar sesión
            </a>
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                Cerrar
            </button>
        </div>
    `;

    modalCuenta.show();
}

// Si el popup de "crear cuenta" se cierra sin haber creado la cuenta,
// la solicitud de adopción queda cancelada.
modalCuentaEl.addEventListener("hidden.bs.modal", () => {

    if (solicitudPendiente && !cuentaCreada) {
        alert(`Tu solicitud para adoptar a ${solicitudPendiente.mascota.nombre} fue cancelada porque no creaste una cuenta.`);
    }

    solicitudPendiente = null;
    cuentaCreada = false;
});
