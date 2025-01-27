document.addEventListener("DOMContentLoaded", function () {
  const chatInput = document.getElementById("chat-input");
  const sendMessageButton = document.getElementById("send-message");
  const chatMessages = document.getElementById("chat-messages");
  const receiverUsername = window.location.pathname.split("/").pop();
  const loggedInUser = localStorage.getItem("loggedInUser");
  const lastMessageTimestamp = document.getElementById("last-message-timestamp");

  const displayedMessageIds = new Set(); // Set para almacenar los IDs de los mensajes ya mostrados

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
      messageElement.innerHTML = `<p><strong>${message.sender_username}</strong>: ${message.content}</p>`;
      chatMessages.appendChild(messageElement);

      // Registrar el mensaje en el Set
      displayedMessageIds.add(message.id);

      // Actualizar el timestamp del último mensaje recibido
      lastMessageTimestamp.value = message.created_at;
    }
  };

  // Función para enviar un mensaje
  sendMessageButton.addEventListener("click", function () {
    const messageContent = chatInput.value;
    if (messageContent.trim() === "") return;

    // Enviar mensaje a través del WebSocket
    socket.send(JSON.stringify({
      sender: loggedInUser,
      content: messageContent
    }));

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "sent");
    messageElement.innerHTML = `<p><strong>${loggedInUser}</strong>: ${messageContent}</p>`;
    chatMessages.appendChild(messageElement);
    chatInput.value = "";

    // Actualizar el timestamp del último mensaje enviado
    lastMessageTimestamp.value = new Date().toISOString();
  });

  // Evento para cerrar sesión
  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  });

  // Cargar mensajes iniciales al cargar la página
  async function loadInitialMessages() {
    const response = await fetch(`/latest-conversation/${receiverUsername}`);
    if (response.ok) {
      const messages = await response.json();
      messages.forEach((message) => {
        if (!displayedMessageIds.has(message.id)) {
          // Agregar mensaje al contenedor solo si no ha sido mostrado antes
          const messageElement = document.createElement("div");
          messageElement.classList.add(
            "message",
            message.sender_username === loggedInUser ? "sent" : "received",
            message.status === "llegit" ? "read" : message.status === "rebut" ? "received" : "sent"
          );
          messageElement.innerHTML = `<p><strong>${message.sender_username}</strong>: ${message.content}</p>`;
          chatMessages.appendChild(messageElement);

          // Agregar el ID del mensaje al Set
          displayedMessageIds.add(message.id);
        }
      });

      // Actualizar el timestamp del último mensaje recibido
      if (messages.length > 0) {
        lastMessageTimestamp.value = messages[messages.length - 1].created_at;
      }
    } else {
      console.error("Error loading initial messages:", response.statusText);
    }
  }

  // Cargar mensajes iniciales al cargar la página
  loadInitialMessages();
});
