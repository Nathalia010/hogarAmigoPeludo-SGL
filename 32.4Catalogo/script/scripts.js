import {
  obtenerMascotas,
} from "../../31.2Dashboard/scripts/mascotas.js";

const contenedorCatalogo = document.getElementById(
  "contenedorCatalogo"
);

async function renderCatalogo() {
  if (!contenedorCatalogo) {
    console.error(
      'No se encontró el elemento con id="contenedorCatalogo".'
    );
    return;
  }

  try {
    const mascotas = await obtenerMascotas();

    if (!Array.isArray(mascotas)) {
      throw new Error(
        "obtenerMascotas() no retornó un arreglo."
      );
    }

    const mascotasDisponibles = mascotas.filter(
      (mascota) => mascota.estado === "Disponible"
    );

    if (mascotasDisponibles.length === 0) {
      contenedorCatalogo.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info text-center">
            No hay mascotas disponibles para adopción.
          </div>
        </div>
      `;
      return;
    }

    contenedorCatalogo.innerHTML = mascotasDisponibles
      .map(
        (mascota) => `
          <div class="col-md-6 col-lg-4">
            <div class="pet-card">
              <img
                src="${mascota.imagen}"
                alt="${mascota.nombre}"
                loading="lazy"
              >

              <div class="pet-content">
                <span class="pet-status">
                  ${mascota.estado}
                </span>

                <h3>${mascota.nombre}</h3>

                <p>${mascota.descripcion}</p>

                <ul>
                  <li>
                    <strong>Especie:</strong>
                    ${mascota.especie}
                  </li>

                  <li>
                    <strong>Edad:</strong>
                    ${mascota.edad}
                  </li>

                  <li>
                    <strong>Sexo:</strong>
                    ${mascota.sexo}
                  </li>

                  <li>
                    <strong>Tamaño:</strong>
                    ${mascota.tamano}
                  </li>
                </ul>

                <button
                  type="button"
                  class="btn-pet"
                  data-id-mascota="${mascota.id}"
                >
                  Adoptar
                </button>
              </div>
            </div>
          </div>
        `
      )
      .join("");
  } catch (error) {
    console.error(
      "Error al cargar el catálogo:",
      error
    );

    contenedorCatalogo.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger text-center">
          No fue posible cargar las mascotas.
          Verifica que el backend esté en
          <code>http://localhost:8080</code>.
        </div>
      </div>
    `;
  }
}

function irAdopcion(idMascota) {
  const idSeguro = encodeURIComponent(idMascota);

  window.location.href =
    `../333formularioAdoptar/adoptar-form.html?id=${idSeguro}`;
}

contenedorCatalogo?.addEventListener(
  "click",
  function (event) {
    const botonAdoptar = event.target.closest(
      "[data-id-mascota]"
    );

    if (!botonAdoptar) {
      return;
    }

    const idMascota =
      botonAdoptar.dataset.idMascota;

    irAdopcion(idMascota);
  }
);

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    renderCatalogo();
  }
});

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    renderCatalogo
  );
} else {
  renderCatalogo();
}
