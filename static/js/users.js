import { callUsers } from "./httpFetch.js";

//cada vez que se ejecute initUsers,p.e.: --> pintarUsuarios
//initUser se pasa y ejecuta en el viewController como initCallback (función de inicio del componente users.js)

//función que inicia todo lo que queramos hacer con usuarios (como constructor). Se ejecutará
//cada vez que se haga un show en viewController de usuarios.
function initUsers(){
    pintarUsuarios()
    
}



// async function pintarUsuarios(){
//     const userList = document.getElementById("users-users");
//     const users = await callUsers();

//     //console.log(users);
    
//     if (userList.hasChildNodes()) {
//         while (userList.firstChild) {
//           userList.removeChild(userList.firstChild);
//         }
//       } // Limpia la lista antes de añadir nuevos usuarios

//     users.users.forEach(user => {
//         const profilePictureUrl = user.user_profile_picture_url || '/static/default-profile.png';
//         const li = document.createElement("li");
//         const img = document.createElement("img")
//         li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");
//         li.innerHTML = `
//             <img src="${user.user_profile_picture_url || '/static/default-profile.png'}" alt="Foto de perfil" class="profile-picture rounded-circle mr-2">
//               <div class="user-info">
//                   <span class="user-name">${user.username}</span>
//                   <span class="user-status">${user.status || 'No hay mensajes'}</span>
//               </div>
//         `;
//         li.addEventListener("click", function () {
//             pintarConveUsuario(user.username)
//         });
//         userList.appendChild(li);
//     });
// }

async function pintarUsuarios() {
    const userList = document.getElementById("users-users"); 
    const users = await callUsers();
    users.users.forEach(user => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");

        // Crear y configurar la imagen del perfil
        const img = document.createElement("img");
        img.src = user.user_profile_picture_url || '/static/default-profile.png';
        img.alt = 'Foto de perfil';
        img.classList.add('profile-picture', 'rounded-circle', 'mr-2');

        // Crear el contenedor para la información del usuario
        const userInfoDiv = document.createElement("div");
        userInfoDiv.classList.add("user-info");

        // Crear y añadir el nombre del usuario
        const userNameSpan = document.createElement("span");
        userNameSpan.classList.add("user-name");
        userNameSpan.textContent = user.username;

        // Crear y añadir el estado del usuario
        const userStatusSpan = document.createElement("span");
        userStatusSpan.classList.add("user-status");
        userStatusSpan.textContent = user.status || 'No hay mensajes';

        // Añadir los spans al div de información del usuario
        userInfoDiv.appendChild(userNameSpan);
        userInfoDiv.appendChild(userStatusSpan);

        // Añadir la imagen y el div de información al li
        li.appendChild(img);
        li.appendChild(userInfoDiv);

        // Agregar evento de click al li para manejar la interacción del usuario
        li.addEventListener("click", function() {
            pintarConveUsuario(user.username); // Asegúrate de que esta función está definida correctamente
        });

        // Añadir el li al contenedor de la lista de usuarios
        userList.appendChild(li);
    });
}




document.getElementById("p-users").style.display;

export {initUsers,pintarUsuarios};

