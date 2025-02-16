/**
 * LOGIN: llamará al viewController para iniciar el u
 */

import { login, currentUser, callUsers } from "./httpFetch.js";
import { show } from "./viewController.js";

/*función que inicia todo lo que queramos hacer con login (como un constructor). Se ejecutará
cada vez que se haga un show en viewController de login. */

async function initLogin(){
    try {
      //el que llama al fetch, es el que trata el error que pueda haber en la peticion http
      if(await currentUser()){
          show("chats")
      } 
      //callUsers()
     
    } catch (error) {
      console.log("ERROR Login: ", error);

    } 
}

function registrar(){

}

  // Verificar si el usuario ya está logueado
if (localStorage.getItem("loggedInUser")) {
  document.body.innerHTML = `
    <div class="welcome-container">
      <h1 class="welcome-title">Bienvenido, ${localStorage.getItem("loggedInUser")}!</h1>
      <p class="welcome-message">Ya has iniciado sesión.</p>
      <button id="go-to-chat" class="btn btn-primary">Ir al chat</button>
      <button id="logout" class="btn btn-secondary">Cerrar Sesión</button>
    </div>
  `;
}


document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    await login(username, password);
    show("chats",initLogin())
  
  });

  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.reload();
});

export {initLogin};