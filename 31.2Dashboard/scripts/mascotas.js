const MASCOTAS_KEY = "mascotas";

const mascotasIniciales = [
  {
    id: 1,
    nombre: "Max",
    especie: "Perro",
    edad: "2 años",
    sexo: "Macho",
    tamano: "Mediano",
    descripcion: "Muy juguetón y cariñoso.",
    estado: "Disponible",
    imagen:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
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
    imagen:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
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
    imagen:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
  },
];

export function inicializarMascotas() {
  const mascotas = localStorage.getItem(MASCOTAS_KEY);

  if (!mascotas) {
    localStorage.setItem(MASCOTAS_KEY, JSON.stringify(mascotasIniciales));
  }
}

export function obtenerMascotas() {
  inicializarMascotas();
  return JSON.parse(localStorage.getItem(MASCOTAS_KEY)) || [];
}

export function guardarMascotas(mascotas) {
  localStorage.setItem(MASCOTAS_KEY, JSON.stringify(mascotas));
}

export function obtenerMascotaPorId(id) {
  const mascotas = obtenerMascotas();
  return mascotas.find((mascota) => mascota.id === Number(id));
}