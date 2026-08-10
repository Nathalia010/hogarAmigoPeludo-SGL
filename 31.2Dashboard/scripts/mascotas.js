import { apiRequest } from "../../js/api/client.js";
import { mascotaFromApi, mascotaToApi } from "../../js/api/adapters.js";

/**
 * Lista todas las mascotas desde el backend.
 * @returns {Promise<object[]>}
 */
export async function obtenerMascotas() {
  try {
    const data = await apiRequest("/api/mascotas");
    return Array.isArray(data) ? data.map(mascotaFromApi) : [];
  } catch (error) {
    console.error("Error al leer las mascotas:", error);
    throw error;
  }
}

/**
 * @param {number|string} id
 * @returns {Promise<object|undefined>}
 */
export async function obtenerMascotaPorId(id) {
  try {
    const data = await apiRequest(`/api/mascotas/${Number(id)}`);
    return mascotaFromApi(data);
  } catch (error) {
    if (error.status === 404) {
      return undefined;
    }
    console.error("Error al obtener la mascota:", error);
    throw error;
  }
}

/**
 * @param {object} datosMascota
 * @returns {Promise<object>}
 */
export async function agregarMascota(datosMascota) {
  const body = mascotaToApi({
    ...datosMascota,
    estado: datosMascota.estado || "Disponible",
  });
  delete body.id;
  const creada = await apiRequest("/api/mascotas", {
    method: "POST",
    body,
  });
  return mascotaFromApi(creada);
}

/**
 * @param {number|string} id
 * @param {object} datosActualizados
 * @returns {Promise<boolean>}
 */
export async function actualizarMascota(id, datosActualizados) {
  const actual = await obtenerMascotaPorId(id);
  if (!actual) {
    return false;
  }

  const body = mascotaToApi({
    ...actual,
    ...datosActualizados,
    id: Number(id),
  });

  await apiRequest(`/api/mascotas/${Number(id)}`, {
    method: "PUT",
    body,
  });
  return true;
}

/**
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export async function eliminarMascota(id) {
  await apiRequest(`/api/mascotas/${Number(id)}`, {
    method: "DELETE",
  });
}

/** @deprecated Ya no usa localStorage; se mantiene por compatibilidad. */
export function inicializarMascotas() {
  // no-op: los datos viven en el backend
}

/** @deprecated */
export function guardarMascotas() {
  throw new Error(
    "guardarMascotas ya no está disponible: usa agregarMascota/actualizarMascota contra el API."
  );
}
