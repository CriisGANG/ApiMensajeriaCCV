document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    const chatInput = document.getElementById("chat-input");
    const sendMessageButtonGroup = document.getElementById("send-message-group");
    const chatMessages = document.getElementById("chat-messages-group");
    const receiverUsername = window.location.pathname.split("/").pop();
    const loggedInUser = localStorage.getItem("loggedInUser");
    const manageMembers = document.getElementById("gestionar");
    const groupId = window.location.pathname.split("/").pop();

    // console.log("Elements:", { chatInput, sendMessageButtonGroup, chatMessages, receiverUsername, loggedInUser });

    sendMessageButtonGroup.addEventListener("click", async function () {
        const messageContent = chatInput.value;
        if (messageContent.trim() === "") return;

        // console.log("Sending message:", messageContent);

        const response = await fetch("/send-message-group", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ receiver_username: receiverUsername, content: messageContent })
        });

        // console.log("Response status:", response.status);

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

    document.getElementById("leave").addEventListener("click", async function () {
        const groupId = window.location.pathname.split("/").pop();
        const response = await fetch("/leaveGroup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ group_id: groupId })
        });

        if (response.ok) {
            window.location.href = "/users";
        } else {
            console.error("Error leaving group:", response.statusText);
        }
    });
    manageMembers.addEventListener("click", function() {
        window.location.href = `/manageMembers/${groupId}`;
    });

    const appearanceButton = document.getElementById("appearance-button");
    const appearanceDropdown = document.getElementById("appearance-dropdown");
    const bgModal = document.getElementById("bg-modal");
    const closeButton = document.querySelector(".close-button");
    const saveBgPictureButton = document.getElementById("save-bg-picture");
    const bgPictureUrlInput = document.getElementById("bg-picture-url");

    if (appearanceButton) {
        appearanceButton.addEventListener("click", function () {
            appearanceDropdown.classList.toggle("show");
        });
    }

    if (document.getElementById("dark-mode")) {
        document.getElementById("dark-mode").addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
        });
    }

    if (document.getElementById("high-contrast")) {
        document.getElementById("high-contrast").addEventListener("click", function () {
            document.body.classList.toggle("high-contrast");
        });
    }

    if (document.getElementById("change-bg")) {
        document.getElementById("change-bg").addEventListener("click", function () {
            bgModal.style.display = "block";
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            bgModal.style.display = "none";
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target === bgModal) {
            bgModal.style.display = "none";
        }
    });

    if (saveBgPictureButton) {
        saveBgPictureButton.addEventListener("click", async function () {
            const bgPictureUrl = bgPictureUrlInput.value;
            if (!bgPictureUrl) return;

            try {
                const response = await fetch("/update-bg-picture", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bg_picture_url: bgPictureUrl })
                });

                if (response.ok) {
                    alert("Imagen de fondo actualizada exitosamente.");
                    bgModal.style.display = "none";
                    location.reload();
                } else {
                    console.error("Error al actualizar la imagen de fondo");
                }
            } catch (error) {
                console.error("Error en la petición:", error);
            }
        });
    }
});