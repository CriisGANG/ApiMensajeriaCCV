document.addEventListener("DOMContentLoaded", function () {

    const p_users = document.getElementById("p-users");
    const p_chats = document.getElementById("p-chats");
    const p_login = document.getElementById("p-login");
    const mostrar = document.getElementById("mostrar");
    const ocultar = document.getElementById("ocultar");    

    function show(element) {
        element.setAttribute("class", "show");
       
    }

    function hidden() {
        p_chats.setAttribute("class", "hidden");
        p_login.setAttribute("class","hidden");
        p_users.setAttribute("class","hidden");
    }

    mostrar.addEventListener("click", show);
    ocultar.addEventListener("click", hidden);


})

export {show, hidden};