document.addEventListener("DOMContentLoaded", async function () {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
      window.location.href = "http://127.0.0.1:8000/";
      return;
  }
  const chatUsername = document.getElementById("chat-username");
  const selectedUserProfilePicture = document.getElementById("selected-user-profile-picture");
  const userProfilePicture = document.getElementById("user-profile-picture");
  const chatMessages = document.getElementById("chat-messages");
  const lastMessageTimestamp = document.getElementById("last-message-timestamp");
  const userList = document.getElementById("users");
  const config = document.getElementById("config-logo");
  const atras = document.getElementById("atras");


  // Fetch user data

  try {
    console.log("pepo");

      const userResponse = await fetch('http://127.0.0.1:8000/users');
      console.log("userResponse", userResponse);

      if (!userResponse.ok) {
          throw new Error('Network response was not ok');
      }
      const userData = await userResponse.json();
      console.log("userData", userData);
      console.log(userData.users.user_profile_picture_url);
      console.log("Hola",userData.users.username);
      

      userData.users.forEach(user => {console.log(user.username);});

      userProfilePicture.src = userData.users.user_profile_picture_url;
  } catch (error) {
      console.error('Error fetching user data:', error);
  }

  // Fetch chat data
  try {
      const chatResponse = await fetch(`http://127.0.0.1:8000/api/get-chat-data?username=${loggedInUser}`);
      if (!chatResponse.ok) {
          throw new Error('Network response was not ok');
      }
      const chatData = await chatResponse.json();
      chatUsername.textContent = chatData.username;
      selectedUserProfilePicture.src = chatData.selected_user_profile_picture_url;
      lastMessageTimestamp.value = chatData.last_message_timestamp;

      // Load chat messages
      chatData.conversation.forEach(message => {
          const messageElement = document.createElement("div");
          messageElement.classList.add("message", message.sender_username === loggedInUser ? "received" : "sent", "p-2", "mb-2", "rounded");
          messageElement.innerHTML = `<p><strong>${message.sender_username}</strong>: ${message.content}</p>`;
          chatMessages.appendChild(messageElement);
      });
  } catch (error) {
      console.error('Error fetching chat data:', error);
  }

  // Fetch users data
  try {
      const usersResponse = await fetch('http://127.0.0.1:8000/api/get-users');
      if (!usersResponse.ok) {
          throw new Error('Network response was not ok');
      }
      const usersData = await usersResponse.json();

      // Load users list
      usersData.forEach(user => {
          const li = document.createElement("li");
          li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");
          li.innerHTML = `
              <img src="${user.user_profile_picture_url || '/static/default-profile.png'}" alt="Foto de perfil" class="profile-picture rounded-circle mr-2">
              <div class="user-info">
                  <span class="user-name">${user.username}</span>
                  <span class="user-status">${user.status || 'No hay mensajes'}</span>
              </div>
          `;
          li.addEventListener("click", function () {
              window.location.href = `http://127.0.0.1:8000/chat/${user.username}`;
          });
          userList.appendChild(li);
      });
  } catch (error) {
      console.error('Error fetching users data:', error);
  }
  config.addEventListener("click", function () {
    window.location.href = `/configuracion`;})

  // Event listeners for buttons
  atras.addEventListener("click", function () {
    window.location.href = "http://127.0.0.1:8000/users_page";
});
  document.getElementById("go-to-chat").addEventListener("click", function () {
      window.location.href = "http://127.0.0.1:8000/chat";
  });

  document.getElementById("go-to-settings").addEventListener("click", function () {
      window.location.href = "http://127.0.0.1:8000/settings";
  });

  document.getElementById("go-to-profile").addEventListener("click", function () {
      window.location.href = "http://127.0.0.1:8000/perfil.html";
  });

  document.getElementById("create-group").addEventListener("click", function () {
      window.location.href = "http://127.0.0.1:8000/newGroup";
  });

  document.getElementById("logout").addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      window.location.href = "http://127.0.0.1:8000/";
  });

  // Appearance dropdown
  document.getElementById("appearance-button").addEventListener("click", function () {
      document.getElementById("appearance-dropdown").classList.toggle("show");
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

  // Fetch latest messages every 5 seconds
//   setInterval(async function () {
//       try {
//           const response = await fetch(`http://127.0.0.1:8000/api/get-latest-messages?since=${lastMessageTimestamp.value}`);
//           if (!response.ok) {
//               throw new Error('Network response was not ok');
//           }
//           const newMessages = await response.json();
//           newMessages.forEach(message => {
//               const messageElement = document.createElement("div");
//               messageElement.classList.add("message", message.sender_username === loggedInUser ? "received" : "sent", "p-2", "mb-2", "rounded");
//               messageElement.innerHTML = `<p><strong>${message.sender_username}</strong>: ${message.content}</p>`;
//               chatMessages.appendChild(messageElement);
//               lastMessageTimestamp.value = message.created_at;
//           });
//       } catch (error) {
//           console.error('Error fetching latest messages:', error);
//       }
//   }, 5000);
});
