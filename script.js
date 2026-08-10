import { obtenerMascotas } from "./31.2Dashboard/scripts/mascotas.js";

function renderMascotas(lista) {
  const contenedor = document.getElementById("contenedorMascotas");

  contenedor.innerHTML = "";

  lista.forEach((mascota) => {
    contenedor.innerHTML += crearCardMascota(mascota);
  });
}

function crearCardMascota(mascota) {
  return `
    <div class="col-md-6 col-lg-4">
      <div class="pet-card">
        <img src="${mascota.imagen}" alt="${mascota.nombre}">

        <div class="pet-content">
          <span class="pet-status">${mascota.estado}</span>

          <h3>${mascota.nombre}</h3>

          <p>${mascota.descripcion}</p>

          <ul>
            <li><strong>Especie:</strong> ${mascota.especie}</li>
            <li><strong>Edad:</strong> ${mascota.edad}</li>
            <li><strong>Sexo:</strong> ${mascota.sexo}</li>
            <li><strong>Tamaño:</strong> ${mascota.tamano}</li>
          </ul>

          <button class="btn-pet" onclick="verMascota(${mascota.id})">

            Quiero adoptarlo
          </button>
        </div>
      </div>
    </div>
  `;
}

function verMascota(id) {
  window.location.href = `333formularioAdoptar/adoptar-form.html?id=${id}`;
}

window.verMascota = verMascota;

document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("contenedorMascotas");
  try {
    const mascotas = await obtenerMascotas();
    const primerasTres = mascotas.slice(0, 3);
    renderMascotas(primerasTres);
  } catch (error) {
    console.error(error);
    if (contenedor) {
      contenedor.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning text-center">
            No se pudieron cargar las mascotas. Verifica que el backend esté en
            <code>http://localhost:8080</code>.
          </div>
        </div>
      `;
    }
  }
});
