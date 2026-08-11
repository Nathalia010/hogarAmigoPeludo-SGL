import { obtenerMascotaPorId } from "../31.2Dashboard/scripts/mascotas.js";
import { agregarSolicitud } from "../31.2Dashboard/scripts/solicitudes.js";

const params = new URLSearchParams(window.location.search);
const mascotaId = Number(params.get("id") || params.get("mascotaId"));

const formulario = document.getElementById("formContacto");
const modalCuentaEl = document.getElementById("modalCuenta");
const modalCuentaBody = document.getElementById("modalCuentaBody");

let mascota = null;

function setText(id, value, fallback = "Sin registrar") {
  const element = document.getElementById(id);
  if (element) element.textContent = value || fallback;
}

function mostrarMascota() {
  const imagen = document.getElementById("imagenMascota");
  imagen.src = mascota.imagen;
  imagen.alt = mascota.nombre;

  setText("nombreMascota", mascota.nombre);
  setText("estadoMascota", mascota.estado);
  setText("edadSexoMascota", `${mascota.edad || "Edad sin registrar"} • ${mascota.sexo || "Sexo sin registrar"}`);
  setText("tamanoMascota", mascota.tamano);
  setText("ciudadMascota", mascota.ciudad);
  setText("especieMascota", mascota.especie);
  setText("sexoMascota", mascota.sexo);
  setText("descripcionMascota", mascota.descripcion);
}

function mostrarErrorMascota(mensaje) {
  const imagen = document.getElementById("imagenMascota");
  imagen.removeAttribute("src");
  imagen.alt = "No se pudo cargar la mascota";

  setText("nombreMascota", mensaje);
  setText("estadoMascota", "");
  setText("edadSexoMascota", "");
  setText("tamanoMascota", "");
  setText("ciudadMascota", "");
  setText("especieMascota", "");
  setText("sexoMascota", "");
  setText("descripcionMascota", "");
}

async function cargarMascota() {
  if (!Number.isInteger(mascotaId) || mascotaId <= 0) {
    throw new Error("El enlace de adopción no contiene un ID de mascota válido.");
  }

  mascota = await obtenerMascotaPorId(mascotaId);
  if (!mascota) {
    throw new Error(`No se encontró la mascota con ID ${mascotaId}.`);
  }

  mostrarMascota();
}

function obtenerDatosSolicitud() {
  return {
    mascota: {
      id: mascota.id,
      nombre: mascota.nombre,
      imagen: mascota.imagen,
      especie: mascota.especie,
      sexo: mascota.sexo,
      edad: mascota.edad,
      tamano: mascota.tamano,
      ciudad: mascota.ciudad,
      estado: mascota.estado,
      descripcion: mascota.descripcion,
    },
    propietario: {
      nombre: document.getElementById("nombre").value.trim(),
      apellido: document.getElementById("apellidos").value.trim(),
      documento: document.getElementById("documento").value.trim(),
      edad: document.getElementById("edad").value,
      correo: document.getElementById("email").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      pais: document.getElementById("pais").value,
      ciudad: document.getElementById("estado").value,
      direccion: "",
      tipoVivienda: document.getElementById("tipo_vivienda").value,
      regimenVivienda: document.getElementById("regimen_vivienda").value,
      horasSola: document.getElementById("horas_sola").value,
      otrasMascotas: document.getElementById("otras_mascotas").value,
      motivo: document.getElementById("motivo").value.trim(),
    },
  };
}

function mostrarSolicitudEnviada() {
  const mensaje = `La solicitud para adoptar a ${mascota.nombre} fue enviada correctamente.`;

  if (!modalCuentaEl || !modalCuentaBody || !window.bootstrap?.Modal) {
    alert(mensaje);
    return;
  }

  modalCuentaBody.innerHTML = `
    <div class="text-center">
      <div class="popup-icon"><i class="bi bi-check-circle-fill"></i></div>
      <h4>¡Solicitud enviada!</h4>
      <p class="text-muted">${mensaje}</p>
      <button type="button" class="btn-submit w-100" id="btnVolverCatalogo">
        Volver al catálogo
      </button>
    </div>`;

  const modal = window.bootstrap.Modal.getOrCreateInstance(modalCuentaEl);
  modal.show();
  document.getElementById("btnVolverCatalogo").addEventListener("click", () => {
    window.location.href = "../32.4Catalogo/catalogo.html";
  });
}

formulario?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!mascota) {
    alert("La mascota aún no está cargada. Intenta nuevamente.");
    return;
  }

  const submitButton = formulario.querySelector('[type="submit"]');
  if (submitButton) submitButton.disabled = true;

  try {
    const guardada = await agregarSolicitud(obtenerDatosSolicitud());
    if (!guardada) {
      alert(`Ya existe una solicitud con este correo para adoptar a ${mascota.nombre}.`);
      return;
    }

    formulario.reset();
    mostrarSolicitudEnviada();
  } catch (error) {
    console.error("No se pudo guardar la solicitud:", error);
    alert("No se pudo enviar la solicitud. Verifica la conexión con el backend.");
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

cargarMascota().catch((error) => {
  console.error("No se pudo cargar la mascota:", error);
  mostrarErrorMascota(error.message);
});
