document.addEventListener("DOMContentLoaded", function () {
  const users = JSON.parse(document.getElementById("users-data").textContent);
  const userList = document.getElementById("users");

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
