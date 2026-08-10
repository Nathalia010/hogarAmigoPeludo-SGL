import { obtenerMascotaPorId } from "../31.2Dashboard/scripts/mascotas.js";
import { agregarSolicitud } from "../31.2Dashboard/scripts/solicitudes.js";
import { existeUsuario, registrarUsuario } from "../registro/scripts/usuarios.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let mascota = null;

const formulario = document.getElementById("formContacto");
const modalCuentaEl = document.getElementById("modalCuenta");
const modalCuentaBody = document.getElementById("modalCuentaBody");
const modalCuenta = new bootstrap.Modal(modalCuentaEl);

let solicitudPendiente = null;
let cuentaCreada = false;

async function cargarMascota() {
  mascota = await obtenerMascotaPorId(id);

  if (!mascota) {
    alert("No se encontró la mascota.");
    return;
  }

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

cargarMascota().catch((error) => {
  console.error(error);
  alert(
    "No se pudo cargar la mascota. Verifica que el backend esté en http://localhost:8080"
  );
});

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!mascota) {
    alert("La mascota aún no está cargada. Intenta de nuevo.");
    return;
  }

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
      descripcion: mascota.descripcion,
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
      motivo: document.getElementById("motivo").value,
    },
  };

  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

  if (usuarioLogueado) {
    await enviarYRedirigir(nuevaSolicitud);
    return;
  }

  try {
    if (await existeUsuario(nuevaSolicitud.propietario.correo)) {
      const guardado = await agregarSolicitud(nuevaSolicitud);

      if (!guardado) {
        alert(
          `Ya tienes una solicitud registrada para adoptar a ${mascota.nombre}.`
        );
        return;
      }

      mostrarPopupYaRegistrado();
      return;
    }
  } catch (error) {
    console.error(error);
    alert("No se pudo verificar el correo. Revisa la consola.");
    return;
  }

  mostrarPopupCrearCuenta(nuevaSolicitud);
});

async function enviarYRedirigir(nuevaSolicitud) {
  try {
    const guardado = await agregarSolicitud(nuevaSolicitud);

    if (!guardado) {
      alert(
        `Ya tienes una solicitud registrada para adoptar a ${mascota.nombre}.`
      );
      return;
    }

    alert(
      `La solicitud para adoptar a ${mascota.nombre} fue enviada correctamente.`
    );
    formulario.reset();
    window.location.href = "../33333PerfilUsuario/perfil.html";
  } catch (error) {
    console.error(error);
    alert("No se pudo enviar la solicitud. Revisa la consola.");
  }
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

  document
    .getElementById("btnCrearCuenta")
    .addEventListener("click", confirmarCreacionCuenta);

  document
    .getElementById("btnCancelarRegistro")
    .addEventListener("click", () => modalCuenta.hide());

  modalCuenta.show();
}

async function confirmarCreacionCuenta() {
  const password = document.getElementById("popupPassword").value;
  const passwordConfirm = document.getElementById(
    "popupPasswordConfirm"
  ).value;
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

  try {
    const creado = await registrarUsuario({
      email: propietario.correo,
      password,
      nombre: propietario.nombre,
      apellido: propietario.apellido,
      telefono: propietario.telefono,
    });

    if (!creado) {
      popupError.textContent = "Ya existe una cuenta con este correo.";
      return;
    }

    cuentaCreada = true;

    const guardado = await agregarSolicitud(solicitudPendiente);

    modalCuenta.hide();

    if (!guardado) {
      alert(
        `Ya tienes una solicitud registrada para adoptar a ${solicitudPendiente.mascota.nombre}.`
      );
      return;
    }

    alert(
      `Cuenta creada. La solicitud para adoptar a ${solicitudPendiente.mascota.nombre} fue enviada correctamente.`
    );
    formulario.reset();
    window.location.href = "../33333PerfilUsuario/perfil.html";
  } catch (error) {
    console.error(error);
    popupError.textContent =
      "No se pudo crear la cuenta. Verifica el backend y vuelve a intentar.";
  }
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
            <a href="../login/login.html" class="btn-submit flex-fill text-center">
                Iniciar sesión
            </a>
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                Cerrar
            </button>
        </div>
    `;

  modalCuenta.show();
}

modalCuentaEl.addEventListener("hidden.bs.modal", () => {
  if (solicitudPendiente && !cuentaCreada) {
    alert(
      `Tu solicitud para adoptar a ${solicitudPendiente.mascota.nombre} fue cancelada porque no creaste una cuenta.`
    );
  }

  solicitudPendiente = null;
  cuentaCreada = false;
});
