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

const navbarStylesUrl = new URL("../styles/navbar-footer.css", import.meta.url).href;

if (!document.querySelector('link[data-navbar-footer-styles="true"]')) {
  const navbarStyles = document.createElement("link");
  navbarStyles.rel = "stylesheet";
  navbarStyles.href = navbarStylesUrl;
  navbarStyles.dataset.navbarFooterStyles = "true";
  document.head.append(navbarStyles);
}

export class navbar extends HTMLElement {
  connectedCallback() {
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
          <li><a href="${projectUrl("index.html")}">Inicio</a></li>
          <li><a href="${projectUrl("32.4Catalogo/catalogo.html")}">Adoptar</a></li>
          <li><a href="${projectUrl("Donaciones/donaciones.html")}">Donaciones</a></li>
          <li><a href="${projectUrl("25.3SobreNosotro/sobre-nosotros-index.html")}">Sobre Nosotros</a></li>
          <li><a href="${projectUrl("26.2Contactenos/contactenos.html")}">Contáctenos</a></li>
          <li><a href="${projectUrl("Usuario/solicitudes/solicitudes-usuario.html")}">Mis Solicitudes</a></li>
          <li><a href="${projectUrl("login/login.html")}">Login</a></li>
        </ul>
      </nav>

      <section class="botones-flotantes">
        <div class="botones-flotantes">
          <a
            href="https://wa.me/573001112233?text=Hola,%20quiero%20más%20información"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-success btn-flotante rounded-pill shadow"
          >
            <img
              src="${projectUrl("assets/icons/icono-WhatsApp.jpg")}" 
              alt="WhatsApp"
              class="icono-WhatsApp"
            >
            <span>Nuestro<br>Contacto</span>
          </a>

          <a
            href="${projectUrl("32.4Catalogo/catalogo.html")}" 
            class="btn btn-warning btn-flotante rounded-pill shadow"
          >
            <img
              src="${projectUrl("assets/icons/adoptame.png")}" 
              alt="Adoptar"
              class="icono-adoptar"
            >
            <span>Adoptar</span>
          </a>
        </div>
      </section>
    `;
  }
}

// ../../assets/icons/adoptame.png
if (!customElements.get("nav-bar")) {
  customElements.define("nav-bar", navbar);
}
