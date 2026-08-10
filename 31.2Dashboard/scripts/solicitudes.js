import { apiRequest } from "../../js/api/client.js";
import {
  entregaToApi,
  mascotaFromApi,
  solicitudFromApi,
  solicitudToApi,
  estadoSolicitudToApi,
} from "../../js/api/adapters.js";

async function cargarMascotasMap() {
  const mascotas = await apiRequest("/api/mascotas");
  const map = new Map();
  (Array.isArray(mascotas) ? mascotas : []).forEach((dto) => {
    map.set(Number(dto.id), mascotaFromApi(dto));
  });
  return map;
}

async function cargarEntregasPorSolicitud() {
  const entregas = await apiRequest("/api/entregas");
  const map = new Map();
  (Array.isArray(entregas) ? entregas : []).forEach((entrega) => {
    const key = Number(entrega.solicitudId);
    const actual = map.get(key);
    if (!actual || Number(entrega.id) > Number(actual.id)) {
      map.set(key, entrega);
    }
  });
  return map;
}

async function hidratarSolicitudes(listaDto) {
  const [mascotasMap, entregasMap] = await Promise.all([
    cargarMascotasMap(),
    cargarEntregasPorSolicitud(),
  ]);

  return listaDto.map((dto) =>
    solicitudFromApi(
      dto,
      mascotasMap.get(Number(dto.mascotaId)),
      entregasMap.get(Number(dto.id))
    )
  );
}

/**
 * Obtiene todas las solicitudes hidratadas (mascota + envío).
 * @returns {Promise<object[]>}
 */
export async function obtenerSolicitudes() {
  try {
    const data = await apiRequest("/api/solicitudes");
    const lista = Array.isArray(data) ? data : [];
    return hidratarSolicitudes(lista);
  } catch (error) {
    console.error("Error al leer solicitudes:", error);
    throw error;
  }
}

/**
 * @param {number|string} idSolicitud
 * @returns {Promise<object|undefined>}
 */
export async function obtenerSolicitudPorId(idSolicitud) {
  try {
    const dto = await apiRequest(`/api/solicitudes/${Number(idSolicitud)}`);
    const mascota = await apiRequest(`/api/mascotas/${dto.mascotaId}`)
      .then(mascotaFromApi)
      .catch(() => null);
    const entregas = await apiRequest(
      `/api/entregas?solicitudId=${Number(idSolicitud)}`
    );
    const entrega = Array.isArray(entregas) && entregas.length
      ? entregas[entregas.length - 1]
      : null;
    return solicitudFromApi(dto, mascota, entrega);
  } catch (error) {
    if (error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

/**
 * Crea una solicitud en el backend.
 * @returns {Promise<boolean>} false si ya existe una para la misma mascota
 */
export async function agregarSolicitud(solicitud) {
  const mascotaId = Number(solicitud.mascota?.id ?? solicitud.mascotaId);
  const existentes = await apiRequest("/api/solicitudes");
  const duplicada = (Array.isArray(existentes) ? existentes : []).some(
    (item) => Number(item.mascotaId) === mascotaId
  );

  if (duplicada) {
    return false;
  }

  const body = solicitudToApi(solicitud);
  delete body.id;
  delete body.estado;

  const creada = await apiRequest("/api/solicitudes", {
    method: "POST",
    body,
  });

  const envioInicial = solicitud.envio || {
    modalidad: "Recoger en fundación",
    direccion: "",
    fechaEntrega: "",
    estadoEntrega: "No enviado",
    estadoProceso:
      "Nos estaremos contactando para coordinar la fecha.",
  };

  try {
    await apiRequest("/api/entregas", {
      method: "POST",
      body: entregaToApi(creada.id, envioInicial),
    });
  } catch (error) {
    console.warn("Solicitud creada, pero falló la entrega inicial:", error);
  }

  return true;
}

/**
 * Actualiza una solicitud completa (shape frontend).
 */
export async function actualizarSolicitud(solicitudActualizada) {
  const id = Number(solicitudActualizada.idSolicitud);
  const body = solicitudToApi(solicitudActualizada);
  await apiRequest(`/api/solicitudes/${id}`, {
    method: "PUT",
    body,
  });
}

/**
 * Cambia únicamente el estado de la solicitud.
 */
export async function cambiarEstadoSolicitud(idSolicitud, nuevoEstado) {
  const actual = await apiRequest(`/api/solicitudes/${Number(idSolicitud)}`);
  await apiRequest(`/api/solicitudes/${Number(idSolicitud)}`, {
    method: "PUT",
    body: {
      ...actual,
      estado: estadoSolicitudToApi(nuevoEstado),
    },
  });
}

/**
 * Crea o actualiza la entrega asociada a una solicitud.
 */
export async function actualizarEnvio(idSolicitud, envioActualizado) {
  const entregas = await apiRequest(
    `/api/entregas?solicitudId=${Number(idSolicitud)}`
  );
  const existente =
    Array.isArray(entregas) && entregas.length
      ? entregas[entregas.length - 1]
      : null;

  const body = entregaToApi(
    idSolicitud,
    {
      modalidad: "Recoger en fundación",
      direccion: "",
      fechaEntrega: "",
      estadoEntrega: "No enviado",
      estadoProceso:
        "Nos estaremos contactando para coordinar la fecha.",
      ...envioActualizado,
    },
    existente?.id ?? null
  );

  if (existente) {
    await apiRequest(`/api/entregas/${existente.id}`, {
      method: "PUT",
      body,
    });
  } else {
    delete body.id;
    await apiRequest("/api/entregas", {
      method: "POST",
      body,
    });
  }

  return true;
}

/**
 * Elimina una solicitud.
 */
export async function eliminarSolicitud(idSolicitud) {
  const entregas = await apiRequest(
    `/api/entregas?solicitudId=${Number(idSolicitud)}`
  ).catch(() => []);

  for (const entrega of Array.isArray(entregas) ? entregas : []) {
    await apiRequest(`/api/entregas/${entrega.id}`, {
      method: "DELETE",
    }).catch(() => {});
  }

  await apiRequest(`/api/solicitudes/${Number(idSolicitud)}`, {
    method: "DELETE",
  });
}

/** @deprecated */
export function guardarSolicitudes() {
  throw new Error(
    "guardarSolicitudes ya no está disponible: usa el API de solicitudes."
  );
}
