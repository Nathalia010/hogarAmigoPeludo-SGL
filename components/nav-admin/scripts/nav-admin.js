const scriptUrl = new URL(import.meta.url);
const componentsMarker = "/components/";
const componentsPosition = scriptUrl.pathname.indexOf(componentsMarker);

if (componentsPosition === -1) {
  throw new Error("nav-admin.js debe estar dentro de la carpeta components.");
}

const projectRootPath = scriptUrl.pathname.slice(0, componentsPosition + 1);
const projectRootUrl = new URL(projectRootPath, scriptUrl);

function projectUrl(relativePath) {
  return new URL(String(relativePath).replace(/^\/+/, ""), projectRootUrl).href;
}

const navAdminStylesUrl = new URL("../styles/nav-admin.css", import.meta.url).href;

if (!document.querySelector('link[data-nav-admin-styles="true"]')) {
  const navAdminStyles = document.createElement("link");
  navAdminStyles.rel = "stylesheet";
  navAdminStyles.href = navAdminStylesUrl;
  navAdminStyles.dataset.navAdminStyles = "true";
  document.head.append(navAdminStyles);
}

export class NavAdmin extends HTMLElement {
  connectedCallback() {
    this.render();
    this.updateData();

    this.handleStorage = (event) => {
      if (["solicitudes", "hogarAmigo.admin.profile"].includes(event.key)) {
        this.updateData();
      }
    };

    window.addEventListener("storage", this.handleStorage);
    window.addEventListener("focus", this.updateDataBound = () => this.updateData());
    document.addEventListener("admin-profile-updated", this.updateDataBound);
    document.addEventListener("admin-requests-updated", this.updateDataBound);
  }

  disconnectedCallback() {
    window.removeEventListener("storage", this.handleStorage);
    window.removeEventListener("focus", this.updateDataBound);
    document.removeEventListener("admin-profile-updated", this.updateDataBound);
    document.removeEventListener("admin-requests-updated", this.updateDataBound);
  }

  render() {
    const activePage = this.getAttribute("active") || "dashboard";
    const links = [
      ["dashboard", "dashboardAdmin.html", "fa-solid fa-house", "Dashboard"],
      ["solicitudes", "admin-solicitud.html", "fa-regular fa-clipboard", "Solicitudes"],
      ["publicaciones", "publicaciones.html", "fa-regular fa-rectangle-list", "Publicaciones"],
      ["mascotas", "admin-crear-mascota.html", "fa-solid fa-paw", "Mascotas"],
      ["usuarios", "admin-usuarios.html", "fa-regular fa-user", "Usuarios"],
      ["entregas", "admin-entregas.html", "fa-solid fa-truck", "Entregas"],
      ["donaciones", "admin-donaciones.html", "fa-solid fa-hand-holding-heart", "Donaciones"],
      ["reportes", "reportes.html", "fa-solid fa-chart-column", "Reportes"],
      ["configuracion", "configuracion.html", "fa-solid fa-gear", "Configuración"],
    ];

    this.innerHTML = `
    
      <aside
        class="admin-sidebar offcanvas-lg offcanvas-start"
        id="adminSidebar"
        tabindex="-1"
        aria-label="Menú de administración"
      >
        <div class="sidebar-brand">
          <span class="brand-mark" aria-hidden="true"><i class="fa-solid fa-paw"></i></span>
          <span class="sidebar-label brand-copy">
            <strong>Hogar Amigo</strong>
            <small>Peludo</small>
          </span>
          <button
            type="button"
            class="sidebar-close"
            data-bs-dismiss="offcanvas"
            data-bs-target="#adminSidebar"
            aria-label="Cerrar menú"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <nav class="sidebar-nav">
          <p class="sidebar-section-title sidebar-label">Administración</p>
          ${links.map(([key, path, icon, label]) => `
            <a
              class="sidebar-link ${activePage === key ? "active" : ""}"
              href="${projectUrl(`31.2Dashboard/${path}`)}"
              title="${label}"
            >
              <span class="sidebar-icon"><i class="${icon}"></i></span>
              <span class="sidebar-label">${label}</span>
              ${key === "solicitudes" ? '<span class="sidebar-count sidebar-label" data-admin-request-count>0</span>' : ""}
            </a>
          `).join("")}
        </nav>


        <div class="sidebar-footer">
      
          <button type="button" class="logout-button" data-nav-admin-logout title="Cerrar sesión">
            <span class="sidebar-icon"><i class="fa-solid fa-arrow-right-from-bracket"></i></span>
            <span class="sidebar-label">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    `;

    this.querySelector("[data-nav-admin-logout]")?.addEventListener("click", () => {
      localStorage.removeItem("usuarioActual");
      window.location.href = projectUrl("login/login.html");
    });
  }

  updateData() {
    const solicitudes = safeJsonParse(localStorage.getItem("solicitudes"), []);
    const pendientes = Array.isArray(solicitudes)
      ? solicitudes.filter((solicitud) =>
          !["Negada", "Adoptada"].includes(solicitud.estadoSolicitud),
        ).length
      : 0;
    const profile = {
      name: "Administrador",
      role: "Administrador general",
      ...safeJsonParse(localStorage.getItem("hogarAmigo.admin.profile"), {}),
    };

    this.querySelectorAll("[data-admin-request-count]").forEach((element) => {
      element.textContent = String(pendientes);
    });
    this.querySelectorAll("[data-nav-admin-name]").forEach((element) => {
      element.textContent = profile.name;
    });
    this.querySelectorAll("[data-nav-admin-role]").forEach((element) => {
      element.textContent = profile.role;
    });
    this.querySelectorAll("[data-nav-admin-initials]").forEach((element) => {
      element.textContent = getInitials(profile.name);
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

function getInitials(name) {
  const words = String(name || "Administrador").trim().split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : words[0]?.slice(0, 2) || "AD")
    .toUpperCase();
}

if (!customElements.get("nav-admin")) {
  customElements.define("nav-admin", NavAdmin);
}
