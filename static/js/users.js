import { callUsers, currentUser, fetchMessages, getUserId } from "./httpFetch.js";
import { show, INTENTION_NEW_USER_CHAT } from "./viewController.js";

//cada vez que se ejecute initUsers,p.e.: --> pintarUsuarios
//initUser se pasa y ejecuta en el viewController como initCallback (función de inicio del componente users.js)

//función que inicia todo lo que queramos hacer con usuarios (como constructor). Se ejecutará
//cada vez que se haga un show en viewController de usuarios.
function initUsers() {
    pintarUsuarios()

}


async function pintarUsuarios() {
    const userList = document.getElementById("users-users");
    const users = await callUsers();
    let current_user = await currentUser()
    let user_id = await getUserId(current_user)
   //("USER", user_id.user_id);


    users.users.forEach(user => {
       //(user.id);

        const li = document.createElement("li");
        li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");

        // Crear el enlace
        const link = document.createElement("a");
        // link.href = `/conversacion/${user.id}/${user_id.user_id}`;
        link.classList.add("user-link"); // Para estilos

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
        //userStatusSpan.textContent = user.status || 'No hay mensajes';

        //añadir clase para eliminar decoration
        li.setAttribute("class", "noDecorationLinks")

        // Añadir los spans al div de información del usuario
        userInfoDiv.appendChild(userNameSpan);
        userInfoDiv.appendChild(userStatusSpan);

        // Agregar la imagen y la información dentro del enlace
        link.appendChild(img);
        link.appendChild(userInfoDiv);

        // Agregar el enlace dentro del li
        li.appendChild(link);

        // Agregar evento de click al li (opcional si necesitas más lógica antes de navegar)
        li.addEventListener("click", () => {
           //("Click al usuario!");
            show("chats", { ...{ "intention": INTENTION_NEW_USER_CHAT }, ...user })
            // Si quieres evitar que el click abra el enlace directamente, usa event.preventDefault();
        });

        // Añadir el li al contenedor de la lista de usuarios
        userList.appendChild(li);
    });

    // users.users.forEach(user => {
    //    //(user.id);

    //     const li = document.createElement("li");
    //     const link = document.createElement("a");
    //     link.href = `/conversacion/${user.id}/${user_id.user_id}`

    //     li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");

    //     // Crear y configurar la imagen del perfil
    //     const img = document.createElement("img");
    //     img.src = user.user_profile_picture_url || '/static/default-profile.png';
    //     img.alt = 'Foto de perfil';
    //     img.classList.add('profile-picture', 'rounded-circle', 'mr-2');

    //     // Crear el contenedor para la información del usuario
    //     const userInfoDiv = document.createElement("div");
    //     userInfoDiv.classList.add("user-info");

    //     // Crear y añadir el nombre del usuario
    //     const userNameSpan = document.createElement("span");
    //     userNameSpan.classList.add("user-name");
    //     userNameSpan.textContent = user.username;

    //     // Crear y añadir el estado del usuario
    //     const userStatusSpan = document.createElement("span");
    //     userStatusSpan.classList.add("user-status");
    //     userStatusSpan.textContent = user.status || 'No hay mensajes';

    //     // Añadir los spans al div de información del usuario
    //     userInfoDiv.appendChild(userNameSpan);
    //     userInfoDiv.appendChild(userStatusSpan);

    //     // Añadir la imagen y el div de información al li
    //     li.appendChild(img);
    //     link.append(li);
    //     li.appendChild(userInfoDiv);
    //     // Agregar evento de click al li para manejar la interacción del usuario
    //     li.addEventListener("click", function () {

    //        //("Click al usuario!");
    //         // corroborarSiExiste()

    //     });

    //     // Añadir el li al contenedor de la lista de usuarios
    //     userList.appendChild(li);


    // });
}

// async function corroborarSiExiste(){
//    //("CorrocorroborarSiExiste");

//     let current_user = await currentUser()
//     let user_id = await getUserId(current_user)
//    //(user_id);

//     const mensagesUsuarios = fetchMessages(user_id.user_id)



// }
/**
 * Click al usuario
 * - podemos tener una conversacion abierta o no
 *      - corroboramos mirando el id de la tabla messages
 * - si hay mensajes -> bucle for para pintar los mensajes
 * - si no hay mensajes -> crear un mensaje vacio con el usuario en cuestión
 */



document.getElementById("p-users").style.display;

export { initUsers, pintarUsuarios };

