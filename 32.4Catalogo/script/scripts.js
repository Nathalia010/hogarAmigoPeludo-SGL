import { obtenerMascotas } from "../../31.2Dashboard/scripts/mascotas.js";

const contenedorCatalogo = document.getElementById("contenedorCatalogo");

async function renderCatalogo() {
  if (!contenedorCatalogo) {
    console.error('No se encontró el elemento con id="contenedorCatalogo".');
    return;
  }

  try {
    const mascotas = await obtenerMascotas();

    if (!Array.isArray(mascotas)) {
      throw new Error("obtenerMascotas() no retornó un arreglo.");
    }

    const mascotasVisibles = mascotas.filter((mascota) =>
      ["Disponible", "Adoptado", "Adoptada"].includes(mascota.estado)
    );

    if (mascotasVisibles.length === 0) {
      contenedorCatalogo.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info text-center">
            No hay mascotas registradas por ahora.
          </div>
        </div>`;
      return;
    }

    contenedorCatalogo.innerHTML = mascotasVisibles
      .map((mascota) => {
        const estadoNorm = String(mascota.estado || "")
          .trim()
          .toLowerCase();
        const adoptado =
          estadoNorm === "adoptado" || estadoNorm === "adoptada";
        const estadoTexto = adoptado ? "Adoptado" : mascota.estado || "Disponible";
        const boton = adoptado
          ? `<button type="button" class="btn-pet is-adoptado" disabled>Adoptado</button>`
          : `<button type="button" class="btn-pet" data-id-mascota="${mascota.id}">Quiero adoptarlo</button>`;

        return `
      <div class="col-md-6 col-lg-4">
        <div class="pet-card">
          <img src="${mascota.imagen}" alt="${mascota.nombre}" loading="lazy">
          <div class="pet-content">
            <span class="pet-status${adoptado ? " is-adoptado" : ""}"${
              adoptado
                ? ' style="background:rgba(34,160,83,0.16);color:#1b7a3c;"'
                : ""
            }>${estadoTexto}</span>
            <h3>${mascota.nombre}</h3>
            <p>${mascota.descripcion}</p>
            <ul>
              <li><strong>Especie:</strong> ${mascota.especie}</li>
              <li><strong>Edad:</strong> ${mascota.edad}</li>
              <li><strong>Sexo:</strong> ${mascota.sexo}</li>
              <li><strong>Tamaño:</strong> ${mascota.tamano}</li>
              <li><strong>Ciudad:</strong> ${mascota.ciudad || "Sin registrar"}</li>
            </ul>
            ${boton}
          </div>
        </div>
      </div>`;
      })
      .join("");
  } catch (error) {
    console.error("Error al cargar el catálogo:", error);
    contenedorCatalogo.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger text-center">
          No fue posible cargar las mascotas. Verifica que el backend esté en
          <code>http://localhost:8080</code>.
        </div>
      </div>`;
  }
}

function irAdopcion(idMascota) {
  window.location.href = `../333formularioAdoptar/adoptar-form.html?id=${encodeURIComponent(idMascota)}`;
}

contenedorCatalogo?.addEventListener("click", (event) => {
  const botonAdoptar = event.target.closest("[data-id-mascota]");
  if (botonAdoptar) {
    irAdopcion(botonAdoptar.dataset.idMascota);
  }
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    renderCatalogo();
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderCatalogo);
} else {
  renderCatalogo();
}
