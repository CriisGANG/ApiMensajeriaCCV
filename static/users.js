document.addEventListener("DOMContentLoaded", async function () {
    console.log("JavaScript cargado correctamente.");
    const config = document.getElementById("config-logo");
    const userGroupList = document.getElementById("user-group-list");
    const newGroup = document.getElementById("new-group-icon");

    try {
        console.log("Cargando usuarios y grupos...");

        // Hacer la llamada al backend
        const response = await fetch("http://127.0.0.1:8000/users");
        console.log("Respuesta recibida:", response);
        if (!response.ok) {
            if (response.status === 401) {
                alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
                localStorage.removeItem("loggedInUser");
                window.location.href = "/login.html";
            } else {
                throw new Error(`Error al obtener los datos: ${response.status}`);
            }
        }

        const datajson = await response.json();
        console.log("Datos recibidos:", datajson);

        // Pintar los usuarios y grupos en la lista
        paintUserGroups(datajson.users, datajson.groups);

    } catch (error) {
        console.error("Hubo un problema al obtener los datos:", error);
    }

    config.addEventListener("click", function () {
        window.location.href = `/configuracion`;
    });

    newGroup.addEventListener("click", function() {
        window.location.href = `/newGroup`;
        // alert("prueba");
    })

    function paintUserGroups(users, groups) {
        userGroupList.innerHTML = ""; // Limpia la lista antes de añadir nuevos elementos

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
            userGroupList.appendChild(li);
        });

        groups.forEach(group => {
            const li = document.createElement("li");
            li.classList.add("list-group-item", "group-item", "d-flex", "align-items-center");
            li.innerHTML = `
                <img src="/static/default-group.png" alt="${group.name}" class="profile-picture rounded-circle mr-2" width="40">
                <span class="group-name">${group.name}</span>
            `;
            li.addEventListener("click", function () {
                window.location.href = `/chatsGrupos/${group.id}`;
            });
            userGroupList.appendChild(li);
        });
    }

    // Evento para cerrar sesión
    document.getElementById("logout").addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/";
    });
});
