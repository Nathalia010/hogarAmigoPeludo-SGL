/** Extrae un número de edad desde "2", "2 años", etc. */
export function parseEdad(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  if (typeof valor === "number" && Number.isFinite(valor)) {
    return Math.trunc(valor);
  }
  const match = String(valor).match(/\d+/);
  return match ? Number(match[0]) : null;
}

export function formatearEdad(edad) {
  if (edad === null || edad === undefined || edad === "") {
    return "";
  }
  const texto = String(edad);
  if (/\baños?\b/i.test(texto)) {
    return texto;
  }
  return `${texto} años`;
}

/** Backend MascotaDTO → shape usado por el frontend. */
export function mascotaFromApi(dto) {
  if (!dto) {
    return null;
  }
  return {
    id: dto.id,
    nombre: dto.nombre,
    especie: dto.especie,
    raza: dto.raza ?? "",
    sexo: dto.genero,
    edad: formatearEdad(dto.edad),
    tamano: dto.tamano,
    peso: dto.peso,
    salud: dto.salud ?? "",
    descripcion: dto.descripcion ?? "",
    imagen: dto.foto ?? "",
    estado: dto.estado,
    fechaCreacion: dto.fechaCreacion,
  };
}

/** Shape frontend → body para POST/PUT /api/mascotas. */
export function mascotaToApi(mascota) {
  const especie =
    mascota.especie === "Otro" ? "Perro" : mascota.especie;

  return {
    id: mascota.id ?? null,
    nombre: mascota.nombre,
    especie,
    raza: mascota.raza || "Mestizo",
    genero: mascota.sexo || mascota.genero,
    edad: parseEdad(mascota.edad),
    tamano: mascota.tamano,
    peso: mascota.peso != null && mascota.peso !== "" ? Number(mascota.peso) : null,
    salud: mascota.salud || "Buena",
    descripcion: mascota.descripcion || "",
    foto: mascota.imagen || mascota.foto || "",
    estado: mascota.estado || "Disponible",
  };
}

/** Estados solicitud: UI legacy ↔ API. */
const ESTADO_SOLICITUD_A_API = {
  "Solicitud llenada": "En revisión",
  "En revisión": "En revisión",
  Aceptada: "Aceptada",
  Negada: "Negada",
  "Coordinando entrega": "Proceso de entrega",
  "Proceso de entrega": "Proceso de entrega",
  Adoptada: "Adoptada",
};

const ESTADO_SOLICITUD_A_UI = {
  "En revisión": "En revisión",
  Aceptada: "Aceptada",
  Negada: "Negada",
  "Proceso de entrega": "Coordinando entrega",
  Adoptada: "Adoptada",
};

export function estadoSolicitudToApi(estado) {
  return ESTADO_SOLICITUD_A_API[estado] || estado || "En revisión";
}

export function estadoSolicitudFromApi(estado) {
  return ESTADO_SOLICITUD_A_UI[estado] || estado;
}

const ESTADO_ENTREGA_A_API = {
  "No enviado": "Pendiente",
  Pendiente: "Pendiente",
  "De camino": "En camino",
  "En camino": "En camino",
  Recibido: "Entregado",
  Entregado: "Entregado",
  Cancelado: "Cancelado",
};

const ESTADO_ENTREGA_A_UI = {
  Pendiente: "No enviado",
  "En camino": "De camino",
  Entregado: "Recibido",
  Cancelado: "Cancelado",
};

export function estadoEntregaToApi(estado) {
  return ESTADO_ENTREGA_A_API[estado] || estado || "Pendiente";
}

export function estadoEntregaFromApi(estado) {
  return ESTADO_ENTREGA_A_UI[estado] || estado || "No enviado";
}

function parseObservaciones(observaciones) {
  const texto = observaciones || "";
  const modalidadMatch = texto.match(/Modalidad:\s*([^|]+)/i);
  const direccionMatch = texto.match(/Dirección:\s*([^|]+)/i);
  const procesoMatch = texto.match(/Proceso:\s*(.+)$/i);

  return {
    modalidad: (modalidadMatch?.[1] || "Recoger en fundación").trim(),
    direccion: (direccionMatch?.[1] || "").trim(),
    estadoProceso: (procesoMatch?.[1] ||
      "Nos estaremos contactando para coordinar la fecha.").trim(),
  };
}

export function buildObservacionesEntrega(envio) {
  const modalidad = envio.modalidad || "Recoger en fundación";
  const direccion = envio.direccion || "";
  const proceso =
    envio.estadoProceso ||
    "Nos estaremos contactando para coordinar la fecha.";
  return `Modalidad: ${modalidad} | Dirección: ${direccion} | Proceso: ${proceso}`;
}

function formatearFechaSolicitud(fechaRegistro) {
  if (!fechaRegistro) {
    return "";
  }
  const fecha = new Date(fechaRegistro);
  if (Number.isNaN(fecha.getTime())) {
    return String(fechaRegistro).slice(0, 10);
  }
  return fecha.toLocaleDateString();
}

/**
 * Une SolicitudDTO + Mascota (UI) + EntregaDTO → shape legacy del frontend.
 */
export function solicitudFromApi(dto, mascotaUi = null, entregaDto = null) {
  if (!dto) {
    return null;
  }

  const obs = parseObservaciones(entregaDto?.observaciones);
  const estadoEntregaUi = estadoEntregaFromApi(entregaDto?.estado);

  return {
    idSolicitud: dto.id,
    codigo: dto.codigo,
    fechaSolicitud: formatearFechaSolicitud(dto.fechaRegistro),
    estadoSolicitud: estadoSolicitudFromApi(dto.estado),
    mascota: mascotaUi || {
      id: dto.mascotaId,
      nombre: "Mascota",
      imagen: "",
      especie: "",
      sexo: "",
      edad: "",
      tamano: "",
      estado: "",
      descripcion: "",
    },
    propietario: {
      nombre: dto.nombre,
      apellido: dto.apellido,
      documento: dto.documento,
      edad: dto.edad,
      correo: dto.correo,
      telefono: dto.telefono,
      pais: "",
      ciudad: dto.ciudad,
      direccion: dto.direccion,
      tipoVivienda: dto.tipoVivienda,
      regimenVivienda: dto.vivienda,
      horasSola: dto.horasSolo,
      horasSolo: dto.horasSolo,
      otrasMascotas: dto.mascotasActuales,
      motivo: dto.comentario,
    },
    envio: {
      id: entregaDto?.id ?? null,
      modalidad: obs.modalidad,
      direccion: obs.direccion || dto.direccion || "",
      fechaEntrega: entregaDto?.fechaProgramada || entregaDto?.fechaEntrega || "",
      estadoEntrega: estadoEntregaUi,
      estadoProceso: obs.estadoProceso,
    },
    _api: dto,
  };
}

/** Shape frontend → body POST/PUT /api/solicitudes. */
export function solicitudToApi(solicitud) {
  const p = solicitud.propietario || {};
  const mascotaId =
    solicitud.mascota?.id ?? solicitud.mascotaId ?? solicitud._api?.mascotaId;

  return {
    id: solicitud.idSolicitud ?? solicitud.id ?? null,
    mascotaId: Number(mascotaId),
    nombre: p.nombre,
    apellido: p.apellido,
    documento: p.documento,
    edad: parseEdad(p.edad),
    correo: p.correo,
    telefono: p.telefono,
    ciudad: p.ciudad,
    direccion: p.direccion || "",
    vivienda: p.regimenVivienda || p.vivienda || "",
    tipoVivienda: p.tipoVivienda || "",
    horasSolo: parseEdad(p.horasSola ?? p.horasSolo),
    mascotasActuales: p.otrasMascotas || p.mascotasActuales || "",
    comentario: p.motivo || p.comentario || "",
    estado: estadoSolicitudToApi(solicitud.estadoSolicitud),
  };
}

export function entregaToApi(solicitudId, envio, entregaId = null) {
  const fecha = envio.fechaEntrega || null;
  return {
    id: entregaId,
    solicitudId: Number(solicitudId),
    transportistaId: null,
    fechaProgramada: fecha || null,
    fechaEntrega: envio.estadoEntrega === "Recibido" || envio.estadoEntrega === "Entregado"
      ? fecha || null
      : null,
    observaciones: buildObservacionesEntrega(envio),
    estado: estadoEntregaToApi(envio.estadoEntrega),
  };
}
