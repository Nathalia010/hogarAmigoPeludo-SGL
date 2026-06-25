const publicaciones = [];

const formPublicacion = document.getElementById("formPublicacion");
const tablaPublicaciones = document.getElementById("tablaPublicaciones");

formPublicacion.addEventListener("submit", function (event) {
  event.preventDefault();

  const publicacion = {
    id: Date.now(),
    nombre: document.getElementById("nombre").value.trim(),
    especie: document.getElementById("especie").value,
    edad: document.getElementById("edad").value.trim(),
    sexo: document.getElementById("sexo").value,
    tamano: document.getElementById("tamano").value,
    imagen: document.getElementById("imagen").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    estado: "Disponible",
  };

  publicaciones.push(publicacion);

  renderPublicaciones();

  console.log("LISTA DE PUBLICACIONES EN JSON:");
  console.log(JSON.stringify(publicaciones, null, 2));

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
      </tr>
    `;
  });
}