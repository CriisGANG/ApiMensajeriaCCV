document.addEventListener("DOMContentLoaded", function () {
  const chatInput = document.getElementById("chat-input");
  const sendMessageButton = document.getElementById("send-message");
  const chatMessages = document.getElementById("chat-messages");
  const receiverUsername = window.location.pathname.split("/").pop();
  const loggedInUser = localStorage.getItem("loggedInUser");
  const lastMessageTimestamp = document.getElementById("last-message-timestamp");

  sendMessageButton.addEventListener("click", async function () {
    const messageContent = chatInput.value;
    if (messageContent.trim() === "") return;

    const response = await fetch("/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiver_username: receiverUsername, content: messageContent })
    });

    if (response.ok) {
      const message = await response.json();
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", "sent");
      messageElement.innerHTML = `<p><strong>${loggedInUser}</strong>: ${messageContent}</p>`;
      chatMessages.appendChild(messageElement);
      chatInput.value = "";
    } else {
      console.error("Error sending message:", response.statusText);
    }
  });

  async function fetchNewMessages() {
    const response = await fetch(`/latest-conversation/${receiverUsername}?since=${lastMessageTimestamp.value}`);
    if (response.ok) {
      const newMessages = await response.json();
      if (newMessages.length > 0) {
        newMessages.forEach(message => {
          const messageElement = document.createElement("div");
          messageElement.classList.add("message", message.sender_username === loggedInUser ? "sent" : "received", message.status === 'llegit' ? 'read' : message.status === 'rebut' ? 'received' : 'sent');
          messageElement.innerHTML = `<p><strong>${message.sender_username}</strong>: ${message.content}</p>`;
          chatMessages.appendChild(messageElement);
        });
        lastMessageTimestamp.value = newMessages[newMessages.length - 1].created_at;
      }
    } else {
      console.error("Error fetching new messages:", response.statusText);
    }
  }

  setInterval(fetchNewMessages, 2000);

  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  });

  // Initial fetch to load messages when the page loads
  fetchNewMessages();
});
