export class navbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <nav class="nav-bar">
                <a class="brand" href="../../index.html">
                    <img src="../assets/logo.png" alt="Logo Hogar Amigo Peludo">
                    <p class="navbar-logo">Hogar <span>Amigo</span> Peludo</p>
                    </a>
                <input type="checkbox" id="navbar-menu-toggle" class="navbar-hidden-checkbox">
                <label for="navbar-menu-toggle" class="navbar-hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>

                <ul id="ul-navbar">
                    <li><a href="../../index.html">Inicio</a> </li>
                    <li><a href="../../32.4Catalogo/catalogo.html">adoptar</a> </li>
                    <li><a href="../../Donaciones/donaciones.html">donaciones</a> </li>
                    <li><a href="../../25.3SobreNosotro/sobre-nosotros-index.html">Sobre Nosotros</a></li>
                    <li><a href="../../26.2Contactenos/contactenos.html">Contactenos</a></li>
                    <li><a href="../../33333PerfilUsuario/perfil.html">Mi Perfil</a></li>
                    <li><a href="../../login/login.html">login</a> </li>
                </ul>
            </nav>
            <section class="botones-flotantes">
                <div class="botones-flotantes">
                    <a href="https://wa.me/573001112233?text=Hola,%20quiero%20más%20información"
                        target="_blank"
                        class="btn btn-success btn-flotante rounded-pill shadow">
                        <img src="../../assets/icons/icono-WhatsApp.jpg"
                        alt="WhatsApp"
                        class="icono-WhatsApp">
                        <span>Nuestro 
                        <br> Contacto</span>
                    </a>
                    <a href="adoptar.html" class="btn btn-warning btn-flotante rounded-pill shadow">
                        <img src="../assets/icons/adoptame.png" alt="Adoptar" class="icono-adoptar">
                        <span>Adoptar</span>
                    </a>
                </div>
            </section>        
            `;
  }
}
// ../../assets/icons/adoptame.png
customElements.define("nav-bar", navbar);
