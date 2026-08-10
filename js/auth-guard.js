import {
  obtenerUsuarioLogueado,
  cerrarSesion,
} from "../registro/scripts/usuarios.js";

export function esAdministrador(usuario = obtenerUsuarioLogueado()) {
  if (!usuario) {
    return false;
  }
  return (
    usuario.rol === "admin" ||
    usuario.rol === "transportista" ||
    usuario.tipo === "administrador"
  );
}

/**
 * Protege páginas de administración.
 * @param {{ loginPath?: string }} [options]
 * @returns {object|null} usuario admin o null si redirige
 */
export function requerirAdmin(options = {}) {
  const loginPath = options.loginPath || "../login/login.html";
  const usuario = obtenerUsuarioLogueado();

  if (!usuario) {
    alert("Debes iniciar sesión como administrador.");
    window.location.href = loginPath;
    return null;
  }

  if (!esAdministrador(usuario)) {
    alert("No tienes permisos de administrador.");
    window.location.href = "../33333PerfilUsuario/perfil.html";
    return null;
  }

  return usuario;
}

export function logoutYRedirigir(loginPath = "../login/login.html") {
  cerrarSesion();
  window.location.href = loginPath;
}
