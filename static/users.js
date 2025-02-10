document.addEventListener("DOMContentLoaded", function () {
  const appContainer = document.querySelector(".app-container");
  const sidebar = document.querySelector(".sidebar");
  const chatContainer = document.querySelector(".chat-container");
  const users = JSON.parse(document.getElementById("users-data").textContent);
  const groups = JSON.parse(document.getElementById("groups-data").textContent);
  const userGroupList = document.getElementById("users-groups");
  const newGroup = document.getElementById("new-group");

  // Inicialmente centrar la lista de usuarios
  appContainer.classList.add("centered");
  sidebar.classList.add("collapsed");

  users.forEach(user => {
    const profilePictureUrl = user.profile_picture_url || '/static/default-profile.png'; // Imagen por defecto
    const li = document.createElement("li");
    li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");
    li.innerHTML = `
      <img src="${profilePictureUrl}" alt="${user.username}" class="profile-picture rounded-circle mr-2">
      <div class="user-info">
        <span class="user-name">${user.username}</span>
        <span class="user-status">${user.status}</span>
      </div>
    `;
    li.addEventListener("click", function () {
      window.location.href = `/chat/${user.username}`;
    });
    userGroupList.appendChild(li);
  });

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

  newGroup.addEventListener("click", function (event) {
    window.location.href = "/newGroup";
  })

  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  });

  // Conectar al WebSocket para recibir notificaciones de nuevos mensajes
  const socket = new WebSocket(`ws://${window.location.host}/ws/chat/${localStorage.getItem("loggedInUser")}`);

  socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    if (message.sender_username !== localStorage.getItem("loggedInUser")) {
      alert("Nuevo mensaje recibido de " + message.sender_username);
    }
  };

  // document.getElementById("cambiar-a-grupos").addEventListener("click", function () {
  //   window.location.href = "/groups";
  // });
});
