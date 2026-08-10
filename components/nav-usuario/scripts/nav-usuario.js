const scriptUrl = new URL(import.meta.url);
const componentsMarker = "/components/";
const componentsPosition = scriptUrl.pathname.indexOf(componentsMarker);

if (componentsPosition === -1) {
  throw new Error("nav-usuario.js debe estar dentro de la carpeta components.");
}

// Conserva automáticamente la carpeta del proyecto, incluso en GitHub Pages.
const projectRootPath = scriptUrl.pathname.slice(0, componentsPosition + 1);
const projectRootUrl = new URL(projectRootPath, scriptUrl);

function projectUrl(relativePath) {
  return new URL(String(relativePath).replace(/^\/+/, ""), projectRootUrl).href;
}

const navUsuarioStylesUrl = new URL("../css/nav-usuario.css", import.meta.url).href;

if (!document.querySelector('link[data-nav-usuario-styles="true"]')) {
  const styles = document.createElement("link");
  styles.rel = "stylesheet";
  styles.href = navUsuarioStylesUrl;
  styles.dataset.navUsuarioStyles = "true";
  document.head.append(styles);
}

export class NavUsuario extends HTMLElement {
  connectedCallback() {
    this.render();
    this.updateData();
    this.updateNavbarOffset();
    this.connectUserShell();

    this.handleUpdate = () => this.updateData();
    this.handleStorage = (event) => {
      if (event.key === "solicitudes") {
        this.updateData();
      }
    };

    window.addEventListener("storage", this.handleStorage);
    window.addEventListener("focus", this.handleUpdate);
    document.addEventListener("user-nav-updated", this.handleUpdate);

    const generalNavbar = document.querySelector("nav-bar");
    if (generalNavbar && "ResizeObserver" in window) {
      this.navbarObserver = new ResizeObserver(() => this.updateNavbarOffset());
      this.navbarObserver.observe(generalNavbar);
    }
  }

  disconnectedCallback() {
    window.removeEventListener("storage", this.handleStorage);
    window.removeEventListener("focus", this.handleUpdate);
    document.removeEventListener("user-nav-updated", this.handleUpdate);
    this.navbarObserver?.disconnect();
    this.userShell?.classList.remove(
      "user-shell--nav-child",
      "user-shell--nav-sibling",
    );
  }

  connectUserShell() {
    const parentShell = this.parentElement?.closest(".user-shell");
    this.userShell = parentShell || document.querySelector(".user-shell");

    if (!this.userShell) return;

    this.userShell.classList.remove(
      "user-shell--nav-child",
      "user-shell--nav-sibling",
    );
    this.userShell.classList.add(
      parentShell ? "user-shell--nav-child" : "user-shell--nav-sibling",
    );
  }

  updateNavbarOffset() {
    const generalNavbar = document.querySelector("nav-bar");

    if (!generalNavbar) {
      this.style.setProperty("--user-general-navbar-height", "0px");
      return;
    }

    requestAnimationFrame(() => {
      const navbarHeight = generalNavbar?.getBoundingClientRect().height;

      if (navbarHeight > 0) {
        this.style.setProperty("--user-general-navbar-height", `${navbarHeight}px`);
      }
    });
  }

  render() {
    const activePage = this.getAttribute("active") || "inicio";
    const showBrand = !document.querySelector("nav-bar") || this.hasAttribute("show-brand");
    const links = [
      ["inicio", "index.html", "fa-solid fa-house", "Inicio"],
      ["solicitudes", "Usuario/solicitudes/solicitudes-usuario.html", "fa-regular fa-clipboard", "Mis solicitudes"],
      ["entrega", "Usuario/Proceso-Entrega/proceso-entrega.html", "fa-solid fa-truck", "Proceso de entrega"],
      ["catalogo", "32.4Catalogo/catalogo.html", "fa-solid fa-paw", "Explorar mascotas"],
    ];

    this.innerHTML = `
      <aside
        class="user-sidebar offcanvas-lg offcanvas-start"
        id="userSidebar"
        tabindex="-1"
        aria-label="Menú del usuario"
      >
        <div class="user-sidebar-tools ${showBrand ? "has-brand" : ""}">
          ${showBrand ? `
            <a class="user-brand" href="${projectUrl("index.html")}">
              <span class="user-brand-mark" aria-hidden="true">
                <i class="fa-solid fa-paw"></i>
              </span>
              <span class="user-brand-copy">
                <strong>Hogar Amigo</strong>
                <small>Peludo</small>
              </span>
            </a>
          ` : ""}
          <button
            type="button"
            class="user-sidebar-close"
            data-bs-dismiss="offcanvas"
            data-bs-target="#userSidebar"
            aria-label="Cerrar menú"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <nav class="user-nav">
          <p class="user-nav-title">Secciones</p>
          ${links.map(([key, path, icon, label]) => `
            <a
              class="user-nav-link ${activePage === key ? "active" : ""}"
              href="${projectUrl(path)}"
              ${activePage === key ? 'aria-current="page"' : ""}
            >
              <span class="user-nav-icon"><i class="${icon}"></i></span>
              <span>${label}</span>
            </a>
          `).join("")}
        </nav>

        <div class="user-help">
          <strong>¿Necesitas ayuda?</strong>
          <a href="${projectUrl("26.2Contactenos/contactenos.html")}">Contáctanos</a>
        </div>
      </aside>
    `;
  }

  updateData() {
    const solicitudes = safeJsonParse(localStorage.getItem("solicitudes"), []);

    this.querySelectorAll("[data-user-request-count]").forEach((element) => {
      element.textContent = String(Array.isArray(solicitudes) ? solicitudes.length : 0);
    });
  }
}

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

if (!customElements.get("nav-usuario")) {
  customElements.define("nav-usuario", NavUsuario);
}
