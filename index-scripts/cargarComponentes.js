function cargarComponente(id, archivo) {
  fetch(archivo)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    })
    .catch(error => {
      console.error("Error cargando el componente:", error);
    });
}

cargarComponente("navbar", "componentes/navbar.html");
cargarComponente("footer", "componentes/footer.html");