import {
  obtenerUsuarioLogueado,
  cerrarSesion,
} from "../../../registro/scripts/usuarios.js";

function obtenerBaseApp() {
  const path = window.location.pathname.replace(/\\/g, "/");
  const partes = path.split("/").filter(Boolean);
  const raiz = partes.findIndex((parte) => parte === "hogarAmigoPeludo-SGL");

  let profundidad;

  if (raiz === -1) {
    // Fallback: carpetas bajo la página actual
    const dirs = [...partes];
    if (dirs.length && dirs[dirs.length - 1].includes(".")) {
      dirs.pop();
    }
    profundidad = dirs.length;
  } else {
    const despues = partes.slice(raiz + 1);
    if (despues.length && despues[despues.length - 1].includes(".")) {
      despues.pop();
    }
    profundidad = despues.length;
  }

  return profundidad <= 0 ? "./" : "../".repeat(profundidad);
}

function esAdmin(usuario) {
  return (
    !!usuario &&
    (usuario.rol === "admin" ||
      usuario.rol === "transportista" ||
      usuario.tipo === "administrador")
  );
}

function construirEnlaces(base, usuario) {
  const enlacesPublicos = `
    <li><a href="${base}index.html">Inicio</a></li>
    <li><a href="${base}32.4Catalogo/catalogo.html">adoptar</a></li>
    <li><a href="${base}Donaciones/donaciones.html">donaciones</a></li>
    <li><a href="${base}25.3SobreNosotro/sobre-nosotros-index.html">Sobre Nosotros</a></li>
    <li><a href="${base}26.2Contactenos/contactenos.html">Contactenos</a></li>
  `;

  if (!usuario) {
    return `
      ${enlacesPublicos}
      <li><a href="${base}login/login.html">login</a></li>
    `;
  }

  if (esAdmin(usuario)) {
    return `
      ${enlacesPublicos}
      <li><a href="${base}adminDashboard/adminDashboard.html">Panel admin</a></li>
      <li><a href="#" data-accion="logout">Cerrar sesión</a></li>
    `;
  }

  return `
    ${enlacesPublicos}
    <li><a href="${base}33333PerfilUsuario/perfil.html">Mi Perfil</a></li>
    <li><a href="#" data-accion="logout">Cerrar sesión</a></li>
  `;
}

export class navbar extends HTMLElement {
  connectedCallback() {
    const base = obtenerBaseApp();
    const usuario = obtenerUsuarioLogueado();

    this.innerHTML = `
            <nav class="nav-bar">
                <a class="brand" href="${base}index.html">
                    <img src="${base}assets/logo.png" alt="Logo Hogar Amigo Peludo">
                    <p class="navbar-logo">Hogar <span>Amigo</span> Peludo</p>
                    </a>
                <input type="checkbox" id="navbar-menu-toggle" class="navbar-hidden-checkbox">
                <label for="navbar-menu-toggle" class="navbar-hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>

                <ul id="ul-navbar">
                    ${construirEnlaces(base, usuario)}
                </ul>
            </nav>
            <section class="botones-flotantes">
                <div class="botones-flotantes">
                    <a href="https://wa.me/573001112233?text=Hola,%20quiero%20más%20información"
                        target="_blank"
                        class="btn btn-success btn-flotante rounded-pill shadow">
                        <img src="${base}assets/icons/icono-WhatsApp.jpg"
                        alt="WhatsApp"
                        class="icono-WhatsApp">
                        <span>Nuestro 
                        <br> Contacto</span>
                    </a>
                    <a href="${base}32.4Catalogo/catalogo.html" class="btn btn-warning btn-flotante rounded-pill shadow">
                        <img src="${base}assets/icons/adoptame.png" alt="Adoptar" class="icono-adoptar">
                        <span>Adoptar</span>
                    </a>
                </div>
            </section>        
            `;

    this.querySelector('[data-accion="logout"]')?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        cerrarSesion();
        window.location.href = `${base}login/login.html`;
      }
    );
  }
}

customElements.define("nav-bar", navbar);
