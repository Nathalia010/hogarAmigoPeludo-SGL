const DONACIONES_KEY = "donaciones";

const donacionesIniciales = [
  {
    id: "DON-001",
    fecha: "",
    donante: "",
    tipo: "Económica",
    concepto: "Donación general",
    metodo: "",
    monto: 1000,
    estado: "Confirmada",
  },
];

export function inicializarDonaciones() {
  if (localStorage.getItem(DONACIONES_KEY) === null) {
    guardarDonaciones(donacionesIniciales);
  }
}

export function obtenerDonaciones() {
  inicializarDonaciones();

  try {
    const donaciones = JSON.parse(localStorage.getItem(DONACIONES_KEY));
    return Array.isArray(donaciones) ? donaciones : [];
  } catch (error) {
    console.error("Error al leer las donaciones:", error);
    return [];
  }
}

export function guardarDonaciones(donaciones) {
  if (!Array.isArray(donaciones)) {
    throw new Error("Las donaciones deben guardarse como un arreglo.");
  }

  localStorage.setItem(DONACIONES_KEY, JSON.stringify(donaciones));
}

export function agregarDonacion(datos) {
  const donaciones = obtenerDonaciones();
  const nuevaDonacion = {
    id: `DON-${String(Date.now()).slice(-6)}`,
    fecha: datos.fecha,
    donante: datos.donante || "",
    tipo: datos.tipo,
    concepto: datos.concepto,
    metodo: datos.metodo,
    monto: datos.tipo === "Económica" ? Math.max(0, Number(datos.monto) || 0) : 0,
    estado: datos.estado || "Confirmada",
  };

  donaciones.push(nuevaDonacion);
  guardarDonaciones(donaciones);
  return nuevaDonacion;
}

export function actualizarDonacionPendiente(id, datos) {
  const donaciones = obtenerDonaciones();
  const indice = donaciones.findIndex((donacion) => donacion.id === id);

  if (indice === -1 || donaciones[indice].estado !== "Pendiente") {
    return false;
  }

  donaciones[indice] = {
    ...donaciones[indice],
    fecha: datos.fecha,
    donante: datos.donante || "",
    tipo: datos.tipo,
    concepto: datos.concepto,
    metodo: datos.metodo,
    monto: datos.tipo === "Económica" ? Math.max(0, Number(datos.monto) || 0) : 0,
    estado: datos.estado,
    id: donaciones[indice].id,
  };

  guardarDonaciones(donaciones);
  return true;
}

export function eliminarDonacion(id) {
  const donaciones = obtenerDonaciones();
  const actualizadas = donaciones.filter((donacion) => donacion.id !== id);
  if (actualizadas.length === donaciones.length) return false;

  guardarDonaciones(actualizadas);
  return true;
}

export function obtenerResumenDonaciones() {
  const donaciones = obtenerDonaciones();
  const confirmadas = donaciones.filter((donacion) => donacion.estado === "Confirmada");

  return {
    total: donaciones.length,
    dinero: confirmadas
      .filter((donacion) => donacion.tipo === "Económica")
      .reduce((total, donacion) => total + (Number(donacion.monto) || 0), 0),
    cosas: confirmadas.filter((donacion) => donacion.tipo === "En especie").length,
  };
}
