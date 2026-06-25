export class navbar extends HTMLElement {
  connectedCallback() {
    const currentDir = window.location.pathname
      .replace(/\\/g, "/")
      .split("/")
      .slice(-2, -1)[0];
    const isContentFolder =
      currentDir === "25.3SobreNosotro" || currentDir === "26.2Contactenos";

    const links = {
      inicio: isContentFolder ? "../index.html" : "index.html",
      adoptar: isContentFolder ? "../adoptar.html" : "adoptar.html",
      donaciones: isContentFolder ? "../donaciones.html" : "donaciones.html",
      sobre:
        currentDir === "25.3SobreNosotro"
          ? "sobre-nosotros-index.html"
          : isContentFolder
            ? "../25.3SobreNosotro/sobre-nosotros-index.html"
            : "25.3SobreNosotro/sobre-nosotros-index.html",
      contacto:
        currentDir === "26.2Contactenos"
          ? "contactenos.html"
          : isContentFolder
            ? "../26.2Contactenos/contactenos.html"
            : "26.2Contactenos/contactenos.html",
      login: isContentFolder ? "../login.html" : "login.html",
    };

    this.innerHTML = `
            <nav>
                <p>logo aqui</p>
                <ul id="ul-navbar">
                    <li><a href="${links.inicio}">Inicio</a></li>
                    <li><a href="${links.adoptar}">adoptar</a></li>
                    <li><a href="${links.donaciones}">donaciones</a></li>
                    <li><a href="${links.sobre}">Sobre Nosotros</a></li>
                    <li><a href="${links.contacto}">Contactenos</a></li>
                    <li><a href="${links.login}">login</a></li>
                </ul>
            </nav>`;
  }
}

customElements.define("nav-bar", navbar);
