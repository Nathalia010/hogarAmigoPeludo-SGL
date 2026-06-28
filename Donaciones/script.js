const llaveBreb = "300 1234567";
const boton = document.getElementById("copiarBreb");

boton.addEventListener("click", () => {

    navigator.clipboard.writeText(llaveBreb);

    boton.innerHTML = "¡Llave copiada!";


});