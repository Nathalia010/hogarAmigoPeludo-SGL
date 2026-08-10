const MASCOTAS_KEY = "mascotas";

const mascotasIniciales = [
  { id: 1, nombre: "Max", especie: "Perro", edad: "2 años", sexo: "Macho", tamano: "Mediano", ciudad: "Medellín", descripcion: "Muy juguetón y cariñoso.", estado: "Disponible", imagen: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80" },
  { id: 2, nombre: "Luna", especie: "Gato", edad: "1 año", sexo: "Hembra", tamano: "Pequeño", ciudad: "Medellín", descripcion: "Le encanta dormir y recibir cariño.", estado: "Disponible", imagen: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80" },
  { id: 3, nombre: "Rocky", especie: "Perro", edad: "3 años", sexo: "Macho", tamano: "Grande", ciudad: "Medellín", descripcion: "Protector y muy obediente.", estado: "Disponible", imagen: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80" },
];

export function inicializarMascotas() {
  if (localStorage.getItem(MASCOTAS_KEY) === null) guardarMascotas(mascotasIniciales);
}

export function obtenerMascotas() {
  inicializarMascotas();
  try {
    const mascotas = JSON.parse(localStorage.getItem(MASCOTAS_KEY));
    return Array.isArray(mascotas) ? mascotas : [];
  } catch (error) {
    console.error("Error al leer las mascotas:", error);
    return [];
  }
}

export function guardarMascotas(mascotas) {
  if (!Array.isArray(mascotas)) throw new Error("Las mascotas deben guardarse como un arreglo.");
  localStorage.setItem(MASCOTAS_KEY, JSON.stringify(mascotas));
}

export function obtenerMascotaPorId(id) {
  return obtenerMascotas().find((mascota) => Number(mascota.id) === Number(id));
}

export function agregarMascota(datosMascota) {
  const mascotas = obtenerMascotas();
  const nuevaMascota = {
    id: Date.now(),
    nombre: datosMascota.nombre,
    especie: datosMascota.especie,
    edad: datosMascota.edad,
    sexo: datosMascota.sexo,
    tamano: datosMascota.tamano,
    ciudad: datosMascota.ciudad,
    imagen: datosMascota.imagen,
    descripcion: datosMascota.descripcion,
    estado: datosMascota.estado || "Disponible",
  };
  mascotas.push(nuevaMascota);
  guardarMascotas(mascotas);
  return nuevaMascota;
}

export function actualizarMascota(id, datosActualizados) {
  const mascotas = obtenerMascotas();
  const indice = mascotas.findIndex((mascota) => Number(mascota.id) === Number(id));
  if (indice === -1) return false;
  mascotas[indice] = { ...mascotas[indice], ...datosActualizados, id: mascotas[indice].id };
  guardarMascotas(mascotas);
  return true;
}

export function eliminarMascota(id) {
  guardarMascotas(obtenerMascotas().filter((mascota) => Number(mascota.id) !== Number(id)));
}
