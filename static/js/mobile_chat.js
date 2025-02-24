document.addEventListener("DOMContentLoaded", function () {
  const chatList = document.getElementById("chat-list");
  const users = JSON.parse(document.getElementById("users-data").textContent);

  // Cargar la lista de usuarios
  users.forEach(user => {
    const div = document.createElement("div");
    div.classList.add("p-4", "flex", "items-center", "justify-between", "hover:bg-gray-50", "cursor-pointer");
    div.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <i class="fas fa-user text-gray-600"></i>
        </div>
        <div>
          <h2 class="font-semibold">${user.username}</h2>
          <p class="text-sm text-gray-600">Último mensaje</p>
        </div>
      </div>
      <span class="text-xs text-gray-500">DATETIME</span>
    `;
    div.addEventListener("click", function () {
      window.location.href = `/chat/${user.username}`;
    });
    chatList.appendChild(div);
  });
});
