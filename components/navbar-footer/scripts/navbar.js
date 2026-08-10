import {
  obtenerUsuarioLogueado,
  cerrarSesion,
} from "../../../registro/scripts/usuarios.js";

const scriptUrl = new URL(import.meta.url);
const componentsMarker = "/components/";
const componentsPosition = scriptUrl.pathname.indexOf(componentsMarker);

if (componentsPosition === -1) {
  throw new Error("navbar.js debe estar dentro de la carpeta components.");
}

// Conserva automáticamente el nombre del repositorio usado por GitHub Pages.
const projectRootPath = scriptUrl.pathname.slice(0, componentsPosition + 1);
const projectRootUrl = new URL(projectRootPath, scriptUrl);

function projectUrl(relativePath) {
  return new URL(String(relativePath).replace(/^\/+/, ""), projectRootUrl).href;
}

// Preferir components.css si la página ya lo cargó; si no, cargar estilos del nav.
if (!document.querySelector('link[data-navbar-footer-styles="true"]')) {
  const existingComponents = document.querySelector(
    'link[href*="components.css"]'
  );
  if (!existingComponents) {
    const navbarStyles = document.createElement("link");
    navbarStyles.rel = "stylesheet";
    navbarStyles.href = new URL("../navbar-footer.css", import.meta.url).href;
    navbarStyles.dataset.navbarFooterStyles = "true";
    document.head.append(navbarStyles);
  }
}

function esAdmin(usuario) {
  return (
    !!usuario &&
    (usuario.rol === "admin" ||
      usuario.rol === "transportista" ||
      usuario.tipo === "administrador")
  );
}

function construirEnlaces(usuario) {
  const comunes = `
    <li><a href="${projectUrl("index.html")}">Inicio</a></li>
    <li><a href="${projectUrl("32.4Catalogo/catalogo.html")}">Adoptar</a></li>
    <li><a href="${projectUrl("Donaciones/donaciones.html")}">Donaciones</a></li>
    <li><a href="${projectUrl("25.3SobreNosotro/sobre-nosotros-index.html")}">Sobre Nosotros</a></li>
    <li><a href="${projectUrl("26.2Contactenos/contactenos.html")}">Contáctenos</a></li>
  `;

  if (!usuario) {
    return `
      ${comunes}
      <li><a href="${projectUrl("login/login.html")}">Login</a></li>
    `;
  }

  // Navbar general: el menú lateral admin/cliente vive en nav-admin / nav-usuario.
  if (esAdmin(usuario)) {
    return `
      ${comunes}
      <li><a href="${projectUrl("31.2Dashboard/dashboardAdmin.html")}">Panel admin</a></li>
      <li><a href="#" data-accion="logout">Cerrar sesión</a></li>
    `;
  }

  return `
    ${comunes}
    <li><a href="${projectUrl("Usuario/solicitudes/solicitudes-usuario.html")}">Mis Solicitudes</a></li>
    <li><a href="${projectUrl("33333PerfilUsuario/perfil.html")}">Mi Perfil</a></li>
    <li><a href="#" data-accion="logout">Cerrar sesión</a></li>
  `;
}

export class navbar extends HTMLElement {
  connectedCallback() {
    const usuario = obtenerUsuarioLogueado();

    this.innerHTML = `
      <nav class="nav-bar">
        <a class="brand" href="${projectUrl("index.html")}">
          <img src="${projectUrl("assets/logo.png")}" alt="Logo Hogar Amigo Peludo">
          <p class="navbar-logo">Hogar <span>Amigo</span> Peludo</p>
        </a>

        <input type="checkbox" id="navbar-menu-toggle" class="navbar-hidden-checkbox">
        <label for="navbar-menu-toggle" class="navbar-hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <ul id="ul-navbar">
          ${construirEnlaces(usuario)}
        </ul>
      </nav>
    `;

    this.querySelector('[data-accion="logout"]')?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        cerrarSesion();
        window.location.href = projectUrl("login/login.html");
      }
    );
  }
}

if (!customElements.get("nav-bar")) {
  customElements.define("nav-bar", navbar);
}
