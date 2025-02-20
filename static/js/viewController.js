
/**
 * Control de las pantallas
 */

import { initLogin } from "./login.js";
import { initUsers } from "./users.js";
import { initChats } from "./chats.js";


const pantallas = [
    { key: "chats", value: "p-chats", onInit: initChats },
    { key: "users", value: "p-users", onInit: initUsers },
    { key: "login", value: "p-login", onInit: initLogin }]

const chatDIVs = [
    { key: "conversaciones", value: "divConversaciones", onInit: initChats },
    { key: "mensajes", value: "divMensajes", onInit: initChats }]


/** const modales */

//controla la NAVEGACION de las pantallas principales (p-chats, p-users y p-login)

function show(target) {

    pantallas.forEach(pantalla => {
        if (pantalla.key === target) {
            document.getElementById(pantalla.value).style.display = 'block';
            // Función que EJECUTA (inicia) cada componente 
            //llamador de iniciadores, ejecuta una función anónima.
            pantalla.onInit()
        } else {
            document.getElementById(pantalla.value).style.display = 'none';

        }
    });

}

let execUnaVezSolo = false;

function initDivs() {
    if(!execUnaVezSolo){

        execUnaVezSolo = true;
    chatDIVs.forEach(div => {
            div.clases = obtenerAtributosPorId(div.value);
    });
    }
    

}

//controla la NAVEGACION de los dos divs principales dentro de chats (conversaciones y mensajes)
function showDIV(target) {

    document.getElementById("div-btn-atras").removeAttribute("class") //elimina las clases, para mostrar el botón atras
    chatDIVs.forEach(div => {
        if (div.key === target) {
            document.getElementById(div.value).style.display = 'block';
            anadirAtributosPorId(div.value,div.clases);

        } else {
            eliminarAtributosPorId(div.value)
            document.getElementById(div.value).style.display = 'none';

        }
    });
}


function showAllDIVs() {

    document.getElementById("div-btn-atras").setAttribute("class", "escondido") //pone la clase, para ocultar el botón atras
    chatDIVs.forEach(div => {
        
        document.getElementById(div.value).style.display = 'block';
        anadirAtributosPorId(div.value,div.clases);

    });
}


function obtenerAtributosPorId(id) {
    
    const elemento = document.getElementById(id);
    let atributoClase = {};

    if (elemento && elemento.classList.length > 0) {
        atributoClase['class'] = elemento.className;
    }

    return atributoClase;
}

function anadirAtributosPorId(id, clases) {
    
    const elemento = document.getElementById(id);
    if (elemento) {
        // Limpia las clases existentes primero si es necesario
        // elemento.className = '';
        // Directamente asignar nuevas clases
        elemento.className = clases['class'] || ''; // Asegúrate de que el objeto clases contiene la clave 'class'
    }
}

function eliminarAtributosPorId(id) {
    const elemento = document.getElementById(id);
    if (elemento) {
        // Solo elimina el atributo 'class' si existe
        if (elemento.hasAttribute('class')) {
            elemento.removeAttribute('class');
        }
    }
}


export { show, showDIV, initDivs, showAllDIVs }

