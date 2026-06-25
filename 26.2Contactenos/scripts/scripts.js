const form = document.getElementById("contactForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  limpiarErrores();

  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const telefono = document.getElementById("telefono");
  const mensaje = document.getElementById("mensaje");

  let valido = true;

  if (nombre.value.trim() === "") {
    mostrarError(nombre, "errorNombre", "El nombre es obligatorio");
    valido = false;
  }

  if (correo.value.trim() === "") {
    mostrarError(correo, "errorCorreo", "El correo es obligatorio");
    valido = false;
  } else if (!validarCorreo(correo.value.trim())) {
    mostrarError(correo, "errorCorreo", "Ingrese un correo válido");
    valido = false;
  }

  if (telefono.value.trim() === "") {
    mostrarError(telefono, "errorTelefono", "El teléfono es obligatorio");
    valido = false;
  } else if (!validarTelefono(telefono.value.trim())) {
    mostrarError(telefono, "errorTelefono", "Ingrese un teléfono válido");
    valido = false;
  }

  if (mensaje.value.trim() === "") {
    mostrarError(mensaje, "errorMensaje", "El mensaje es obligatorio");
    valido = false;
  } else if (mensaje.value.trim().length < 10) {
    mostrarError(
      mensaje,
      "errorMensaje",
      "El mensaje debe tener mínimo 10 caracteres",
    );
    valido = false;
  }

  if (valido) {
    form.submit();
  }
});

function mostrarError(campo, idError, mensaje) {
  campo.classList.add("error-input");
  document.getElementById(idError).textContent = mensaje;
}

function limpiarErrores() {
  const errores = document.querySelectorAll(".error");
  const campos = document.querySelectorAll("input, textarea");

  errores.forEach(function (error) {
    error.textContent = "";
  });

  campos.forEach(function (campo) {
    campo.classList.remove("error-input");
  });
}

function validarCorreo(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

function validarTelefono(telefono) {
  const regex = /^[0-9]{7,15}$/;
  return regex.test(telefono);
}
