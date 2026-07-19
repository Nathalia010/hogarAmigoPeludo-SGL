import {
  obtenerMascotas,
  agregarMascota,
  actualizarMascota,
  eliminarMascota,
} from "./mascotas.js";

let publicaciones = [];
let idEditando = null;

const formPublicacion =
  document.getElementById("formPublicacion");

const tablaPublicaciones =
  document.getElementById("tablaPublicaciones");

const btnGuardar =
  document.getElementById("btnGuardar");

if (!formPublicacion) {
  throw new Error(
    'No se encontró el formulario con id="formPublicacion".'
  );
}

if (!tablaPublicaciones) {
  throw new Error(
    'No se encontró el elemento con id="tablaPublicaciones".'
  );
}

if (!btnGuardar) {
  throw new Error(
    'No se encontró el botón con id="btnGuardar".'
  );
}

function cargarPublicaciones() {
  publicaciones = obtenerMascotas();
  renderPublicaciones();
}

formPublicacion.addEventListener("submit", function (event) {
  event.preventDefault();

  const publicacionEditada = idEditando !== null
    ? publicaciones.find((item) => Number(item.id) === Number(idEditando))
    : null;

  const datosPublicacion = {
    nombre: document
      .getElementById("nombre")
      .value.trim(),

    especie: document
      .getElementById("especie")
      .value,

    edad: document
      .getElementById("edad")
      .value.trim(),

    sexo: document
      .getElementById("sexo")
      .value,

    tamano: document
      .getElementById("tamano")
      .value,

    imagen: document
      .getElementById("imagen")
      .value.trim(),

    descripcion: document
      .getElementById("descripcion")
      .value.trim(),

    // Las nuevas comienzan disponibles; al editar se conserva el estado actual.
    estado: publicacionEditada?.estado ?? "Disponible",
  };

  if (!validarPublicacion(datosPublicacion)) {
    return;
  }

  if (idEditando !== null) {
    actualizarMascota(
      idEditando,
      datosPublicacion
    );

    idEditando = null;
    btnGuardar.textContent = "Guardar publicación";
  } else {
    agregarMascota(datosPublicacion);
  }

  formPublicacion.reset();
  cargarPublicaciones();
  mostrarJsonConsola();
});

function validarPublicacion(publicacion) {
  if (!publicacion.nombre) {
    alert("Debes escribir el nombre de la mascota.");
    return false;
  }

  if (!publicacion.especie) {
    alert("Debes seleccionar una especie.");
    return false;
  }

  if (!publicacion.edad) {
    alert("Debes escribir la edad.");
    return false;
  }

  if (!publicacion.sexo) {
    alert("Debes seleccionar el sexo.");
    return false;
  }

  if (!publicacion.tamano) {
    alert("Debes seleccionar el tamaño.");
    return false;
  }

  if (!publicacion.imagen) {
    alert("Debes ingresar la URL de una imagen.");
    return false;
  }

  if (!publicacion.descripcion) {
    alert("Debes escribir una descripción.");
    return false;
  }

  return true;
}

function renderPublicaciones() {
  if (publicaciones.length === 0) {
    tablaPublicaciones.innerHTML = `
      <tr>
        <td colspan="6">
          No hay mascotas registradas.
        </td>
      </tr>
    `;

    return;
  }

  tablaPublicaciones.innerHTML = publicaciones
    .map(
      (publicacion) => `
        <tr>
          <td>
            <img
              src="${publicacion.imagen}"
              alt="${publicacion.nombre}"
              width="80"
              height="80"
            >
          </td>

          <td>${publicacion.nombre}</td>

          <td>${publicacion.especie}</td>

          <td>${publicacion.edad}</td>

          <td>
            <span class="pet-status">
              ${publicacion.estado}
            </span>
          </td>

          <td>
            <button
              type="button"
              class="btn btn-warning btn-sm"
              data-accion="editar"
              data-id="${publicacion.id}"
            >
              Editar
            </button>

            <button
              type="button"
              class="btn btn-danger btn-sm"
              data-accion="eliminar"
              data-id="${publicacion.id}"
            >
              Eliminar
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

tablaPublicaciones.addEventListener("click", function (event) {
  const boton = event.target.closest("button[data-accion]");

  if (!boton) {
    return;
  }

  const id = Number(boton.dataset.id);
  const accion = boton.dataset.accion;

  if (accion === "editar") {
    editarPublicacion(id);
  }

  if (accion === "eliminar") {
    eliminarPublicacion(id);
  }
});

function editarPublicacion(id) {
  const publicacion = publicaciones.find(
    (item) => Number(item.id) === Number(id)
  );

  if (!publicacion) {
    alert("No se encontró la mascota.");
    return;
  }

  document.getElementById("nombre").value =
    publicacion.nombre;

  document.getElementById("especie").value =
    publicacion.especie;

  document.getElementById("edad").value =
    publicacion.edad;

  document.getElementById("sexo").value =
    publicacion.sexo;

  document.getElementById("tamano").value =
    publicacion.tamano;

  document.getElementById("imagen").value =
    publicacion.imagen;

  document.getElementById("descripcion").value =
    publicacion.descripcion;

  idEditando = Number(id);
  btnGuardar.textContent = "Actualizar publicación";

  formPublicacion.scrollIntoView({
    behavior: "smooth",
  });
}

function eliminarPublicacion(id) {
  const publicacion = publicaciones.find(
    (item) => Number(item.id) === Number(id)
  );

  if (!publicacion) {
    return;
  }

  const confirmar = window.confirm(
    `¿Deseas eliminar a ${publicacion.nombre}?`
  );

  if (!confirmar) {
    return;
  }

  eliminarMascota(id);

  if (idEditando === Number(id)) {
    idEditando = null;
    formPublicacion.reset();
    btnGuardar.textContent = "Guardar publicación";
  }

  cargarPublicaciones();
  mostrarJsonConsola();
}

function mostrarJsonConsola() {
  console.log(
    "LISTA DE PUBLICACIONES EN JSON:"
  );

  console.log(
    JSON.stringify(obtenerMascotas(), null, 2)
  );
}

window.addEventListener("storage", (event) => {
  if (event.key === "mascotas") {
    cargarPublicaciones();
  }
});

window.addEventListener("pageshow", cargarPublicaciones);
window.addEventListener("focus", cargarPublicaciones);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    cargarPublicaciones();
  }
});

cargarPublicaciones();

