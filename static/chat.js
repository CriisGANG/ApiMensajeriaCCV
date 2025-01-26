document.addEventListener("DOMContentLoaded", function () {
  const chatInput = document.getElementById("chat-input");
  const sendMessageButton = document.getElementById("send-message");
  const sendMessageButtonGroup = document.getElementById("send-message-group");
  const chatMessages = document.getElementById("chat-messages");
  const receiverUsername = window.location.pathname.split("/").pop();
  const loggedInUser = localStorage.getItem("loggedInUser");

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

  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  });
});
