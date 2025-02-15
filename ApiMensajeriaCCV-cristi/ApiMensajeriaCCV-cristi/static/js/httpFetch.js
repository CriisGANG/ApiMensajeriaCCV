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



/**
 * HTTP GET
*/

async function callUsers() {

  return globalFetch("/users")
}

async function callGroups() {

  try {
    const data = await fetch(apiEndpoint + "/groups");
    const datajson = await data.json();
    console.log("GRUPS", datajson);

  } catch (error) {
    console.log(error);

  }
}

async function callConverUsers(username) {

  try {
    const data = await fetch(apiEndpoint + "/chat/" + username);
    const datajson = await data.json();
    console.log("CONVERSACIONES USUARIOS", datajson);

  } catch (error) {
    console.log(error);

  }
}

async function callConverGroups(groupId) {

  try {
    const data = await fetch(apiEndpoint + "/chat/" + groupId);
    const datajson = await data.json();
    console.log("CONVERSACIONES GRUPOS", datajson);

  } catch (error) {
    console.log(error);
  }
}

/**
 * HTTP DELETE
*/


/**
 * HTTP PUT
*/

async function globalFetch(ruta, options) {



  try {

    console.log("Petición: " + ruta);
    const data = await fetch(apiEndpoint + ruta, options);
    const datajson = await data.json();
    console.log("Respuesta: ", datajson);


    if (!data.ok) {
      throw data
    }


    return datajson

  } catch (eData) {
    console.log("ERROR", eData);

    if (eData.status === 401) {
      throw new Error("error");

    }

  }

}

export { login, callUsers, callGroups, callConverUsers, callConverGroups };