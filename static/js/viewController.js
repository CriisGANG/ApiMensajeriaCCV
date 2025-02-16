
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

export { show }

