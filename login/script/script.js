

if (!localStorage.getItem("usuarios")) {

    const usuarios = [
        {
            email: "admin@hogaramigo.com",
            password: "123456",
            nombre: "Administrador"
        }
    ];

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Completa todos los campos.");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios"));

    const usuario = usuarios.find(u =>
        u.email === email &&
        u.password === password
    );

    if (usuario) {

        //Guardar la sesión
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

        alert("Bienvenido " + usuario.nombre);

        //Redireccionar según el rol (admin vs cliente/adoptante)
        const esAdmin = usuario.rol === "admin" || usuario.email === "admin@hogaramigo.com";

        if (esAdmin) {
            window.location.href = "../../31.2Dashboard/dashboardAdmin.html";
        } else {
            window.location.href = "../../33333PerfilUsuario/perfil.html";
        }

    } else {

        alert("Correo o contraseña incorrectos.");

    }

});