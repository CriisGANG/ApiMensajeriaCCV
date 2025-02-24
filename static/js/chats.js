import { conversacionesUserId, fetchMessages, mensajesGrupos, currentUser, callGroups, getUser, getUserId, send_message } from "./httpFetch.js";
import { truncateString } from "./utils.js";
import { show, showDIV, initDivs, showAllDIVs, INTENTION_NEW_USER_CHAT, INTENTION_NEW_GROUP_CHAT } from "./viewController.js";

let screenMinorLg = false
let ACTUAL_DIV = "conversaciones";
let USER_LAST_MESSAGES = undefined;

//mantiene el estado en el utlimo div mostrado (foco)
//implementación: "no se que div estaba mostrando y quiero mostrar el último"
function showActualDIV(div = undefined) {
  screenMinorLg = window.innerWidth < 993
  if (div) {
    ACTUAL_DIV = div
  }
  if (screenMinorLg) {
    //centralizado aqui el uso de viewcontroller para mostrar un solo div 
    showDIV(ACTUAL_DIV)
  } else {
    //centralizado aqui el uso de viewcontroller para mostrar todos los div
    showAllDIVs()

  }
}

async function initChats(context) {
  initDivs()
  // INICIO CON CONTEXTO ( OTRO COMPONENTE NOS PASA CONTEXTO)
  if (context) {
    switch (context.intention) {
      case INTENTION_NEW_USER_CHAT:
        showActualDIV("mensajes")
        pintarMensajesUsuarios(context.id)
        USER_LAST_MESSAGES = await getUser(context.id)
        setTituloMensajes(USER_LAST_MESSAGES.username)
        break;
      case INTENTION_NEW_GROUP_CHAT://TODO: implementar logica para

       break;
      default:
        showActualDIV("conversaciones")
        break;
    }

  } else {

  // INICIO SIN CONTEXTO
  const name = await currentUser();
  const id_user = await getUserId(name);
  ////console.log("ID DEL USER", id_user);
  ////console.log("Chats");

  pintarUsuariosYGrupos(id_user.user_id, "users");

  screenMinorLg = window.innerWidth < 993

  if (screenMinorLg) {
    showActualDIV("conversaciones")
  }

}
}

window.addEventListener('resize', () => {
  showActualDIV(ACTUAL_DIV)
});

async function pintarUsuariosYGrupos(idUser, idElementHTML) {
  const userList = document.getElementById(idElementHTML);

  // Limpiar la lista antes de agregar nuevos elementos
  if (userList.hasChildNodes()) {
    while (userList.firstChild) {
      userList.removeChild(userList.firstChild);
    }
  }

  //Obtener y pintar usuarios
  const conversaciones = await conversacionesUserId();
  console.log(conversaciones);
  
  // Devuelve toda la info de grupos y usuarios (completa la lista de conversaciones con los valores de usuario o grupo)
  let conversationsUsersAndGroups = await getUsersAndGroups(conversaciones);
 //("USERS de get Users", conversationsUsersAndGroups);
  //console.log("convers", conversaciones);
  //FOR
  conversationsUsersAndGroups.forEach(obj => {

    //console.log("object",obj);
    let isGroup;
    let profilePicture;
    let identification;
    let ultimoMensaje = obj.last_message_content
    let ide;
    let ultimaInteraccion = obj.last_interaction

    if (obj.interaction_type === "user") {

      profilePicture = obj.user_profile_picture_url;
      identification = obj.username;
      ide = obj.id;
    }
    else if (obj.interaction_type === "group") {

      identification = obj.group_name;
      profilePicture = obj.user_profile_picture_url || "https://img.freepik.com/foto-gratis/hombre-tomando-foto-el-sus-amigos-parque_1139-591.jpg";
      ide = obj.group_id;
      isGroup = true;
     //("Pasa por grupo");
    }

    const li = document.createElement("li");
    li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");

    // Crear la imagen de perfil
    const img = document.createElement("img");
    img.setAttribute("src", profilePicture || "/static/default-profile.png");
    img.setAttribute("alt", "Foto de perfil");
    img.classList.add("profile-picture", "rounded-circle", "mr-2");

    // Crear el div que contiene la info del usuario
    const userInfo = document.createElement("div");
    userInfo.classList.add("user-info");

    // Crear el nombre del usuario
    const userName = document.createElement("span");
    userName.classList.add("user-name");
    userName.textContent = identification;

    // Crear el estado del usuario (último mensaje)
    const userStatus = document.createElement("span");
    userStatus.classList.add("user-status");
    userStatus.textContent = ultimoMensaje;

    // Agregar los elementos al div de info
    userInfo.append(userName, userStatus);

    // Agregar imagen y div con info dentro del <li>
    li.append(img, userInfo);

    // Agregar el <li> al contenedor principal (userList)
    userList.appendChild(li);

    // Agregar evento de click para cargar los mensajes del usuario
    li.addEventListener("click", async function () {

      if (obj.interaction_type === "user") {
        pintarMensajesUsuarios(ide, ultimaInteraccion);
        USER_LAST_MESSAGES = await getUser(ide)
        setTituloMensajes(USER_LAST_MESSAGES.username)
       //(USER_LAST_MESSAGES);
        //console.log("Usuario pulsado!");
      } else {
        pintarMensajesGrupos(obj)
      }

    });
  });
}

async function getUsersAndGroups(conversaciones) {
  let userPromises = [];
  let groupPromises = [];

  try {
    for (let i = 0; i < conversaciones.length; i++) {
      let conversacion = conversaciones[i];

      if (conversacion.interaction_type === "user") {
        let userPromise = getUser(conversacion.interaction_id)
          .then(userData => {
            ////("userData");
            ////(userData);
            return { ...conversacion, ...userData };
          });
        userPromises.push(userPromise);
      }

      else if (conversacion.interaction_type === "group") {
        let groupPromise = mensajesGrupos(conversacion.interaction_id)
          .then(groupData => {
            //console.log("groupData");
            //console.log(groupData);

            return { ...conversacion, ...groupData };
          });
        groupPromises.push(groupPromise);
      }
    }
    // Esperamos todas las promesas simultáneamente
    let users = await Promise.all(userPromises);
    let groups = await Promise.all(groupPromises);

    // Recortar contenido de mensajes en ambos arrays
    users.forEach(conversacion => {
      conversacion.last_message_content = truncateString(conversacion.last_message_content);
    });

    groups.forEach(conversacion => {
      conversacion.last_message_content = truncateString(conversacion.last_message_content);
    });

    // Devolver la combinación de usuarios y grupos
   //("RESULT", [...users, ...groups]);
    console.log([...users, ...groups]    );

    return [...users, ...groups];

  } catch (error) {
   //(error)
    return []; // En caso de error, devuelve un array vacío


  }
}

//        pintarMensajes(ide, ultimaInteraccion, false, undefined);
async function pintarMensajesUsuarios(conversationUsername, timestamp) {
  const chatMessages = document.getElementById("chat-messages");
  const name = await currentUser();
  const id_user = await getUserId(name);

  let newMessages = await fetchMessages(conversationUsername, id_user.user_id);

  const displayedMessageIds = new Set(); // Set para almacenar los IDs de los mensajes ya mostrados
  if (chatMessages.hasChildNodes()) {
    while (chatMessages.firstChild) {
      chatMessages.removeChild(chatMessages.firstChild);
    }
  } // Limpia la lista antes de añadir nuevos usuarios
  if(newMessages){
    newMessages.map(message => {
      try {
        if (!displayedMessageIds.has(message.id)) {
          const messageElement = document.createElement("div");
          messageElement.classList.add(
            "message",
            message.sender_username === name ? "sent" : "received",
            "p-2",
            "mb-2",
            "rounded"
          );

          const ul = document.createElement("ul");
          const strong = document.createElement("strong");
          const contenido = document.createTextNode(message.content);
          const messageDate = document.createElement("li");
          const messageStatus = document.createElement("span");

          messageStatus.classList.add("message-status");
          messageStatus.textContent = message.status === "rebut" ? "✔✔" : "✔";

          messageDate.classList.add("custom-li");
          messageDate.classList.add("message-date");
          messageDate.textContent = new Date(message.created_at).toLocaleString();

          strong.textContent = message.sender_username;

          ul.append(strong);
          ul.append(contenido);
          ul.append(messageDate);
          ul.append(messageStatus);

          messageElement.append(ul);

          chatMessages.appendChild(messageElement);

          // Registrar el mensaje en el Set
          displayedMessageIds.add(message.id);
        }
      } catch (error) {
        console.error("Error al obtener los últimos mensajes:", error);
      }
    });
  }
  //si la pantalla es pequeña, muestrame mensajes
  if (screenMinorLg) {
    showActualDIV("mensajes");
  }
}


function pintarMensajesGrupos(dataGroup) {
  const chatMessages = document.getElementById("chat-messages");
 //(dataGroup);
  const displayedMessageIds = new Set();


  let loggedInUser = true;
  if (chatMessages.hasChildNodes()) {
    while (chatMessages.firstChild) {
      chatMessages.removeChild(chatMessages.firstChild);
    }
  } // Limpia la lista antes de añadir nuevos usuarios

  dataGroup.conversacion.forEach(message => {

    if (!displayedMessageIds.has(message.id)) {
      const messageElement = document.createElement("div");
      messageElement.classList.add(
        "message",
        message.sender_username === loggedInUser ? "received" : "sent",
        "p-2",
        "mb-2",
        "rounded"
      );
      //console.log("here");

      messageElement.style.textAlign = message.sender_username === loggedInUser ? "left" : "right"; // Alinear a la izquierda si es el usuario
      messageElement.innerHTML = "<p><strong>" + message.sender_username + "</strong>:" + message.content + "</p>";

      chatMessages.appendChild(messageElement);

      // Registrar el mensaje en el Set
      displayedMessageIds.add(message.id);
      ////console.log(displayedMessageIds);

      // Actualizar el timestamp del último mensaje recibido
      //lastMessageTimestamp.value = message.created_at;
    }
  })

  //Cuando la ventana sea pequeña, abre la ventana de mensajes
  if (screenMinorLg) {

    showActualDIV("mensajes")

  }
}


function setTituloMensajes(titulo){
  document.getElementById("tituloMensajes").innerHTML = titulo;
}

/** ESTO HAY QUE IMPLEMENTARLO !!! PENDIENTE */

document.getElementById("send-message").addEventListener("click", async() => {
console.log("Enviar mensaje!");
let content = document.getElementById("chat-input").value
if(content.length >0){
  await send_message(USER_LAST_MESSAGES.username,content)
  await pintarMensajesUsuarios(USER_LAST_MESSAGES.id) 
  await pintarUsuariosYGrupos(USER_LAST_MESSAGES.id, "users")
}


})

// Evento para el logout
document.getElementById("logout").addEventListener("click", function () {
  localStorage.removeItem("loggedInUser");
  window.location.href = "/";
});


document.getElementById("atras").addEventListener("click", () => {
  //console.log("Atrás!");
  showActualDIV("conversaciones");
})

document.getElementById("add_users").addEventListener("click", () => {

  show("users");
})


export { initChats };










