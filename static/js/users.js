import { callUsers } from "./httpFetch.js";

//cada vez que se ejecute initUsers,p.e.: --> pintarUsuarios
//initUser se pasa y ejecuta en el viewController como initCallback (función de inicio del componente users.js)

//función que inicia todo lo que queramos hacer con usuarios (como constructor). Se ejecutará
//cada vez que se haga un show en viewController de usuarios.
function initUsers(){
    pintarUsuarios()
    
}



async function pintarUsuarios(){
    const userList = document.getElementById("users");
    const users = await callUsers();

    console.log(users);
    
    if (userList.hasChildNodes()) {
        while (userList.firstChild) {
          userList.removeChild(userList.firstChild);
        }
      } // Limpia la lista antes de añadir nuevos usuarios

    users.users.forEach(user => {
        const profilePictureUrl = user.user_profile_picture_url || '/static/default-profile.png';
        const li = document.createElement("li");
        const img = document.createElement("img")
        li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");
        li.innerHTML = `
            <img src="${user.user_profile_picture_url || '/static/default-profile.png'}" alt="Foto de perfil" class="profile-picture rounded-circle mr-2">
              <div class="user-info">
                  <span class="user-name">${user.username}</span>
                  <span class="user-status">${user.status || 'No hay mensajes'}</span>
              </div>
        `;
        li.addEventListener("click", function () {
            pintarConveUsuario(user.username)
        });
        userList.appendChild(li);
    });
}




document.getElementById("p-users").style.display;

export {initUsers,pintarUsuarios};

