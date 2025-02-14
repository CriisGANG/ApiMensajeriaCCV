import { callUsers } from "./httpFetch.js";
import { getCookieValue } from "./utils.js";
import {show} from "./viewController.js";

document.addEventListener("DOMContentLoaded", function () {
  

 
  //punto de entrada de la aplicación, si hay token, intentamos ir a chats, sino al login
  if(!getCookieValue('access_token')){
    
    show("login");
  }else{
    show("chats");
    const users = callUsers()
    console.log(users);
  }

  

  
  
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
