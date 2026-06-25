let publicaciones = [];
let idEditando = null;

const formPublicacion = document.getElementById("formPublicacion");
const tablaPublicaciones = document.getElementById("tablaPublicaciones");
const btnGuardar = document.getElementById("btnGuardar");

formPublicacion.addEventListener("submit", function (event) {
  event.preventDefault();

  const publicacion = {
    id: idEditando || Date.now(),
    nombre: document.getElementById("nombre").value.trim(),
    especie: document.getElementById("especie").value,
    edad: document.getElementById("edad").value.trim(),
    sexo: document.getElementById("sexo").value,
    tamano: document.getElementById("tamano").value,
    imagen: document.getElementById("imagen").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    estado: "Disponible",
  };

  if (idEditando) {
    publicaciones = publicaciones.map((item) =>
      item.id === idEditando ? publicacion : item,
    );

    idEditando = null;
    btnGuardar.textContent = "Guardar publicación";
  } else {
    publicaciones.push(publicacion);
  }

  renderPublicaciones();
  mostrarJsonConsola();
  formPublicacion.reset();
});

function renderPublicaciones() {
  tablaPublicaciones.innerHTML = "";

  publicaciones.forEach((publicacion) => {
    tablaPublicaciones.innerHTML += `
      <tr>
        <td>
          <img src="${publicacion.imagen}" alt="${publicacion.nombre}">
        </td>
        <td>${publicacion.nombre}</td>
        <td>${publicacion.especie}</td>
        <td>${publicacion.edad}</td>
        <td>
          <span class="pet-status">${publicacion.estado}</span>
        </td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarPublicacion(${publicacion.id})">
            Editar
          </button>

          <button class="btn btn-danger btn-sm" onclick="eliminarPublicacion(${publicacion.id})">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });
}

function editarPublicacion(id) {
  const publicacion = publicaciones.find((item) => item.id === id);

  document.getElementById("nombre").value = publicacion.nombre;
  document.getElementById("especie").value = publicacion.especie;
  document.getElementById("edad").value = publicacion.edad;
  document.getElementById("sexo").value = publicacion.sexo;
  document.getElementById("tamano").value = publicacion.tamano;
  document.getElementById("imagen").value = publicacion.imagen;
  document.getElementById("descripcion").value = publicacion.descripcion;

  idEditando = id;
  btnGuardar.textContent = "Actualizar publicación";
}

function eliminarPublicacion(id) {
  publicaciones = publicaciones.filter((item) => item.id !== id);

  renderPublicaciones();
  mostrarJsonConsola();
}

function mostrarJsonConsola() {
  console.clear();
  console.log("LISTA DE PUBLICACIONES EN JSON:");
  console.log(JSON.stringify(publicaciones, null, 2));
}

window.editarPublicacion = editarPublicacion;
window.eliminarPublicacion = eliminarPublicacion;
