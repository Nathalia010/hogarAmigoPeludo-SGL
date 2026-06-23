
export class navbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="nav-bar">
                <p class="navbar-logo">logo aqui</p>

                <input type="checkbox" id="navbar-menu-toggle" class="navbar-hidden-checkbox">
                <label for="navbar-menu-toggle" class="navbar-hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>

                <ul id="ul-navbar">
                    <li><a href="../../../index.html">Inicio</a> </li>
                    <li><a href="#">adoptar</a> </li>
                    <li><a href="#">donaciones</a> </li>
                    <li><a href="../../../25.3SobreNosotro/sobre-nosotros-index.html">Sobre Nosotros</a></li>
                    <li><a href="../../../26.2Contactenos/contactenos.html">Contactenos</a></li>
                    <li><a href="#">login</a> </li>
                </ul>
            </nav>
        `
    }

}

customElements.define('nav-bar', navbar);
