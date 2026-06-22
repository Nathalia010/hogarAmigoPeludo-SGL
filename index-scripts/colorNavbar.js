function cargarComponente(id, archivo, callback) {
  fetch(archivo)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;

      if (callback) {
        callback();
      }
    })
    .catch(error => {
      console.error("Error cargando el componente:", error);
    });
}

cargarComponente("navbar", "componentes/navbar.html", function () {
  const script = document.createElement("script");
  script.src = "index-scripts/colorNavbar.js";
  document.body.appendChild(script);
});

cargarComponente("footer", "componentes/footer.html");
