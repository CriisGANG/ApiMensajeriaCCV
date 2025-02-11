document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM Cargado");
  const chatInput = document.getElementById("chat-input");
  const sendMessageButton = document.getElementById("send-message");
  const chatMessages = document.getElementById("chat-messages");
  const receiverUsername = window.location.pathname.split("/").pop();
  const loggedInUser = localStorage.getItem("loggedInUser");
  const lastMessageTimestamp = document.getElementById("last-message-timestamp");
  const userList = document.getElementById("users");
  const groupList = document.getElementById("groups");

  const displayedMessageIds = new Set(); // Set para almacenar los IDs de los mensajes ya mostrados

  // Fetch users and conversations data
  let users = [];
  let groups = [];
  let conversations = {};
  try {
    const usersResponse = await fetch('http://127.0.0.1:8000/api/get-users');
    if (!usersResponse.ok) {
      if (usersResponse.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("loggedInUser");
        window.location.href = "/login.html";
      }
      throw new Error('Network response was not ok');
    }
    users = await usersResponse.json();


    const conversationsResponse = await fetch(`http://127.0.0.1:8000/api/get-chat-data?username=${loggedInUser}`);
    if (!conversationsResponse.ok) {
      if (conversationsResponse.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("loggedInUser");
        window.location.href = "/login.html";
      }
      throw new Error('Network response was not ok');
    }
    conversations = await conversationsResponse.json();
  } catch (error) {
    console.error('Error fetching users or conversations data:', error);
  }
  try {
    const groupsResponse = await fetch('http://127.0.0.1:8000/api/get-groups');
    if (!groupsResponse.ok) {
      if (groupsResponse.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("loggedInUser");
        window.location.href = "/login.html";
      }
      throw new Error('Network response was not ok');
    }
    groups = await groupsResponse.json(); }
    catch (error) {
      console.error('Error', error);
    }


    //   const conversationsResponse = await fetch(`http://127.0.0.1:8000/api/get-chat-data?username=${loggedInUser}`);
    //   if (!conversationsResponse.ok) {
    //     if (conversationsResponse.status === 401) {
    //       alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
    //       localStorage.removeItem("loggedInUser");
    //       window.location.href = "/login.html";
    //     }
    //     throw new Error('Network response was not ok');
    //   }
    //   conversations = await conversationsResponse.json();
    // } catch (error) {
    //   console.error('Error fetching users or conversations data:', error);
    // }

    // Cargar la lista de usuarios
    userList.innerHTML = ''; // Limpiar la lista de usuarios antes de agregar nuevos

    users.forEach(user => {
      const profilePictureUrl = user.user_profile_picture_url || '/static/default-profile.png'; // Imagen por defecto
      const lastMessage = conversations[user.username] && conversations[user.username].length > 0
        ? conversations[user.username].slice(-1)[0].content
        : 'No hay mensajes';
      const li = document.createElement("li");
      li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");
      li.innerHTML = `
      <img src="${profilePictureUrl}" alt="Foto de perfil" class="profile-picture rounded-circle mr-2">
      <div class="user-info">
        <span class="user-name">${user.username}</span>
        <span class="user-status">${lastMessage}</span>
      </div>
    `;
      li.addEventListener("click", function () {
        window.location.href = `/chat/${user.username}`;
      });
      userList.appendChild(li);
    });

        // Cargar la lista de usuarios
        groupList.innerHTML = ''; // Limpiar la lista de usuarios antes de agregar nuevos

        groups.forEach(group => {
          const li = document.createElement("li");
          li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");
          li.innerHTML = `
          <div class="user-info">
            <span class="group-name">${group.name}</span>
          </div>
        `;
          li.addEventListener("click", function () {
            window.location.href = `/chat/${group.name}`;
          });
          groupList.appendChild(li);
        });

    // Conectar al WebSocket
    const socket = new WebSocket(`ws://${window.location.host}/ws/chat/${loggedInUser}`);

    // Cuando recibe un mensaje del servidor, lo muestra en el chat
    socket.onmessage = function (event) {
      const message = JSON.parse(event.data);
      if (!displayedMessageIds.has(message.id)) {
        const messageElement = document.createElement("div");
        messageElement.classList.add(
          "message",
          message.sender_username === loggedInUser ? "received" : "sent",
          "p-2",
          "mb-2",
          "rounded"
        );
        messageElement.style.textAlign = message.sender_username === loggedInUser ? "left" : "right"; // Alinear a la izquierda si es el usuario
        messageElement.innerHTML = `<p><strong>${message.sender_username || "undefined"}</strong>: ${message.content}</p>`;
        chatMessages.appendChild(messageElement);

        // Registrar el mensaje en el Set
        displayedMessageIds.add(message.id);
        console.log(displayedMessageIds);

        // Actualizar el timestamp del último mensaje recibido
        lastMessageTimestamp.value = message.created_at;

        // Mostrar alerta de nuevo mensaje
        if (message.sender_username !== loggedInUser) {
          alert("Nuevo mensaje recibido de " + message.sender_username);
        }
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
      messageElement.classList.add("message", "received", "p-2", "mb-2", "rounded");
      messageElement.setAttribute("data-id", messageId); // Guardar el ID en el HTML
      messageElement.innerHTML = `<p><strong>${loggedInUser}</strong>: ${messageContent}</p>`;
      chatMessages.appendChild(messageElement);

      // Limpiar el input de mensaje
      chatInput.value = "";

      // Actualizar el timestamp del último mensaje enviado
      lastMessageTimestamp.value = new Date().toISOString();
    });

    const settingsButton = document.getElementById("settings");
    const settingsModal = document.getElementById("settings-modal");
    const closeButton = document.querySelector(".close-button");
    const saveProfilePictureButton = document.getElementById("save-profile-picture");
    const profilePictureUrlInput = document.getElementById("profile-picture-url");

    if (settingsButton) {
      settingsButton.addEventListener("click", function () {
        settingsModal.style.display = "flex";
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
            document.querySelector(".profile-picture").src = data.new_profile_picture_url;
            settingsModal.style.display = "none";
          } else {
            console.error("Error al actualizar la foto de perfil");
          }
        } catch (error) {
          console.error("Error en la petición:", error);
        }
      });
    }

    // Evento para cerrar sesión
    document.getElementById("logout").addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      window.location.href = "/";
    });

    // Función para obtener los últimos mensajes
    async function fetchLatestMessages() {
      try {
        const response = await fetch(`/conversation/${receiverUsername}?since=${lastMessageTimestamp.value}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${document.cookie.split('=')[1]}` // Añadir el token de autenticación en el encabezado
          }
        });
        if (response.ok) {
          const newMessages = await response.json();
          newMessages.forEach(message => {
            if (!displayedMessageIds.has(message.id)) {
              const messageElement = document.createElement("div");
              messageElement.classList.add(
                "message",
                message.sender_username === loggedInUser ? "received" : "sent",
                "p-2",
                "mb-2",
                "rounded"
              );
              messageElement.style.textAlign = message.sender_username === loggedInUser ? "left" : "right"; // Alinear a la izquierda si es el usuario
              messageElement.innerHTML = `<p><strong>${message.sender_username || "undefined"}</strong>: ${message.content}</p>`;
              chatMessages.appendChild(messageElement);

              // Registrar el mensaje en el Set
              displayedMessageIds.add(message.id);
              console.log(displayedMessageIds);

              // Actualizar el timestamp del último mensaje recibido
              lastMessageTimestamp.value = message.created_at;
            }
          });
        } else if (response.status === 401) {
          // Redirigir al usuario a la página de inicio de sesión si recibe un error 401
          alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
          localStorage.removeItem("loggedInUser");
          window.location.href = "/login.html";
        }
      } catch (error) {
        console.error("Error al obtener los últimos mensajes:", error);
      }
    }

    // Ejecutar fetchLatestMessages cada 5 segundos
    setInterval(fetchLatestMessages, 5000);

    const appearanceButton = document.getElementById("appearance-button");
    const appearanceDropdown = document.getElementById("appearance-dropdown");

    appearanceButton.addEventListener("click", function () {
      appearanceDropdown.classList.toggle("show");
    });
  });
