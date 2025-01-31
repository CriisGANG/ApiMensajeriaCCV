document.addEventListener("DOMContentLoaded", function () {
    const groups = JSON.parse(document.getElementById("groups-data").textContent);
    const groupList = document.getElementById("groups");
    console.log(groups);
  
    groups.forEach(group => {
      const li = document.createElement("li");
      li.textContent = group.name;
      li.addEventListener("click", function () {
        window.location.href = `/chatsGrupos/${group.id}`;
      });
      groupList.appendChild(li);
    });
  
    document.getElementById("logout").addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      window.location.href = "/";
    });
});
