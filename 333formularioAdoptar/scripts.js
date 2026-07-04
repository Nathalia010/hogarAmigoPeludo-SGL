import { obtenerMascotaPorId } from "../../31.2Dashboard/scripts/mascotas.js";
import { agregarSolicitud } from "../../31.2Dashboard/scripts/solicitudes.js";

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

    agregarSolicitud(nuevaSolicitud);

    alert(`La solicitud para adoptar a ${mascota.nombre} fue enviada correctamente.`);

    formulario.reset();

    // Redirigir a Mis Solicitudes
    window.location.href = "../Usuario/solicitudes/solicitudes.html";

});