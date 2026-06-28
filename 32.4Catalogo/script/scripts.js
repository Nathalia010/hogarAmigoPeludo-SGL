import { obtenerMascotas } from "../../31.2Dashboard/scripts/mascotas.js";

const contenedorCatalogo = document.getElementById("contenedorCatalogo");

function renderCatalogo() {
  const mascotas = obtenerMascotas();

  contenedorCatalogo.innerHTML = "";

  mascotas.forEach((mascota) => {
    contenedorCatalogo.innerHTML += `
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

            <button class="btn-pet" onclick="irAdopcion(${mascota.id})">
              Adoptar
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

function irAdopcion(id) {
  window.location.href = `../333formularioAdoptar/adoptar-form.html?id=${id}`;
}

window.irAdopcion = irAdopcion;

document.addEventListener("DOMContentLoaded", renderCatalogo);