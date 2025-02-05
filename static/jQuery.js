$(document).ready(function() {
  $('.Prueba').on('mouseenter', function() {
    console.log("Funciona");
    $(this).addClass("bg_change"); // Agrega la clase al entrar
  }).on('mouseleave', function() {
    $(this).removeClass("bg_change"); // La elimina al salir
  });
});