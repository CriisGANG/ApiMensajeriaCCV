/** 
 * Peticiones al backend (endpoints)
 * unicamente hace peticiones fetch, no interactua con el html */
const apiEndpoint = "http://127.0.0.1:8000"

/**
 * HTTP POST
*/


async function login(username, password) {
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  }
  return globalFetch("/login", options)
}

async function send_message(username, content) {
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ receiver_username: username, content: content })
  }
  return globalFetch("/send-message", options)
}







/**
 * HTTP GET
*/

async function getUserId(username) {
  let url = "/getUserId/" + username

  let options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const response = await fetch(url, options);
  const data = await response.json();
  //console.log("ID_USERRRRR ", data);

  return data;
}

async function fetchMessages(userId, currentUserId) {
  let options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  let url = `/conversacion/${userId}/${currentUserId}`;
  const response = await fetch(url, options);
  //console.log(response);

  const data = await response.json();
  //console.log("mensajes: ", data);

  return data;
}

async function getConversacion(receiverUsername, lastMessageTimestamp) {
  let options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  let url = `/conversation/${receiverUsername}?since=${lastMessageTimestamp}`;

  return globalFetch(url, options);
}

async function currentUser() {

  let options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return globalFetch("/current_user", options)
}
async function getUser(idUser) {

  //console.log("getUser", idUser);
  let options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return await globalFetch("/get-user/" + idUser, options)
}


async function callUsers() {

  let options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return await globalFetch("/users", options)
}


async function conversacionesUserId() {
  const ruta = "/conversacionesUserId"
  let options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return await globalFetch(ruta, options)
}

async function callGroups(idUser) {

  const ruta = "/groups/" + idUser
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  ////console.log("Ruta grupo:", ruta);
  return await globalFetch(ruta, options);
}

async function mensajesGrupos(groupId) {
  const ruta = "/chatsGrupos/" + groupId
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  //console.log("Ruta grupo:", ruta);
  return await globalFetch(ruta, options);
}

/**
 * HTTP DELETE
*/


/**
 * HTTP PUT
*/

async function globalFetch(ruta, options) {

  ////console.log("ruta: ", ruta);
  ////console.log("options", options);


  try {

    ////console.log("Petición: " + ruta);
    const data = await fetch(apiEndpoint + ruta, options);
    const datajson = await data.json();
    ////console.log("Respuesta: ", datajson);


    if (!data.ok) {
      throw data
    }


    return datajson

  } catch (eData) {
    console.log("ERROR", eData);

   //throw eData;



  }

}

export { send_message, login, currentUser, getUserId, callUsers, callGroups, conversacionesUserId, getUser, getConversacion, fetchMessages, mensajesGrupos };