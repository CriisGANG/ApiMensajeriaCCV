
document.addEventListener("DOMContentLoaded", function () {
  const appContainer = document.querySelector(".app-container");
  const sidebar = document.querySelector(".sidebar");
  const chatContainer = document.querySelector(".chat-container");
  const users = JSON.parse(document.getElementById("users-data").textContent);
  const userList = document.getElementById("users");
  const bto_update = document.getElementById("bto_update");

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
    userList.appendChild(li);
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

