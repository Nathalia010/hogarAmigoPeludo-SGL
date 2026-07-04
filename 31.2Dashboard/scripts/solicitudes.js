const SOLICITUDES_KEY = "solicitudes";

/**
 * Obtiene todas las solicitudes
 */
export function obtenerSolicitudes() {
    return JSON.parse(localStorage.getItem(SOLICITUDES_KEY)) || [];
}

/**
 * Guarda todas las solicitudes
 */
export function guardarSolicitudes(solicitudes) {
    localStorage.setItem(SOLICITUDES_KEY, JSON.stringify(solicitudes));
}

/**
 * Agrega una nueva solicitud
 */
export function agregarSolicitud(solicitud) {

    const solicitudes = obtenerSolicitudes();

    solicitud.idSolicitud = Date.now();

    solicitud.fechaSolicitud = new Date().toLocaleDateString();

    solicitud.estadoSolicitud = "Solicitud llenada";

    solicitud.envio = {
        modalidad: "Recoger en fundación",
        direccion: "",
        fechaEntrega: "",
        estadoEntrega: "No enviado",
        estadoProceso: "Nos estaremos contactando para coordinar la fecha."
    };

    solicitudes.push(solicitud);

    guardarSolicitudes(solicitudes);

}

/**
 * Busca una solicitud por id
 */
export function obtenerSolicitudPorId(idSolicitud) {

    return obtenerSolicitudes().find(
        solicitud => solicitud.idSolicitud == idSolicitud
    );

}

/**
 * Actualiza una solicitud
 */
export function actualizarSolicitud(solicitudActualizada) {

    const solicitudes = obtenerSolicitudes();

    const indice = solicitudes.findIndex(
        solicitud => solicitud.idSolicitud == solicitudActualizada.idSolicitud
    );

    if (indice !== -1) {

        solicitudes[indice] = solicitudActualizada;

        guardarSolicitudes(solicitudes);

    }

}

/**
 * Cambia únicamente el estado de la solicitud
 */
export function cambiarEstadoSolicitud(idSolicitud, nuevoEstado) {

    const solicitudes = obtenerSolicitudes();

    const solicitud = solicitudes.find(
        s => s.idSolicitud == idSolicitud
    );

    if (solicitud) {

        solicitud.estadoSolicitud = nuevoEstado;

        guardarSolicitudes(solicitudes);

    }

}

/**
 * Actualiza toda la información del envío
 */
export function actualizarEnvio(
    idSolicitud,
    modalidad,
    direccion,
    fechaEntrega,
    estadoEntrega,
    estadoProceso
) {

    const solicitudes = obtenerSolicitudes();

    const solicitud = solicitudes.find(
        s => s.idSolicitud == idSolicitud
    );

    if (solicitud) {

        solicitud.envio = {

            modalidad,

            direccion,

            fechaEntrega,

            estadoEntrega,

            estadoProceso

        };

        guardarSolicitudes(solicitudes);

    }

}

/**
 * Elimina una solicitud
 */
export function eliminarSolicitud(idSolicitud) {

    const solicitudes = obtenerSolicitudes().filter(
        solicitud => solicitud.idSolicitud != idSolicitud
    );

    guardarSolicitudes(solicitudes);

}