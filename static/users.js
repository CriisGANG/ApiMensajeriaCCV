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

  // Añadir evento de clic para los elementos de la lista de usuarios
  userGroupList.addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
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

  // document.getElementById("cambiar-a-grupos").addEventListener("click", function () {
  //   window.location.href = "/groups";
  // });
});
