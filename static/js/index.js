/**
 * Punto de entrada de la aplicación. Lo que hace la app a nivel global: ¿qué hace?
 */


import {show} from "./viewController.js";


document.addEventListener("DOMContentLoaded", function () {
  
  show("login");


  

  
  
  // document.getElementById("go-to-chat").addEventListener("click", function() {
  //   window.location.href = "/chat";
  // });

  // document.getElementById("logout").addEventListener("click", function() {
  //   localStorage.removeItem("loggedInUser");
  //   window.location.href = "/";
  // });

  // document.getElementById("save-profile-picture").addEventListener("click", async function() {
  //   const profilePictureUrl = document.getElementById("profile-picture-url").value;
  //   const response = await fetch("/update-profile-picture", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ profile_picture_url: profilePictureUrl })
  //   });

  //   if (response.ok) {
  //     alert("Foto de perfil actualizada exitosamente.");
  //     location.reload();
  //   } else {
  //     alert("Error al actualizar la foto de perfil.");
  //   }
  // });
});
