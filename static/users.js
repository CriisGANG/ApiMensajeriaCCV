document.addEventListener("DOMContentLoaded", function () {
  const appContainer = document.querySelector(".app-container");
  const sidebar = document.querySelector(".sidebar");
  const chatContainer = document.querySelector(".chat-container");
  const users = JSON.parse(document.getElementById("users-data").textContent);
  const groups = JSON.parse(document.getElementById("groups-data").textContent);
  const userGroupList = document.getElementById("users-groups");

  // Inicialmente centrar la lista de usuarios
  appContainer.classList.add("centered");
  sidebar.classList.add("collapsed");

  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user.username;
    li.addEventListener("click", function () {
      window.location.href = `/chat/${user.username}`;
    });
    userGroupList.appendChild(li);
  });

  groups.forEach(group => {
    const li = document.createElement("li");
    li.textContent = group.name;
    li.addEventListener("click", function () {
      window.location.href = `/chatsGrupos/${group.id}`;
    });
    userGroupList.appendChild(li);
  });

  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  });

  // document.getElementById("cambiar-a-grupos").addEventListener("click", function () {
  //   window.location.href = "/groups";
  // });
});
