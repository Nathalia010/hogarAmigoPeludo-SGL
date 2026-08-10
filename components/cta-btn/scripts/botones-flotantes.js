const scriptUrl = new URL(import.meta.url);
const componentsMarker = "/components/";
const componentsPosition = scriptUrl.pathname.indexOf(componentsMarker);

if (componentsPosition === -1) {
  throw new Error("botones-flotantes.js debe estar dentro de la carpeta components.");
}

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

export class BotonesFlotantes extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
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

if (!customElements.get("botones-flotantes")) {
  customElements.define("botones-flotantes", BotonesFlotantes);
}