document.addEventListener("DOMContentLoaded", async function () {
    console.log("JavaScript cargado correctamente.");
    const config = document.getElementById("config-logo");
    const userList = document.getElementById("users");

    try {
        console.log("Cargando usuarios...");

  groups.forEach(group => {
    const li = document.createElement("li");
    li.classList.add("border-b", "hover:bg-gray-100", "transition", "p-4", "flex", "items-center", "space-x-4");
    li.textContent = group.name;
    li.innerHTML = `
    <div class="flex-shrink-0">
      <img class="w-10 h-10 rounded-full" src="https://via.placeholder.com/150" alt="${group.name}">
    </div>
    <div>
      <h3 class="font-semibold">${group.name}</h3>
      <p class="text-sm text-gray-600">Estado</p>
    </div>
  `;
  li.addEventListener("click", function () {
    window.location.href = `/chatsGrupos/${group.id}`;
  });
  userGroupList.appendChild(li);
  });

  // Añadir evento de clic para los elementos de la lista de usuarios
  userGroupList.addEventListener("click", function (event) {
    if (event.target.tagName === "li") {
      // Desplazar la lista de usuarios a la izquierda y mostrar el chat
      appContainer.classList.remove("centered");
      appContainer.classList.add("shifted");
      sidebar.classList.remove("collapsed");
      chatContainer.classList.add("visible");

      // Aquí puedes añadir el código para cargar el chat del usuario seleccionado
      // ...
    }
  });

        // Hacer la llamada al backend
        const response = await fetch("http://127.0.0.1:8000/users");
        console.log("Respuesta recibida:", response);
        if (!response.ok) {
            if (response.status === 401) {
                alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
                localStorage.removeItem("loggedInUser");
                window.location.href = "/login.html";
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
