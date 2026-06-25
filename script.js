const mascotas = [
  {
    id: 1,
    nombre: "Max",
    especie: "Perro",
    edad: "2 años",
    sexo: "Macho",
    tamano: "Mediano",
    descripcion: "Muy juguetón y cariñoso.",
    estado: "Disponible",
    imagen: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    nombre: "Luna",
    especie: "Gato",
    edad: "1 año",
    sexo: "Hembra",
    tamano: "Pequeño",
    descripcion: "Le encanta dormir y recibir cariño.",
    estado: "Disponible",
    imagen: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    nombre: "Rocky",
    especie: "Perro",
    edad: "3 años",
    sexo: "Macho",
    tamano: "Grande",
    descripcion: "Protector y muy obediente.",
    estado: "Disponible",
    imagen: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
  },
];

function renderMascotas(lista) {
  const contenedor = document.getElementById("contenedorMascotas");

  contenedor.innerHTML = "";

  lista.forEach((mascota) => {
    contenedor.innerHTML += `
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
  });
}

function obtenerMascota(id) {
  return mascotas.find((m) => m.id === id);
}

function verMascota(id) {
  const mascota = obtenerMascota(id);
  alert(`Has seleccionado a ${mascota.nombre}.`);
}

window.verMascota = verMascota;

document.addEventListener("DOMContentLoaded", () => {
  renderMascotas(mascotas);
});
