document.addEventListener("DOMContentLoaded", function () {
  const chatInput = document.getElementById("chat-input");
  const sendMessageButton = document.getElementById("send-message");
  const sendMessageButtonGroup = document.getElementById("send-message-group");
  const chatMessages = document.getElementById("chat-messages");
  const receiverUsername = window.location.pathname.split("/").pop();
  const loggedInUser = localStorage.getItem("loggedInUser");
  const lastMessageTimestamp = document.getElementById("last-message-timestamp");
  const users = JSON.parse(document.getElementById("users-data").textContent);
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
  // sendMessageButton.addEventListener("click", async function () {
  //   const messageContent = chatInput.value;
  //   if (messageContent.trim() === "") return; // trim()elimina espacios en blanco del string

  //   // Enviar mensaje a través del WebSocket
  //   const messageId = Date.now(); // Generar un ID temporal para el mensaje
  //   socket.send(JSON.stringify({
  //     id: messageId,
  //     sender: loggedInUser,
  //     content: messageContent
  //   }));

  //   // Enviar mensaje a través de fetch
  //   await fetch('/send-message', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       receiver_username: receiverUsername,
  //       content: messageContent
  //     })
  //   });
 
  //    // Verificar si el mensaje ya fue mostrado
  //    if (displayedMessageIds.has(messageId)) {
  //     return; // No agregar mensaje duplicado
  // }

  //   const messageElement = document.createElement("div");
  //   messageElement.classList.add("message", "sent");
  //   //console.log(messageElement)
  //   messageElement.innerHTML = `<p><strong>${loggedInUser}</strong>: ${messageContent}</p>`;
  //   chatMessages.appendChild(messageElement);
  //   chatInput.value = "";

  //   // Registrar el mensaje en el Set
  //   displayedMessageIds.add(messageId);

  //   // Actualizar el timestamp del último mensaje enviado
  //   lastMessageTimestamp.value = new Date().toISOString();
  // });
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


  // Evento para cerrar sesión
  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  });


  // Ejecutar fetchLatestMessages cada 5 segundos
  setInterval(fetchLatestMessages, 5000);
});
