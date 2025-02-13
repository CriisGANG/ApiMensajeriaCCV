document.addEventListener("load", async function () {
    console.log("JavaScript cargado correctamente.");
    const config = document.getElementById("config-logo");
    const userList = document.getElementById("users");

    try {
        console.log("Cargando usuarios...");

        // Hacer la llamada al backend


        const datajson = await response.json();
        console.log("Datos recibidos:", datajson);

        // Pintar los usuarios en la lista
        paintUsers(datajson.users);

    } catch (error) {
        console.error("Hubo un problema al obtener los datos:", error);
    }

    config.addEventListener("click", function () {
        window.location.href = `configuracion`;})

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

    // Evento para cerrar sesión
    document.getElementById("logout").addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/";
    });
});
