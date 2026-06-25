const form = document.getElementById("contactForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

const nombre = document.getElementById("nombre").value.trim();
const apellidos = document.getElementById("apellidos").value.trim();
const email = document.getElementById("email").value.trim();
const pais = document.getElementById("pais").value.trim();
const estado = document.getElementById("estado").value.trim();
const telefono = document.getElementById("telefono").value.trim();
const mensaje = document.getElementById("mensaje").value.trim();

respuesta.textContent = "";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
    respuesta.textContent = "Ingresa un correo electrónico válido.";
    return;
}

const telefonoRegex = /^[0-9]{7,15}$/;
if (!telefonoRegex.test(telefono)) {
    respuesta.textContent = "El teléfono debe contener únicamente números (7 a 15 dígitos).";
    return;
}

// Validar mensaje
if (mensaje.length < 10) {
    respuesta.textContent = "El mensaje debe contener al menos 10 caracteres.";
    return;
}

const datos = {
    nombre: nombre,
    apellidos: apellidos,
    email: email,
    pais: pais,
    estado: estado,
    telefono: telefono,
    mensaje: mensaje
};

try {

    const response = await fetch(
        "https://formspree.io/f/xeebqjpv",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(datos)
        }
    );

    if (response.ok) {
        respuesta.textContent = "Mensaje enviado correctamente.";

        form.reset();
    } else {
        respuesta.textContent = "No se pudo enviar el mensaje. Intenta nuevamente.";
    }

} catch (error) {
    console.error(error);
    respuesta.textContent = "Error de conexión. Intenta nuevamente.";
}
