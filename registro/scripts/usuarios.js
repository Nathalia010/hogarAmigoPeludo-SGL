import { apiRequest } from "../../js/api/client.js";

const SESION_KEY = "usuarioLogueado";

function guardarSesion(usuario) {
  localStorage.setItem(SESION_KEY, JSON.stringify(usuario));
}

/**
 * Normaliza la respuesta del API al shape que usa el frontend.
 */
function mapAuthUser(data) {
  if (!data) {
    return null;
  }
  return {
    id: data.id,
    email: data.email,
    nombre: data.nombre,
    apellido: data.apellido ?? "",
    telefono: data.telefono ?? "",
    rol: data.rol,
    tipo: data.tipo,
  };
}

/**
 * Verifica si ya existe una cuenta con ese correo (admin o cliente).
 * @returns {Promise<boolean>}
 */
export async function existeUsuario(email) {
  const correo = String(email).trim().toLowerCase();
  if (!correo) {
    return false;
  }

  const data = await apiRequest(
    `/api/auth/existe?correo=${encodeURIComponent(correo)}`
  );
  return Boolean(data?.existe);
}

/**
 * Login contra el backend.
 * @returns {Promise<object>}
 */
export async function loginUsuario(email, password) {
  const data = await apiRequest("/api/auth/login", {
    method: "POST",
    body: {
      correo: String(email).trim().toLowerCase(),
      password,
    },
  });

  const usuario = mapAuthUser(data);
  guardarSesion(usuario);
  return usuario;
}

/**
 * Registro de adoptante (cliente) y sesión activa.
 * @returns {Promise<object|null>} null si el correo ya existe
 */
export async function registrarUsuario({
  email,
  password,
  nombre,
  apellido,
  telefono,
}) {
  try {
    const data = await apiRequest("/api/auth/registro", {
      method: "POST",
      body: {
        correo: String(email).trim().toLowerCase(),
        password,
        nombre,
        apellido: apellido ?? "",
        telefono: telefono ?? "",
      },
    });

    const usuario = mapAuthUser(data);
    guardarSesion(usuario);
    return usuario;
  } catch (error) {
    if (error.status === 409) {
      return null;
    }
    throw error;
  }
}

/**
 * Devuelve el usuario con sesión activa, o null.
 */
export function obtenerUsuarioLogueado() {
  try {
    return JSON.parse(localStorage.getItem(SESION_KEY)) || null;
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  localStorage.removeItem(SESION_KEY);
}
