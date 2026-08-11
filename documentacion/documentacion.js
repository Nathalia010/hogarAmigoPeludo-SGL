// Los Web Components necesitan HTTP; al abrir con file:// se conserva el
// navbar/footer de respaldo incluidos directamente en el HTML.
if (window.location.protocol !== "file:") {
  import("../components/components.js").catch((error) => {
    console.warn("No fue posible cargar los componentes compartidos.", error);
  });
}

const PROJECT_TREE = [
  {
    name: "hogarAmigoPeludo-SGL",
    type: "folder",
    description: "Frontend de la plataforma. Contiene páginas, estilos, componentes reutilizables y el cliente de la API.",
    tags: ["frontend", "web", "repositorio"],
    children: [
      { name: "index.html", type: "file", description: "Página principal pública. Presenta la fundación, mascotas destacadas y el proceso general de adopción.", tags: ["inicio", "html"] },
      { name: "script.js", type: "file", description: "Carga la información dinámica de la página de inicio y consume los servicios del backend.", tags: ["javascript", "inicio", "api"] },
      {
        name: "css", type: "folder", description: "Estilos globales del frontend y variables visuales compartidas.",
        children: [
          { name: "style.css", type: "file", description: "Define la presentación específica de la página de inicio.", tags: ["css", "inicio"] },
          { name: "theme.css", type: "file", description: "Centraliza colores, tipografía, radios y variables visuales compartidas.", tags: ["css", "tema", "variables"] },
        ],
      },
      {
        name: "components", type: "folder", description: "Componentes web reutilizables para no repetir navbar, footer y menús en cada página.",
        children: [
          { name: "components.js", type: "file", description: "Punto de entrada que exporta y registra todos los componentes web compartidos.", tags: ["javascript", "web components"] },
          { name: "components.css", type: "file", description: "Importa en un solo lugar los estilos de los componentes compartidos.", tags: ["css", "componentes"] },
          {
            name: "navbar-footer", type: "folder", description: "Navbar público y pie de página usados en la mayoría de pantallas.",
            children: [
              { name: "scripts/navbar.js", type: "file", description: "Construye el menú principal y adapta sus enlaces según la sesión y el rol.", tags: ["navbar", "sesión", "navegación"] },
              { name: "scripts/footer.js", type: "file", description: "Construye el pie de página con enlaces, contacto y redes sociales.", tags: ["footer", "contacto"] },
              { name: "styles/navbar.css", type: "file", description: "Estilos responsive del navbar, logo, enlaces y menú hamburguesa.", tags: ["css", "navbar", "responsive"] },
              { name: "styles/footer.css", type: "file", description: "Estilos visuales y adaptables del pie de página.", tags: ["css", "footer"] },
            ],
          },
          {
            name: "nav-admin", type: "folder", description: "Menú lateral y navegación exclusiva del panel administrativo.",
            children: [
              { name: "scripts/nav-admin.js", type: "file", description: "Registra el menú administrativo, muestra el perfil y permite cerrar sesión.", tags: ["admin", "navegación"] },
              { name: "styles/nav-admin.css", type: "file", description: "Controla el diseño del menú administrativo en escritorio y móvil.", tags: ["css", "admin"] },
            ],
          },
          {
            name: "nav-usuario", type: "folder", description: "Navegación secundaria de las pantallas privadas del adoptante.",
            children: [
              { name: "scripts/nav-usuario.js", type: "file", description: "Construye el menú del adoptante y ajusta su posición respecto al navbar general.", tags: ["usuario", "navegación"] },
              { name: "css/nav-usuario.css", type: "file", description: "Estilos del menú y accesos del área privada del usuario.", tags: ["css", "usuario"] },
            ],
          },
          {
            name: "cta-btn", type: "folder", description: "Botones flotantes de contacto y acceso rápido a adopciones.",
            children: [
              { name: "scripts/botones-flotantes.js", type: "file", description: "Registra los accesos flotantes a WhatsApp y al catálogo.", tags: ["botones", "whatsapp", "cta"] },
              { name: "css/botones-flotantes.css", type: "file", description: "Posiciona y estiliza los botones flotantes.", tags: ["css", "botones"] },
            ],
          },
        ],
      },
      {
        name: "js", type: "folder", description: "Infraestructura JavaScript compartida para autenticación y comunicación con el backend.",
        children: [
          {
            name: "api", type: "folder", description: "Cliente central de la API REST y transformaciones de datos.",
            children: [
              { name: "config.js", type: "file", description: "Define la URL base del backend Spring Boot, normalmente http://localhost:8080.", tags: ["api", "configuración", "url"] },
              { name: "client.js", type: "file", description: "Encapsula fetch, encabezados, JSON y el tratamiento uniforme de errores HTTP.", tags: ["api", "fetch", "errores"] },
              { name: "adapters.js", type: "file", description: "Convierte mascotas, solicitudes y entregas entre el formato visual y los DTO de la API.", tags: ["api", "dto", "adaptadores"] },
            ],
          },
          { name: "auth-guard.js", type: "file", description: "Protege páginas privadas y redirige cuando la sesión o el rol no son válidos.", tags: ["autenticación", "seguridad", "sesión"] },
        ],
      },
      {
        name: "32.4Catalogo", type: "folder", description: "Pantalla pública para listar y seleccionar mascotas disponibles.",
        children: [
          { name: "catalogo.html", type: "file", description: "Estructura visual del catálogo de mascotas.", tags: ["html", "catálogo", "mascotas"] },
          { name: "script/scripts.js", type: "file", description: "Consulta mascotas en la API y crea sus tarjetas de catálogo.", tags: ["javascript", "catálogo", "api"] },
        ],
      },
      {
        name: "333formularioAdoptar", type: "folder", description: "Formulario para enviar una solicitud de adopción.",
        children: [
          { name: "adoptar-form.html", type: "file", description: "Campos y estructura del formulario de adopción.", tags: ["html", "formulario", "adopción"] },
          { name: "scripts.js", type: "file", description: "Valida los datos, carga la mascota elegida y registra la solicitud.", tags: ["javascript", "validación", "solicitud"] },
          { name: "styles/style.css", type: "file", description: "Diseño general del formulario de adopción.", tags: ["css", "formulario"] },
          { name: "styles/popup.css", type: "file", description: "Diseño de mensajes emergentes de confirmación o error.", tags: ["css", "modal", "popup"] },
        ],
      },
      {
        name: "31.2Dashboard", type: "folder", description: "Panel para gestionar mascotas, solicitudes, entregas y donaciones.",
        children: [
          { name: "dashboardAdmin.html", type: "file", description: "Vista inicial y resumen del panel administrativo.", tags: ["admin", "dashboard", "html"] },
          { name: "admin-crear-mascota.html", type: "file", description: "Formulario administrativo para crear o editar mascotas.", tags: ["admin", "mascotas"] },
          { name: "admin-solicitud.html", type: "file", description: "Tabla y controles para revisar solicitudes de adopción.", tags: ["admin", "solicitudes"] },
          { name: "admin-entregas.html", type: "file", description: "Pantalla de coordinación y seguimiento de entregas.", tags: ["admin", "entregas"] },
          { name: "scripts/mascotas.js", type: "file", description: "Funciones CRUD que conectan la gestión de mascotas con la API.", tags: ["javascript", "crud", "mascotas"] },
          { name: "scripts/solicitudes.js", type: "file", description: "Consulta y actualiza solicitudes y sus entregas asociadas.", tags: ["javascript", "solicitudes", "api"] },
          { name: "scripts/admin-entregas.js", type: "file", description: "Controla la interacción de la pantalla administrativa de entregas.", tags: ["javascript", "admin", "entregas"] },
        ],
      },
      {
        name: "registro", type: "folder", description: "Lógica de registro, acceso y persistencia local de la sesión.",
        children: [
          { name: "scripts/usuarios.js", type: "file", description: "Consume autenticación y administra el usuario guardado en localStorage.", tags: ["registro", "login", "localStorage"] },
        ],
      },
      {
        name: "login", type: "folder", description: "Página de acceso para adoptantes y administradores.",
        children: [
          { name: "login.html", type: "file", description: "Formulario visual de inicio de sesión.", tags: ["html", "login"] },
          { name: "script/script.js", type: "file", description: "Autentica contra la API y redirige según el rol.", tags: ["javascript", "login", "rol"] },
        ],
      },
      {
        name: "Usuario", type: "folder", description: "Pantallas privadas del adoptante para solicitudes y entregas.",
        children: [
          { name: "solicitudes/solicitudes-usuario.html", type: "file", description: "Lista las solicitudes del usuario autenticado.", tags: ["usuario", "solicitudes", "html"] },
          { name: "solicitudes/solicitudes-usuario.js", type: "file", description: "Carga desde la API las solicitudes del adoptante.", tags: ["usuario", "solicitudes", "api"] },
          { name: "Proceso-Entrega/proceso-entrega.html", type: "file", description: "Muestra el avance y datos de una entrega.", tags: ["usuario", "entrega", "html"] },
          { name: "Proceso-Entrega/proceso-entrega.js", type: "file", description: "Consulta y dibuja el estado del proceso de entrega.", tags: ["usuario", "entrega", "api"] },
        ],
      },
      {
        name: "documentacion", type: "folder", description: "Centro de ayuda con manual PDF, guía funcional y referencia del código.",
        children: [
          { name: "documentacion.html", type: "file", description: "Estructura de esta página de documentación.", tags: ["documentación", "html"] },
          { name: "documentacion.css", type: "file", description: "Diseño responsive del visor, guía y explorador de código.", tags: ["documentación", "css"] },
          { name: "documentacion.js", type: "file", description: "Controla secciones, PDF, buscador y árbol interactivo.", tags: ["documentación", "javascript", "búsqueda"] },
          { name: "documentacionHAP.pdf", type: "file", description: "Manual oficial mostrado automáticamente en el visor de documentación.", tags: ["documentación", "pdf", "manual"] },
        ],
      },
    ],
  },
  {
    name: "HogarAP", type: "folder", description: "Backend independiente en Java y Spring Boot. Expone la API REST y guarda los datos en MySQL.", tags: ["backend", "java", "spring boot"],
    children: [
      { name: "build.gradle", type: "file", description: "Configura Java, Spring Boot, dependencias, MySQL Connector y pruebas.", tags: ["gradle", "dependencias", "java"] },
      { name: "Dockerfile", type: "file", description: "Define la imagen y comandos para desplegar el backend en un contenedor.", tags: ["docker", "despliegue"] },
      {
        name: "src/main/resources", type: "folder", description: "Configuración externa y recursos utilizados por Spring Boot.",
        children: [
          { name: "application.properties", type: "file", description: "Define la conexión MySQL mediante variables de entorno y las opciones de JPA/Hibernate.", tags: ["base de datos", "mysql", "configuración"] },
        ],
      },
      {
        name: "src/main/java/.../hogarap", type: "folder", description: "Paquete principal de la aplicación backend y sus capas.",
        children: [
          { name: "HogarApApplication.java", type: "file", description: "Punto de entrada que inicia la aplicación Spring Boot.", tags: ["java", "spring boot", "main"] },
          { name: "controller", type: "folder", description: "Recibe peticiones HTTP y expone endpoints REST.", tags: ["rest", "http", "api"] },
          { name: "service", type: "folder", description: "Contiene reglas de negocio y coordina controladores con repositorios.", tags: ["servicios", "negocio", "java"] },
          { name: "repository", type: "folder", description: "Interfaces Spring Data JPA que consultan y guardan datos en MySQL.", tags: ["jpa", "mysql", "datos"] },
          { name: "entity", type: "folder", description: "Modelos JPA que representan las tablas de la base de datos.", tags: ["jpa", "entidades", "tablas"] },
          { name: "dto", type: "folder", description: "Objetos para intercambiar datos con el frontend sin exponer entidades.", tags: ["dto", "api", "datos"] },
          { name: "converter", type: "folder", description: "Convierte enumeraciones Java a valores de base de datos.", tags: ["jpa", "conversores", "enums"] },
          { name: "enums", type: "folder", description: "Valores controlados de estado, especie, género, tamaño y rol.", tags: ["java", "enum", "estados"] },
          { name: "config", type: "folder", description: "Configuración de seguridad, autenticación, CORS y beans.", tags: ["spring security", "cors", "configuración"] },
        ],
      },
      {
        name: "src/test", type: "folder", description: "Pruebas automatizadas del contexto y componentes de Spring.",
        children: [
          { name: "HogarApApplicationTests.java", type: "file", description: "Prueba base que intenta iniciar el contexto completo.", tags: ["test", "junit", "spring"] },
        ],
      },
    ],
  },
];

const FUNCTION_DOCUMENTATION = {
  "hogarAmigoPeludo-SGL/script.js": [
    ["renderMascotas(lista)", "Dibuja en la página las tarjetas de las mascotas recibidas."],
    ["esAdoptado(estado)", "Comprueba si una mascota ya tiene estado de adopción finalizado."],
    ["crearCardMascota(mascota)", "Crea el HTML de una tarjeta con los datos de una mascota."],
    ["verMascota(id)", "Abre el detalle o formulario asociado a la mascota seleccionada."],
  ],
  "hogarAmigoPeludo-SGL/components/navbar-footer/scripts/navbar.js": [
    ["projectUrl(relativePath)", "Construye enlaces correctos tanto en local como en GitHub Pages."],
    ["esAdmin(usuario)", "Determina si la sesión pertenece a un administrador o transportista."],
    ["construirEnlaces(usuario)", "Genera las opciones del navbar según la sesión y el rol."],
    ["connectedCallback()", "Renderiza el componente <nav-bar> y conecta el cierre de sesión."],
  ],
  "hogarAmigoPeludo-SGL/components/navbar-footer/scripts/footer.js": [
    ["projectUrl(relativePath)", "Resuelve rutas del proyecto para los enlaces del footer."],
    ["connectedCallback()", "Renderiza el footer, sus enlaces y los botones flotantes."],
  ],
  "hogarAmigoPeludo-SGL/components/nav-admin/scripts/nav-admin.js": [
    ["connectedCallback()", "Inicia el menú administrativo cuando se inserta en la página."],
    ["disconnectedCallback()", "Libera observadores y eventos al retirar el componente."],
    ["render()", "Construye la estructura visual del menú administrativo."],
    ["updateData()", "Actualiza perfil, indicadores y datos mostrados en el menú."],
    ["safeJsonParse(value, fallback)", "Convierte JSON sin detener la aplicación si el valor es inválido."],
    ["getInitials(name)", "Obtiene las iniciales que se muestran en el avatar."],
  ],
  "hogarAmigoPeludo-SGL/components/nav-usuario/scripts/nav-usuario.js": [
    ["connectedCallback()", "Inicia y muestra el menú privado del adoptante."],
    ["connectUserShell()", "Conecta el menú con la estructura general de la página."],
    ["updateNavbarOffset()", "Evita que el menú se superponga con el navbar superior."],
    ["render()", "Construye los enlaces del área privada."],
    ["updateData()", "Muestra la información actual del usuario."],
  ],
  "hogarAmigoPeludo-SGL/components/cta-btn/scripts/botones-flotantes.js": [
    ["projectUrl(relativePath)", "Resuelve enlaces internos del proyecto."],
    ["connectedCallback()", "Renderiza los accesos flotantes a WhatsApp y adopciones."],
  ],
  "hogarAmigoPeludo-SGL/js/api/client.js": [
    ["ApiError.constructor(...)", "Crea un error con estado HTTP y cuerpo de respuesta."],
    ["apiRequest(path, options)", "Ejecuta solicitudes fetch, serializa JSON y normaliza errores de la API."],
  ],
  "hogarAmigoPeludo-SGL/js/api/adapters.js": [
    ["parseEdad(valor)", "Convierte una edad recibida a un valor numérico utilizable."],
    ["mascotaFromApi(dto)", "Transforma un DTO de mascota al formato usado por la interfaz."],
    ["mascotaToApi(mascota)", "Prepara una mascota del formulario para enviarla a la API."],
    ["solicitudFromApi(dto, mascota, entrega)", "Combina datos de solicitud, mascota y entrega para mostrarlos."],
    ["solicitudToApi(solicitud)", "Convierte una solicitud visual al cuerpo esperado por Spring Boot."],
    ["entregaToApi(solicitudId, envio, entregaId)", "Construye el cuerpo utilizado para crear o actualizar una entrega."],
    ["buildObservacionesEntrega(envio)", "Serializa detalles adicionales del envío en las observaciones."],
  ],
  "hogarAmigoPeludo-SGL/js/auth-guard.js": [
    ["esAdministrador(usuario)", "Comprueba si el usuario posee permisos administrativos."],
    ["requerirAdmin(options)", "Protege una página y redirige sesiones sin autorización."],
    ["logoutYRedirigir(loginPath)", "Cierra la sesión y regresa a la pantalla de acceso."],
  ],
  "hogarAmigoPeludo-SGL/32.4Catalogo/script/scripts.js": [
    ["renderCatalogo()", "Consulta la API y dibuja las mascotas disponibles en el catálogo."],
    ["irAdopcion(idMascota)", "Abre el formulario con la mascota elegida."],
  ],
  "hogarAmigoPeludo-SGL/333formularioAdoptar/scripts.js": [
    ["enviarYRedirigir(solicitud)", "Guarda la solicitud y conduce al usuario al siguiente paso."],
    ["mostrarPopupSolicitudEnviada(mensaje)", "Presenta la confirmación de solicitud enviada."],
    ["mostrarPopupCrearCuenta(solicitud)", "Solicita crear una cuenta cuando el visitante aún no está registrado."],
    ["confirmarCreacionCuenta()", "Registra la cuenta y continúa el proceso de adopción."],
    ["mostrarPopupYaRegistrado()", "Informa que el correo ya corresponde a una cuenta existente."],
  ],
  "hogarAmigoPeludo-SGL/31.2Dashboard/scripts/mascotas.js": [
    ["obtenerMascotas()", "Obtiene todas las mascotas desde la API."],
    ["obtenerMascotaPorId(id)", "Consulta una mascota específica."],
    ["agregarMascota(datos)", "Crea una mascota mediante POST."],
    ["actualizarMascota(id, datos)", "Actualiza una mascota mediante PUT."],
    ["eliminarMascota(id)", "Elimina una mascota mediante DELETE."],
  ],
  "hogarAmigoPeludo-SGL/31.2Dashboard/scripts/solicitudes.js": [
    ["obtenerSolicitudes()", "Consulta y completa las solicitudes con mascotas y entregas."],
    ["obtenerSolicitudPorId(id)", "Obtiene el detalle de una solicitud."],
    ["agregarSolicitud(solicitud)", "Registra una nueva solicitud y su entrega inicial."],
    ["actualizarSolicitud(solicitud)", "Envía cambios de una solicitud existente."],
    ["cambiarEstadoSolicitud(id, estado)", "Actualiza el estado de evaluación."],
    ["actualizarEnvio(id, envio)", "Crea o actualiza la entrega asociada."],
    ["eliminarSolicitud(id)", "Elimina la entrega y la solicitud seleccionada."],
  ],
  "hogarAmigoPeludo-SGL/31.2Dashboard/scripts/admin-entregas.js": [
    ["loadDeliveries()", "Carga solicitudes y entregas para el panel."],
    ["applyFilters()", "Filtra entregas por búsqueda, estado o transportista."],
    ["renderTable()", "Dibuja la tabla paginada de entregas."],
    ["showDetail(request)", "Muestra la ficha de una entrega seleccionada."],
    ["saveStatus()", "Guarda el nuevo estado del proceso logístico."],
    ["syncAdoption(request, status)", "Sincroniza el estado de entrega con la adopción."],
  ],
  "hogarAmigoPeludo-SGL/registro/scripts/usuarios.js": [
    ["existeUsuario(email)", "Consulta si el correo ya está registrado."],
    ["loginUsuario(email, password)", "Autentica y guarda la sesión recibida."],
    ["registrarUsuario(datos)", "Crea la cuenta de un adoptante."],
    ["obtenerUsuarioLogueado()", "Recupera la sesión desde localStorage."],
    ["cerrarSesion()", "Elimina la sesión local."],
  ],
  "hogarAmigoPeludo-SGL/Usuario/solicitudes/solicitudes-usuario.js": [
    ["cargarSolicitudes()", "Obtiene las solicitudes del usuario actual."],
    ["filtrarSolicitudes()", "Aplica los filtros elegidos por el adoptante."],
    ["buscarSolicitudes()", "Busca coincidencias en las solicitudes cargadas."],
    ["mostrarSolicitudes(solicitudes)", "Dibuja las tarjetas o filas de resultados."],
  ],
  "hogarAmigoPeludo-SGL/Usuario/Proceso-Entrega/proceso-entrega.js": [
    ["iniciar()", "Carga la solicitud y prepara la vista del seguimiento."],
    ["cargarEntrega(solicitud)", "Presenta los datos logísticos de la solicitud."],
    ["cargarImagenMascota(mascota)", "Muestra una imagen segura de la mascota."],
    ["cargarInformacion(solicitud)", "Completa los datos generales de adopción."],
    ["cargarTimeline(solicitud)", "Construye la línea de tiempo del proceso."],
    ["obtenerIndiceEstado(estado, esRecoger)", "Calcula el paso activo del seguimiento."],
  ],
  "hogarAmigoPeludo-SGL/documentacion/documentacion.js": [
    ["showSection(sectionId)", "Cambia entre manual, guía y organización del código."],
    ["renderTree()", "Genera el árbol de archivos según la búsqueda actual."],
    ["buildTreeItem(item, parentPath, query)", "Construye recursivamente una rama del explorador."],
    ["showDetail(item, path)", "Presenta la descripción y funciones del elemento elegido."],
    ["loadDefaultPdf()", "Comprueba y carga documentacionHAP.pdf en el visor."],
  ],
  "HogarAP/src/main/java/.../hogarap/HogarApApplication.java": [
    ["main(String[] args)", "Inicia el contexto y el servidor de Spring Boot."],
  ],
  "HogarAP/src/test/HogarApApplicationTests.java": [
    ["contextLoads()", "Verifica que el contexto de Spring pueda iniciar correctamente."],
  ],
};

const sectionButtons = [...document.querySelectorAll("[data-section]")];
const sections = [...document.querySelectorAll(".docs-section")];
const treeContainer = document.querySelector("#code-tree");
const detailContainer = document.querySelector("#file-detail");
const searchInput = document.querySelector("#code-search");
const searchSummary = document.querySelector("#search-summary");
const expandButton = document.querySelector("#expand-all");
const pdfViewer = document.querySelector("#pdf-viewer");
const pdfFrame = document.querySelector("#pdf-frame");
const openPdf = document.querySelector("#open-pdf");

let selectedPath = "";
let allExpanded = false;

function normalizeText(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showSection(sectionId, updateHash = true) {
  const target = document.getElementById(sectionId) || sections[0];
  sections.forEach((section) => {
    const active = section === target;
    section.hidden = !active;
    section.classList.toggle("is-active", active);
  });
  sectionButtons.forEach((button) => {
    const active = button.dataset.section === target.id;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
  if (updateHash) {
    try { history.replaceState(null, "", `#${target.id}`); }
    catch { window.location.hash = target.id; }
  }
}

sectionButtons.forEach((button) => button.addEventListener("click", () => showSection(button.dataset.section)));

function itemMatches(item, query) {
  if (!query) return true;
  return normalizeText([item.name, item.description, ...(item.tags || [])].join(" ")).includes(query);
}

function branchMatches(item, query) {
  return itemMatches(item, query) || (item.children || []).some((child) => branchMatches(child, query));
}

function countMatches(items, query) {
  return items.reduce((total, item) => total + (itemMatches(item, query) ? 1 : 0) + countMatches(item.children || [], query), 0);
}

function extensionIcon(name, type) {
  if (type === "folder") return "📁";
  const icons = { html: "◇", css: "#", js: "JS", java: "J", json: "{}", gradle: "G", pdf: "PDF" };
  return icons[name.split(".").pop().toLowerCase()] || "·";
}

function showDetail(item, path) {
  selectedPath = path;
  document.querySelectorAll(".tree-item").forEach((button) => button.classList.toggle("is-selected", button.dataset.path === path));
  const kind = item.type === "folder" ? "Carpeta" : "Archivo";
  const tags = (item.tags?.length ? item.tags : [kind.toLowerCase()])
    .map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  const functions = renderFunctionDocumentation(item, path);
  detailContainer.innerHTML = `
    <span class="detail-badge">${kind}</span>
    <h3>${escapeHtml(item.name)}</h3>
    <p>${escapeHtml(item.description)}</p>
    <span class="detail-path">${escapeHtml(path)}</span>
    <div class="detail-meta">${tags}</div>
    ${functions}`;
}

function renderFunctionDocumentation(item, path) {
  if (item.type === "folder") return "";

  const documentedFunctions = FUNCTION_DOCUMENTATION[path] || [];
  if (!documentedFunctions.length) {
    return `
      <section class="detail-functions">
        <h4>Funciones y métodos</h4>
        <p class="functions-empty">Este archivo no declara funciones propias o funciona como estructura, estilos o configuración.</p>
      </section>`;
  }

  const items = documentedFunctions.map(([name, description]) => `
    <li>
      <code>${escapeHtml(name)}</code>
      <p>${escapeHtml(description)}</p>
    </li>`).join("");

  return `
    <section class="detail-functions">
      <h4>Funciones y métodos</h4>
      <ul>${items}</ul>
    </section>`;
}

function buildTreeItem(item, parentPath, query, depth = 0) {
  if (!branchMatches(item, query)) return null;
  const path = parentPath ? `${parentPath}/${item.name}` : item.name;
  const hasChildren = Boolean(item.children?.length);
  const group = document.createElement("div");
  group.className = "tree-group";
  const shouldOpen = depth === 0 || Boolean(query) || allExpanded;
  group.classList.toggle("is-open", hasChildren && shouldOpen);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "tree-item";
  button.dataset.path = path;
  button.setAttribute("role", "treeitem");
  button.setAttribute("aria-expanded", hasChildren ? String(shouldOpen) : "false");
  button.innerHTML = `
    <span class="tree-item__arrow" aria-hidden="true">${hasChildren ? "›" : ""}</span>
    <span class="tree-item__icon" aria-hidden="true">${extensionIcon(item.name, item.type)}</span>
    <span class="tree-item__name">${escapeHtml(item.name)}</span>`;
  button.addEventListener("click", () => {
    if (hasChildren) {
      group.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(group.classList.contains("is-open")));
    }
    showDetail(item, path);
  });
  group.append(button);

  if (hasChildren) {
    const children = document.createElement("div");
    children.className = "tree-children";
    children.setAttribute("role", "group");
    item.children.forEach((child) => {
      const element = buildTreeItem(child, path, query, depth + 1);
      if (element) children.append(element);
    });
    group.append(children);
  }
  if (path === selectedPath) button.classList.add("is-selected");
  return group;
}

function renderTree() {
  const query = normalizeText(searchInput.value.trim());
  treeContainer.innerHTML = "";
  PROJECT_TREE.forEach((item) => {
    const element = buildTreeItem(item, "", query);
    if (element) treeContainer.append(element);
  });
  if (!treeContainer.children.length) {
    treeContainer.innerHTML = '<div class="no-results">No encontramos archivos o carpetas relacionados con esa búsqueda.</div>';
  }
  if (query) {
    const matches = countMatches(PROJECT_TREE, query);
    searchSummary.textContent = `${matches} resultado${matches === 1 ? "" : "s"} relacionado${matches === 1 ? "" : "s"} con “${searchInput.value.trim()}”.`;
  } else {
    searchSummary.textContent = "Busca por nombre, tecnología o responsabilidad del archivo.";
  }
}

searchInput.addEventListener("input", renderTree);
expandButton.addEventListener("click", () => {
  allExpanded = !allExpanded;
  expandButton.textContent = allExpanded ? "Contraer todo" : "Expandir todo";
  renderTree();
  document.querySelectorAll(".tree-group").forEach((group) => {
    group.classList.toggle("is-open", allExpanded);
    group.querySelector(":scope > .tree-item")?.setAttribute("aria-expanded", String(allExpanded));
  });
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    showSection("codigo");
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    renderTree();
    searchInput.blur();
  }
});

function displayPdf(url, name = "documentacionHAP.pdf") {
  pdfFrame.src = url;
  pdfFrame.title = `Visor de ${name}`;
  pdfViewer.classList.add("has-pdf");
  openPdf.href = url;
  openPdf.removeAttribute("aria-disabled");
}

async function loadDefaultPdf() {
  if (window.location.protocol === "file:") {
    displayPdf("documentacionHAP.pdf");
    return;
  }

  try {
    const response = await fetch("documentacionHAP.pdf", { method: "HEAD", cache: "no-store" });
    if (response.ok) return displayPdf("documentacionHAP.pdf");
  } catch {
    // El estado vacío explica cómo añadir el manual cuando aún no existe.
  }
  openPdf.setAttribute("aria-disabled", "true");
  openPdf.addEventListener("click", (event) => {
    if (openPdf.getAttribute("aria-disabled") === "true") event.preventDefault();
  });
}

const initialSection = window.location.hash.replace("#", "");
showSection(sections.some((section) => section.id === initialSection) ? initialSection : "manual", false);
renderTree();
loadDefaultPdf();
