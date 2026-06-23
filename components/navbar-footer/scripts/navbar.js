
export class navbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="custom-navbar">
                <p class="navbar-logo">logo aqui</p>

                <!-- Controladores exclusivos para el comportamiento responsive -->
                <input type="checkbox" id="navbar-menu-toggle" class="navbar-hidden-checkbox">
                <label for="navbar-menu-toggle" class="navbar-hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>

                <ul id="ul-navbar">
                    <li><a href="#">Inicio</a> </li>
                    <li><a href="#">adoptar</a> </li>
                    <li><a href="#">donaciones</a> </li>
                    <li><a href="#">Sobre Nosotros</a></li>
                    <li><a href="#">Contactenos</a></li>
                    <li><a href="#">login</a> </li>
                </ul>
            </nav>`
    }

}

customElements.define('nav-bar', navbar);
