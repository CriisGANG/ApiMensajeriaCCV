async function loginOk(e){
    
    e.preventDefault()
    
    const config = document.getElementById("config-logo");
    const userList = document.getElementById("users");

    try {
        console.log("Cargando usuarios...");

        // Hacer la llamada al backend
        const response = await fetch("http://127.0.0.1:8000/users");
        console.log("Respuesta recibida:", response);
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("loggedInUser");
                window.location.href = "/";
            }else{
                throw new Error(`Error al obtener los datos: ${response.status}`);
            }
           
        }

        const datajson = await response.json();
        console.log("Datos recibidos:", datajson);

        // Pintar los usuarios en la lista
        paintUsers(datajson.users);

    } catch (error) {
        console.error("Hubo un problema al obtener los datos:", error);
    }
}
    

    function paintUsers(users) {
        userList.innerHTML = ""; // Limpia la lista antes de añadir nuevos usuarios

        users.forEach(user => {
            const profilePictureUrl = user.user_profile_picture_url || '/static/default-profile.png';
            const li = document.createElement("li");
            li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");
            li.innerHTML = `
                <img src="${profilePictureUrl}" alt="${user.username}" class="profile-picture rounded-circle mr-2" width="40">
                <span class="user-name">${user.username}</span>
            `;
            li.addEventListener("click", function () {
                window.location.href = `/chat/${user.username}`;
            });
            userList.appendChild(li);
        });
    }


        users.forEach(user => {
            const profilePictureUrl = user.user_profile_picture_url || '/static/default-profile.png';
            const li = document.createElement("li");
            li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");
            li.innerHTML = `
                <img src="${profilePictureUrl}" alt="${user.username}" class="profile-picture rounded-circle mr-2" width="40">
                <span class="user-name">${user.username}</span>
            `;
            li.addEventListener("click", function () {
                window.location.href = '/chat_page/';
            });
            userList.appendChild(li);
        });
    

    // Evento para cerrar sesión
    document.getElementById("logout").addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/";
    });

    config.addEventListener("click", function () {
        window.location.href = `configuracion`;})

    document.addEventListener("submit", (e) => { loginOk(e)})