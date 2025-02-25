document.addEventListener("DOMContentLoaded", function () {
  const users = JSON.parse(document.getElementById("users-data").textContent);
  const userList = document.getElementById("users");
  const newGroupForm = document.getElementById("new-group-form");
  const groupNameInput = document.getElementById("group-name");
  const selectedUsers = new Set();
  const newGroupButton = document.getElementById("new-group");

  // Cargar la lista de usuarios
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user.username;
    li.addEventListener("click", function() {
      li.classList.toggle("selected");
      if (li.classList.contains("selected")) {
        selectedUsers.add(user.username);
      } else {
        selectedUsers.delete(user.username);
      }
    });
    userList.appendChild(li);
  });
  
  newGroupButton.addEventListener("click", function() {
    const groupName = groupNameInput.value;
    if (groupName) {
      fetch("/newGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ groupName: groupName, users: Array.from(selectedUsers) })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        ////console.log(data.message);
        window.location.href = "/users"; // Redirect to the user list
      })
      .catch(error => {
        console.error("Error:", error);
      });
    }
  });
});
