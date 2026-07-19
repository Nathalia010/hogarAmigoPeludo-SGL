const scriptUrl = new URL(import.meta.url);
const componentsMarker = "/components/";
const componentsPosition = scriptUrl.pathname.indexOf(componentsMarker);

if (componentsPosition === -1) {
  throw new Error("footer.js debe estar dentro de la carpeta components.");
}

// Conserva automáticamente la carpeta del repositorio en GitHub Pages.
const projectRootPath = scriptUrl.pathname.slice(0, componentsPosition + 1);
const projectRootUrl = new URL(projectRootPath, scriptUrl);

function projectUrl(relativePath) {
  return new URL(String(relativePath).replace(/^\/+/, ""), projectRootUrl).href;
}

const footerStylesUrl = new URL("../styles/navbar-footer.css", import.meta.url).href;

if (!document.querySelector('link[data-navbar-footer-styles="true"]')) {
  const footerStyles = document.createElement("link");
  footerStyles.rel = "stylesheet";
  footerStyles.href = footerStylesUrl;
  footerStyles.dataset.navbarFooterStyles = "true";
  document.head.append(footerStyles);
}

export class footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <div class="footer-top">
          <div>
            <h3>Hogar amigo peludo</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid natus magnam provident, illo
              dignissimos, animi odio ea assumenda quas numquam quia totam fugit nemo adipisci aut mollitia!</p>
          </div>

          <div class="footer-menu">
            <h3>Menú principal</h3>
            <ul id="ul-navbar">
              <li><a href="${projectUrl("index.html")}">Inicio</a></li>
              <li><a href="${projectUrl("32.4Catalogo/catalogo.html")}">Adoptar</a></li>
              <li><a href="${projectUrl("Donaciones/donaciones.html")}">Donaciones</a></li>
              <li><a href="${projectUrl("25.3SobreNosotro/sobre-nosotros-index.html")}">Sobre Nosotros</a></li>
              <li><a href="${projectUrl("26.2Contactenos/contactenos.html")}">Contáctenos</a></li>
              <li><a href="${projectUrl("login/login.html")}">Login</a></li>
            </ul>
          </div>

          <div class="footer-contact">
            <h3>Contáctenos</h3>
            <p>✉️ contacto@hogaramigopeludo.com</p>
            <p>📞 +57 333 222 1111</p>
          </div>

          <div class="social-media">
            <h3>Síguenos</h3>
            <div class="social-media-icons">
              <a href="#" aria-label="Facebook"><img src="${projectUrl("assets/icons/icono-facebook.jpg")}" alt="Facebook"></a>
              <a href="#" aria-label="Instagram"><img src="${projectUrl("assets/icons/icono-instagram.jpg")}" alt="Instagram"></a>
              <a href="#" aria-label="TikTok"><img src="${projectUrl("assets/icons/icono-tiktok.jpg")}" alt="TikTok"></a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>${new Date().getFullYear()} - Hogar amigo peludo, derechos reservados</p>
        </div>
      </footer>
    `;
  }
}

if (!customElements.get("page-footer")) {
  customElements.define("page-footer", footer);
}
