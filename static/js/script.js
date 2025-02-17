


document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const p_users = document.getElementById("p-users");
  const p_chats =document.getElementById("p-chats");
  const p_login =document.getElementById("p-login");
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  const loginData = {
      username: username,
      password: password
  };

  const loginDataJSON = JSON.stringify(loginData);

  try {
      const response = await fetch("http://127.0.0.1:8000/login", {  // Cambiar la URL para apuntar al puerto 8000
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: loginDataJSON
      });

      const responsejson = await response.json();

      if (response.ok) {
          localStorage.setItem("loggedInUser", responsejson.username);
          hidden(p_users, p_chats, p_login);
        } else {
          errorMessage.textContent = responsejson.detail; // Mostrar mensaje de error
          errorMessage.classList.add("error-visible"); // Añadir clase para mostrar el mensaje de error
      }

  } catch (error) {
      console.error("Error en la petición:", error);
      errorMessage.textContent = "Error de conexión con el servidor.";
      errorMessage.classList.add("error-visible"); // Añadir clase para mostrar el mensaje de error
  }
});

/* funciones*/




/*** add event listeners */

/*LOGOUT*/
  // document.getElementById("logout").addEventListener("click", function () {
  //     localStorage.removeItem("loggedInUser");
  //     window.location.reload();
  // });
