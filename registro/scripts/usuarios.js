const USUARIOS_KEY = "usuarios";
const SESION_KEY = "usuarioLogueado";

function inicializarUsuarios() {
  if (!localStorage.getItem(USUARIOS_KEY)) {
    const usuarios = [
      {
        email: "admin@hogaramigo.com",
        password: "123456",
        nombre: "Administrador",
        rol: "admin",
      },
    ];

    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  }
}

inicializarUsuarios();

/**
 * Obtiene todos los usuarios registrados
 */
export function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];
}

/**
 * Verifica si ya existe una cuenta con ese correo
 */
export function existeUsuario(email) {
  const correo = String(email).trim().toLowerCase();

  return obtenerUsuarios().some(
    (usuario) => usuario.email.toLowerCase() === correo,
  );
}

/**
 * Crea una cuenta nueva y la deja como sesión activa.
 * Devuelve null si el correo ya estaba registrado.
 */
export function registrarUsuario({
  email,
  password,
  nombre,
  apellido,
  telefono,
}) {
  const correo = String(email).trim().toLowerCase();

  if (existeUsuario(correo)) {
    return null;
  }

  const usuarios = obtenerUsuarios();

  const nuevoUsuario = {
    email: correo,
    password,
    nombre: `${nombre} ${apellido ?? ""}`.trim(),
    telefono: telefono ?? "",
    rol: "cliente",
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  localStorage.setItem(SESION_KEY, JSON.stringify(nuevoUsuario));

  return nuevoUsuario;
}

/**
 * Devuelve el usuario con sesión activa, o null si no hay ninguno
 */
export function obtenerUsuarioLogueado() {
  return JSON.parse(localStorage.getItem(SESION_KEY)) || null;
}
