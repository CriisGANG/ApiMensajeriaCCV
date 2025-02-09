
document.addEventListener("DOMContentLoaded", function () {
  const appContainer = document.querySelector(".app-container");
  const sidebar = document.querySelector(".sidebar");
  const chatContainer = document.querySelector(".chat-container");
  const users = JSON.parse(document.getElementById("users-data").textContent);
  const userList = document.getElementById("users");
  const bto_update = document.getElementById("bto_update");

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


 
  

  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  });
});

