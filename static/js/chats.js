import { conversacionesUserId, getConversacion, getUser } from "./httpFetch.js";
import { truncateString } from "./utils.js";
import { showDIV, initDivs, showAllDIVs } from "./viewController.js";

let screenMinorLg = false
let ACTUAL_DIV = "conversaciones";

function showActualDIV(div = undefined) {
  if (div) {
    ACTUAL_DIV = div
  }
  if (screenMinorLg) {
    showDIV(ACTUAL_DIV)
  }
}
function initChats() {
  //console.log("Chats");
  pintarUsuarios("users", pintarMensajes);
  screenMinorLg = window.innerWidth < 993
  initDivs()

  if (screenMinorLg) {
    showActualDIV("conversaciones")
  }
}

window.addEventListener('resize', () => {
  console.log('mostrando:'+ACTUAL_DIV);
  screenMinorLg = window.innerWidth < 993
  if(screenMinorLg){
    showActualDIV(ACTUAL_DIV)
  }else{
    showAllDIVs()
  }
});

async function getUsers(conversaciones) {
  // Filtrar y mapear las conversaciones a promesas de obtener datos de usuario
  let userPromises = conversaciones
    .filter(conversacion => conversacion.interaction_type === "user")
    .map(async conversacion => conversacion = { ...conversacion, ...await getUser(conversacion.interaction_id) })
  // Usar Promise.all para esperar todas las promesas de usuario al mismo tiempo
  try {
    // `users` será un array de los resultados de cada llamada a `getUser`
    let users = await Promise.all(userPromises);
    //console.log(users);  // Imprime o verifica el array de usuarios
    users.map((conversacion) => {
      conversacion.last_message_content = truncateString(conversacion.last_message_content)
    })

    // Ahora `users` es un array que contiene todos los objetos de usuario obtenidos
    return users;  // Devuelve el array de usuarios para su uso posterior
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];  // Devuelve un array vacío en caso de error
  }
}

async function pintarUsuarios(idElementHTML) {
  const userList = document.getElementById(idElementHTML);
  const conversaciones = await conversacionesUserId();
  let users = await getUsers(conversaciones)


  //console.log("users")
  //console.log(users)

  if (userList.hasChildNodes()) {
    while (userList.firstChild) {
      userList.removeChild(userList.firstChild);
    }
  } // Limpia la lista antes de añadir nuevos usuarios
  //console.log(users)

  users.forEach(user => {
    //console.log(user)
    const profilePictureUrl = user.user_profile_picture_url || '/static/default-profile.png';
    const li = document.createElement("li");
    const img = document.createElement("img")
    li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");
    li.innerHTML = `
            <img src="${user.user_profile_picture_url || '/static/default-profile.png'}" alt="Foto de perfil" class="profile-picture rounded-circle mr-2">
              <div class="user-info">
                  <span class="user-name">${user.username}</span>
                  <span class="user-status">${user.last_message_content}</span>
                  <span class="user-status">${user.lastMessageTimestamp}</span>
              </div>
        `;
    li.addEventListener("click", function () {
      pintarMensajes(user.username, user.last_interaction)
    });
    userList.appendChild(li);
  });

}

async function pintarMensajes(conversationUsername, timestamp) {
  const chatMessages = document.getElementById("chat-messages");
  let newMessages = await getConversacion(conversationUsername, timestamp)

  const displayedMessageIds = new Set(); // Set para almacenar los IDs de los mensajes ya mostrados
  let loggedInUser = true;
  if (chatMessages.hasChildNodes()) {
    while (chatMessages.firstChild) {
      chatMessages.removeChild(chatMessages.firstChild);
    }
  } // Limpia la lista antes de añadir nuevos usuarios

  newMessages.forEach(message => {
    try {
      if (!displayedMessageIds.has(message.id)) {
        const messageElement = document.createElement("div");
        messageElement.classList.add(
          "message",
          message.sender_username === loggedInUser ? "received" : "sent",
          "p-2",
          "mb-2",
          "rounded"
        );
        console.log("here");
        
        messageElement.style.textAlign = message.sender_username === loggedInUser ? "left" : "right"; // Alinear a la izquierda si es el usuario
        messageElement.innerHTML = "<p><strong>" + message.sender_username + "</strong>:" + message.content + "</p>";

        chatMessages.appendChild(messageElement);

        // Registrar el mensaje en el Set
        displayedMessageIds.add(message.id);
        //console.log(displayedMessageIds);

        // Actualizar el timestamp del último mensaje recibido
        //lastMessageTimestamp.value = message.created_at;
      }


    } catch (error) {
      console.error("Error al obtener los últimos mensajes:", error);
    }
  });

  console.log("Por aquí");

  if (screenMinorLg) {

    showActualDIV("mensajes")

  }

}





document.getElementById("redirect_users").addEventListener("click", () => {
  console.log("redireccionando a usuarios...");
  showActualDIV("conversaciones");
})

document.getElementById("atras").addEventListener("click", () => {
  console.log("Atrás!");
  showActualDIV("conversaciones");
})




export { initChats };










