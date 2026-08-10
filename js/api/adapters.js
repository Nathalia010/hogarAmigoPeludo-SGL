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

/** Normaliza estado de mascota al valor del backend (Adoptado, no Adoptada). */
export function estadoMascotaToApi(estado) {
  if (!estado) return "Disponible";
  if (estado === "Adoptada" || estado === "adoptada") return "Adoptado";
  return estado;
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
    estado: estadoMascotaToApi(mascota.estado || "Disponible"),
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
  "En proceso de entrega": "En camino",
  Recibido: "Entregado",
  Recogido: "Entregado",
  Entregado: "Entregado",
  Cancelado: "Cancelado",
};

const ESTADO_ENTREGA_A_UI = {
  Pendiente: "No enviado",
  "En camino": "De camino",
  Entregado: "Recibido",
  Cancelado: "Cancelado",
};

/** True si la entrega ya finalizó (recibido/recogido/entregado). */
export function esEntregaFinalizada(estado) {
  const valor = String(estado || "").trim().toLowerCase();
  return ["recibido", "recogido", "entregado"].includes(valor);
}

export function estadoEntregaToApi(estado) {
  return ESTADO_ENTREGA_A_API[estado] || estado || "Pendiente";
}

export function estadoEntregaFromApi(estado) {
  return ESTADO_ENTREGA_A_UI[estado] || estado || "No enviado";
}

function leerCampoObs(texto, clave) {
  const regex = new RegExp(`${clave}:\\s*([^|]+)`, "i");
  const match = String(texto || "").match(regex);
  return match ? match[1].trim() : "";
}

function parseObservaciones(observaciones) {
  const texto = observaciones || "";
  return {
    modalidad: leerCampoObs(texto, "Modalidad") || "Recoger en fundación",
    direccion: leerCampoObs(texto, "Dirección"),
    origen: leerCampoObs(texto, "Origen"),
    horaEstimada: leerCampoObs(texto, "Hora"),
    tiempoRestante: Number(leerCampoObs(texto, "Tiempo") || 0),
    distanciaRestante: Number(leerCampoObs(texto, "Distancia") || 0),
    transportistaNombre:
      leerCampoObs(texto, "Transportista") || "Hogar Amigo Peludo",
    transportistaTelefono: leerCampoObs(texto, "TelTransportista") || "",
    estadoProceso:
      leerCampoObs(texto, "Proceso") ||
      "Nos estaremos contactando para coordinar la fecha.",
  };
}

export function buildObservacionesEntrega(envio) {
  const modalidad = envio.modalidad || "Recoger en fundación";
  const direccion = envio.direccion || "";
  const origen = envio.origen || "";
  const horaEstimada = envio.horaEstimada || "";
  const tiempoRestante = Number(envio.tiempoRestante) || 0;
  const distanciaRestante = Number(envio.distanciaRestante) || 0;
  const transportistaNombre =
    envio.transportistaNombre || "Hogar Amigo Peludo";
  const transportistaTelefono = envio.transportistaTelefono || "";
  const proceso =
    envio.estadoProceso ||
    "Nos estaremos contactando para coordinar la fecha.";

  return [
    `Modalidad: ${modalidad}`,
    `Dirección: ${direccion}`,
    `Origen: ${origen}`,
    `Hora: ${horaEstimada}`,
    `Tiempo: ${tiempoRestante}`,
    `Distancia: ${distanciaRestante}`,
    `Transportista: ${transportistaNombre}`,
    `TelTransportista: ${transportistaTelefono}`,
    `Proceso: ${proceso}`,
  ].join(" | ");
}

function normalizarFechaApi(fecha) {
  if (!fecha) return null;
  const texto = String(fecha).trim();
  if (!texto) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) return texto;

  const partes = texto.split(/[/-]/);
  if (partes.length !== 3) return null;

  const a = Number(partes[0]);
  const b = Number(partes[1]);
  const c = Number(partes[2]);

  // yyyy-mm-dd ya cubierto; aquí dd/mm/yyyy o mm/dd/yyyy
  if (String(partes[2]).length === 4) {
    const anio = partes[2];
    const mes = String(b).padStart(2, "0");
    const dia = String(a).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
  }

  if (String(partes[0]).length === 4) {
    return `${partes[0]}-${String(b).padStart(2, "0")}-${String(c).padStart(2, "0")}`;
  }

  return null;
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
      origen: obs.origen || "",
      fechaEntrega:
        entregaDto?.fechaProgramada || entregaDto?.fechaEntrega || "",
      horaEstimada: obs.horaEstimada || "",
      tiempoRestante: obs.tiempoRestante || 0,
      distanciaRestante: obs.distanciaRestante || 0,
      transportistaNombre: obs.transportistaNombre || "Hogar Amigo Peludo",
      transportistaTelefono: obs.transportistaTelefono || "",
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
  const fecha = normalizarFechaApi(envio.fechaEntrega);
  const entregado = esEntregaFinalizada(envio.estadoEntrega);

  return {
    id: entregaId,
    solicitudId: Number(solicitudId),
    transportistaId: envio.transportistaId ?? null,
    fechaProgramada: fecha,
    fechaEntrega: entregado ? fecha : null,
    observaciones: buildObservacionesEntrega(envio),
    estado: estadoEntregaToApi(envio.estadoEntrega),
  };
}
