import { conversacionesUserId, fetchMessages, currentUser,getConversacion, getUser, getUserId } from "./httpFetch.js";
import { truncateString } from "./utils.js";
import { showDIV, initDivs, showAllDIVs } from "./viewController.js";

let screenMinorLg = false
let ACTUAL_DIV = "conversaciones";

//mantiene el estado en el utlimo div mostrado (foco)
//implementación: "no se que div estaba mostrando y quiero mostrar el último"
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


  console.log("users")
  console.log(users)

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
    const img = document.createElement("img");
    const link = document.createElement('a');
    console.log("USER_ID", user.id);
    
    link.href = `/conversation/${user.id}`;  // Configurar el enlace al endpoint deseado
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
      pintarMensajes(user.id, user.last_interaction)
    });
    li.appendChild(link);
    userList.appendChild(li);
  });

}

let loggedInUser = await currentUser(); // Definir loggedInUser
let receiverUsername = ""; // Inicializar receiverUsername vacío
const displayedMessageIds = new Set(); // Mover la declaración aquí para que sea accesible

async function pintarMensajes(conversationUsername, timestamp) {
  const chatMessages = document.getElementById("chat-messages");
  const name = await currentUser();
  const id_user = await getUserId(name);
  
  let newMessages = await fetchMessages(conversationUsername, id_user.user_id);

  const displayedMessageIds = new Set();
  if (chatMessages.hasChildNodes()) {
    while (chatMessages.firstChild) {
      chatMessages.removeChild(chatMessages.firstChild);
    }
  }

  newMessages.forEach(message => {
    try {
      if (!displayedMessageIds.has(message.id)) {
        const messageElement = document.createElement("div");
        const isSent = message.sender_username === loggedInUser;
        messageElement.classList.add(
          "message",
          message.sender_id === id_user.user_id ? "sent" : "received",
          "p-2",
          "mb-2",
          "rounded"
        );
        
        messageElement.style.textAlign = message.sender_id === id_user.user_id ? "right" : "left";
        messageElement.innerHTML = "<p><strong>" + message.sender_username + "</strong>: " + message.content + "</p>";

        chatMessages.appendChild(messageElement);
        displayedMessageIds.add(message.id);
      }
    } catch (error) {
      console.error("Error al obtener los últimos mensajes:", error);
    }
  });

  if (screenMinorLg) {
    showActualDIV("mensajes");
  }
}

function displayMessages(currentUserId) {
  const chatMessages = document.getElementById("chat-messages");  
  chatMessages.innerHTML = ''; // Limpiar contenedor actual
 let messages = fetchMessages(currentUserId)
  messages.forEach(message => {
      const messageDiv = document.createElement('div');
      const alignmentClass = message.sender_id === currentUserId ? 'right' : 'left';
      
      messageDiv.classList.add('message', alignmentClass);
      messageDiv.innerHTML = `
          <p>${message.sender_id === currentUserId ? 'You' : 'User ' + message.sender_id}: ${message.content}</p>
          <small>${new Date(message.created_at).toLocaleString()}</small>
      `;

      container.appendChild(messageDiv);
  });
}

/** DIV USUARIOS nuevi chat
 * 1) primero superponer en el index.html, en el div de chats
 * 2) gestionar la vista enseño o no enseño
 * 3) si es menor de 900px pantalla completa del modal, sino, a % y oscurecer el background para sendacion profundidad
 * 4) si haces click en el background, será un evento de atrás imitando la funcionalidad del btn atras
 * 
 * no servirá el ShowDiv, que es para gestioanr cuando son pequeñas y grandes: (muestra una y oculta las demás)
 * habrá que usar una nueva llamada showmodal (muestra una, la elegida (puede haber varias, pero es independiente
 * a la de los showDivs))
*/




document.getElementById("redirect_users").addEventListener("click", () => {
  console.log("redireccionando a usuarios...");
  showActualDIV("conversaciones");
})

document.getElementById("atras").addEventListener("click", () => {
  console.log("Atrás!");
  showActualDIV("conversaciones");
})

// SOCORRO


export { initChats };










