import { obtenerMascotas } from "./31.2Dashboard/scripts/mascotas.js";

function renderMascotas(lista) {
  const contenedor = document.getElementById("contenedorMascotas");

  contenedor.innerHTML = "";

  lista.forEach((mascota) => {
    contenedor.innerHTML += crearCardMascota(mascota);
  });
}

function esAdoptado(estado) {
  const valor = String(estado || "").trim().toLowerCase();
  return valor === "adoptado" || valor === "adoptada";
}

function crearCardMascota(mascota) {
  const adoptado = esAdoptado(mascota.estado);
  const estadoTexto = adoptado ? "Adoptado" : mascota.estado || "Disponible";
  const estadoClase = adoptado ? "pet-status is-adoptado" : "pet-status";
  const boton = adoptado
    ? `<button type="button" class="btn-pet is-adoptado" disabled>Adoptado</button>`
    : `<button type="button" class="btn-pet" onclick="verMascota(${mascota.id})">Quiero adoptarlo</button>`;

  return `
    <div class="col-md-6 col-lg-4">
      <div class="pet-card">
        <img src="${mascota.imagen}" alt="${mascota.nombre}" referrerpolicy="no-referrer">

        <div class="pet-content">
          <span class="${estadoClase}"${
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
