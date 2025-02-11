document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();

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
          window.location.href = "http://127.0.0.1:8000/chat";  // Redirigir a otra página tras el login
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

// Verificar si el usuario ya está logueado
if (localStorage.getItem("loggedInUser")) {
  document.body.innerHTML = `
    <div class="welcome-container">
      <h1 class="welcome-title">Bienvenido, ${localStorage.getItem("loggedInUser")}!</h1>
      <p class="welcome-message">Ya has iniciado sesión.</p>
      <button id="go-to-chat" class="btn btn-primary">Ir al chat</button>
      <button id="logout" class="btn btn-secondary">Cerrar Sesión</button>
    </div>
  `;

  document.getElementById("logout").addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      window.location.reload();
  });

  document.getElementById("go-to-chat").addEventListener("click", function () {
      window.location.href = "http://127.0.0.1:8000/chat";
  });
}