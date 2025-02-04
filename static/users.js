
document.addEventListener("DOMContentLoaded", function () {
  const appContainer = document.querySelector(".app-container");
  const sidebar = document.querySelector(".sidebar");
  const chatContainer = document.querySelector(".chat-container");
  const users = JSON.parse(document.getElementById("users-data").textContent);
  const userList = document.getElementById("users");

  // Inicialmente centrar la lista de usuarios
  appContainer.classList.add("centered");
  sidebar.classList.add("collapsed");

  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user.username;
    li.addEventListener("click", function () {
      window.location.href = `/chat/${user.username}`;
    });
    userList.appendChild(li);
  });

  // Añadir evento de clic para los elementos de la lista de usuarios
  userList.addEventListener("click", function (event) {
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


 
  

  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  });
});

