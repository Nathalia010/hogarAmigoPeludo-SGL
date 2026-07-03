import { obtenerMascotaPorId } from "../../31.2Dashboard/scripts/mascotas.js";

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

    alert(`Solicitud enviada para adoptar a ${mascota.nombre}`);

    formulario.reset();
});