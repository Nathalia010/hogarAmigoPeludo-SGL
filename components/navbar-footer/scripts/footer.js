
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
                            <li><a href="#">Inicio</a></li>
                            <li><a href="#">adoptar</a></li>
                            <li><a href="#">donaciones</a></li>
                            <li><a href="#">Sobre Nosotros</a></li>
                            <li><a href="#">Contáctenos</a></li>
                            <li><a href="#">login</a></li>
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
                            <a href="#"><img src="ruta-facebook.png" alt="facebook-ico"></a>
                            <a href="#"><img src="ruta-instagram.png" alt="instagram-ico"></a>
                            <a href="#"><img src="ruta-youtube.png" alt="youtube-ico"></a>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>2026 - Hogar amigo peludo, derechos reservados</p>
                </div>
            </footer>`
    }
}

customElements.define('page-footer', footer);