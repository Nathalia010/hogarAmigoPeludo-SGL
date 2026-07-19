const SOLICITUDES_KEY = "solicitudes";

/**
 * Obtiene todas las solicitudes
 */
export function obtenerSolicitudes() {
  try {
    const solicitudes = JSON.parse(localStorage.getItem(SOLICITUDES_KEY));
    return Array.isArray(solicitudes) ? solicitudes : [];
  } catch (error) {
    console.error("Error al leer las solicitudes:", error);
    return [];
  }
}

/**
 * Guarda todas las solicitudes
 */
export function guardarSolicitudes(solicitudes) {
  if (!Array.isArray(solicitudes)) {
    throw new Error("Las solicitudes deben guardarse como un arreglo.");
  }

  localStorage.setItem(SOLICITUDES_KEY, JSON.stringify(solicitudes));
}

/**
 * Agrega una nueva solicitud
 */
export function agregarSolicitud(solicitud) {
  const solicitudes = obtenerSolicitudes();
  const existe = solicitudes.find(
    (item) => Number(item.mascota?.id) === Number(solicitud.mascota?.id),
  );

  if (existe) return false;

  solicitud.idSolicitud = Date.now();
  solicitud.fechaSolicitud = new Date().toLocaleDateString("es-CO");
  solicitud.estadoSolicitud = "Solicitud llenada";
  solicitud.envio = {
    modalidad: "Recoger en fundación",
    direccion: "",
    origen: "",
    fechaEntrega: "",
    horaEstimada: "",
    tiempoRestante: 0,
    distanciaRestante: 0,
    transportistaNombre: "Hogar Amigo Peludo",
    transportistaTelefono: "1234567890",
    estadoEntrega: "No enviado",
    estadoProceso: "Nos estaremos contactando para coordinar la fecha.",
  };

  solicitudes.push(solicitud);
  guardarSolicitudes(solicitudes);
  return true;
}

/**
 * Busca una solicitud por id
 */
export function obtenerSolicitudPorId(idSolicitud) {
  return obtenerSolicitudes().find(
    (solicitud) => Number(solicitud.idSolicitud) === Number(idSolicitud),
  );
}

/**
 * Actualiza una solicitud
 */
export function actualizarSolicitud(solicitudActualizada) {
  const solicitudes = obtenerSolicitudes();
  const indice = solicitudes.findIndex(
    (solicitud) => Number(solicitud.idSolicitud) === Number(solicitudActualizada.idSolicitud),
  );

  if (indice === -1) return false;

  solicitudes[indice] = solicitudActualizada;
  guardarSolicitudes(solicitudes);
  return true;
}

/**
 * Cambia únicamente el estado de la solicitud
 */
export function cambiarEstadoSolicitud(idSolicitud, nuevoEstado) {
  const solicitudes = obtenerSolicitudes();
  const solicitud = solicitudes.find(
    (item) => Number(item.idSolicitud) === Number(idSolicitud),
  );

  if (!solicitud) return false;

  solicitud.estadoSolicitud = nuevoEstado;
  guardarSolicitudes(solicitudes);
  return true;
}

/**
 * Actualiza toda la información del envío
 */
export function actualizarEnvio(idSolicitud, envioActualizado) {
  const solicitudes = obtenerSolicitudes();
  const solicitud = solicitudes.find(
    (item) => Number(item.idSolicitud) === Number(idSolicitud),
  );

  if (!solicitud) return false;

  solicitud.envio = {
    ...solicitud.envio,
    ...envioActualizado,
  };

  guardarSolicitudes(solicitudes);
  return true;
}

/**
 * Elimina una solicitud
 */
export function eliminarSolicitud(idSolicitud) {
  const solicitudes = obtenerSolicitudes();
  const solicitudesActualizadas = solicitudes.filter(
    (solicitud) => Number(solicitud.idSolicitud) !== Number(idSolicitud),
  );

  if (solicitudesActualizadas.length === solicitudes.length) return false;

  guardarSolicitudes(solicitudesActualizadas);
  return true;
}
