document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded");
  const chatInput = document.getElementById("chat-input");
  const sendMessageButton = document.getElementById("send-message");
  const chatMessages = document.getElementById("chat-messages");
  const receiverUsername = window.location.pathname.split("/").pop();
  const loggedInUser = localStorage.getItem("loggedInUser");
  const lastMessageTimestamp = document.getElementById("last-message-timestamp");
  const users = JSON.parse(document.getElementById("users-data").textContent);
  const groups = JSON.parse(document.getElementById("groups-data").textContent);
  const userList = document.getElementById("users");

  const displayedMessageIds = new Set(); // Set para almacenar los IDs de los mensajes ya mostrados

  // Cargar la lista de usuarios
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user.username;
    li.addEventListener("click", function () {
      window.location.href = `/chat/${user.username}`;
    });
    userList.appendChild(li);
  });

  groups.forEach(group => {
    const li = document.createElement("li");
    li.textContent = group.name;
    li.addEventListener("click", function () {
      window.location.href = `/chatsGrupos/${group.id}`;
    });
    userList.appendChild(li);
  });

  // Conectar al WebSocket
  const socket = new WebSocket(`ws://${window.location.host}/ws/chat/${receiverUsername}`);

  // Cuando recibe un mensaje del servidor, lo muestra en el chat
  socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    if (!displayedMessageIds.has(message.id)) {
      const messageElement = document.createElement("div");
      messageElement.classList.add(
        "message",
        message.sender_username === loggedInUser ? "sent" : "received",
        message.status === "llegit" ? "read" : message.status === "rebut" ? "received" : "sent"
      );
      messageElement.innerHTML = `<p><strong>${message.sender_username || "undefined"}</strong>: ${message.content}</p>`;
      chatMessages.appendChild(messageElement);

      // Registrar el mensaje en el Set
      displayedMessageIds.add(message.id);
      console.log(displayedMessageIds);

      // Actualizar el timestamp del último mensaje recibido
      lastMessageTimestamp.value = message.created_at;
    }
  };

  // Función para enviar un mensaje
  sendMessageButton.addEventListener("click", async function () {
    const messageContent = chatInput.value;
    if (messageContent.trim() === "") return;

    // Generar un ID único basado en timestamp + username
    const messageId = `${Date.now()}-${loggedInUser}`;

    // Verificar si el mensaje ya fue mostrado antes de enviarlo
    if (displayedMessageIds.has(messageId)) {
      return; // No agregar mensaje duplicado
    }

    // Registrar el mensaje en el Set antes de enviarlo
    displayedMessageIds.add(messageId);

    // Enviar mensaje a través de fetch
    await fetch('/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiver_username: receiverUsername, content: messageContent })
    });

    // Crear el elemento del mensaje y agregarlo al chat
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "sent");
    messageElement.setAttribute("data-id", messageId); // Guardar el ID en el HTML
    messageElement.innerHTML = `<p><strong>${loggedInUser}</strong>: ${messageContent}</p>`;
    chatMessages.appendChild(messageElement);

    // Limpiar el input de mensaje
    chatInput.value = "";

    // Actualizar el timestamp del último mensaje enviado
    lastMessageTimestamp.value = new Date().toISOString();
  });

  const settingsModal = document.getElementById("settings-modal");
  const closeButton = document.querySelector(".close-button");
  const saveProfilePictureButton = document.getElementById("save-profile-picture");
  const profilePictureUrlInput = document.getElementById("profile-picture-url");

  // Add event listener to profile picture to open the settings modal
  const profilePicture = document.getElementById("profile-picture");
  if (profilePicture) {
    profilePicture.addEventListener("click", function () {
      settingsModal.style.display = "block";
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", function () {
      settingsModal.style.display = "none";
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === settingsModal) {
      settingsModal.style.display = "none";
    }
  });

  if (saveProfilePictureButton) {
    saveProfilePictureButton.addEventListener("click", async function () {
      const profilePictureUrl = profilePictureUrlInput.value;
      if (!profilePictureUrl) return;

      try {
        const response = await fetch("/update-profile-picture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile_picture_url: profilePictureUrl })
        });

        if (response.ok) {
          const data = await response.json();
          document.getElementById("profile-picture").src = profilePictureUrl;
          settingsModal.style.display = "none";
          alert("Foto de perfil actualizada con éxito.");
        } else {
          console.error("Error al actualizar la foto de perfil");
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    });
  }

  // Evento para cerrar sesión
  document.getElementById("logout").addEventListener("click", async function () {
    const response = await fetch("/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    if (response.ok) {
      localStorage.removeItem("loggedInUser");
      window.location.href = "/";
    } else {
      alert("Error al cerrar sesión.");
    }
  });

  const appearanceButton = document.getElementById("appearance-button");
  const appearanceDropdown = document.getElementById("appearance-dropdown");

  appearanceButton.addEventListener("click", function () {
    appearanceDropdown.classList.toggle("show");
  });

  document.getElementById("dark-mode").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
  });

  document.getElementById("high-contrast").addEventListener("click", function () {
    document.body.classList.toggle("high-contrast");
  });

  document.getElementById("change-bg").addEventListener("click", function () {
    document.getElementById("bg-modal").style.display = "block";
  });

  document.getElementById("save-bg-picture").addEventListener("click", async function () {
    const bgPictureUrl = document.getElementById("bg-picture-url").value;
    const response = await fetch("/update-bg-picture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bg_picture_url: bgPictureUrl })
    });

    if (response.ok) {
      alert("Imagen de fondo actualizada exitosamente.");
      document.getElementById("bg-modal").style.display = "none";
      location.reload();
    } else {
      alert("Error al actualizar la imagen de fondo.");
    }
  });

  window.onclick = function(event) {
    if (!event.target.matches('#appearance-button')) {
      var dropdowns = document.getElementsByClassName("appearance-dropdown");
      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
});
