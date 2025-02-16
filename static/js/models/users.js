import { callUsers } from "../httpFetch.js";
/** Para no tener el pintar usuarios en cada página */

async function pintarUsuarios(idElementHTML, callbackUserClick, callbackUsers){
        const userList = document.getElementById(idElementHTML);
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
                callbackUserClick()

            });
            userList.appendChild(li);
        });
    }

export {pintarUsuarios};