import { loginUsuario } from "../../registro/scripts/usuarios.js";

const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email === "" || password === "") {
    alert("Completa todos los campos.");
    return;
  }

  btnLogin.disabled = true;

  try {
    const usuario = await loginUsuario(email, password);

    alert("Bienvenido " + usuario.nombre);

    const esAdmin =
      usuario.rol === "admin" ||
      usuario.rol === "transportista" ||
      usuario.tipo === "administrador" ||
      usuario.email === "admin@hogaramigo.com";

    // Admin usa nav-admin en el dashboard; cliente usa nav-usuario en perfil.
    if (esAdmin) {
      window.location.href = "../31.2Dashboard/dashboardAdmin.html";
    } else {
      window.location.href = "../33333PerfilUsuario/perfil.html";
    }
  } catch (error) {
    console.error(error);
    if (error.status === 401) {
      alert("Correo o contraseña incorrectos.");
    } else {
      alert(
        "No se pudo iniciar sesión. Verifica que el backend esté en http://localhost:8080"
      );
    }
  } finally {
    btnLogin.disabled = false;
  }
});
