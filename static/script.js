document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  console.log("Dentro del login");

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  // 📌 Verifica si se están obteniendo correctamente los valores del formulario
  console.log("Username:", username);
  console.log("Password:", password);

  // Crear objeto con los datos del usuario
  const loginData = {
      username: username,
      password: password
  };

  // 📌 Verifica el objeto antes de enviarlo
  console.log("Datos a enviar:", loginData);

  // Convertir el objeto a JSON
  const loginDataJSON = JSON.stringify(loginData);
  console.log("JSON enviado:", loginDataJSON); // para ver que el JSON está bien formado

  try {
      // Enviar los datos al backend en formato JSON
      const response = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: loginDataJSON
      });

      // 📌 Verifica el estado de la respuesta
      console.log("Estado de la respuesta:", response.status);
      console.log("Redirección:", response.redirected);
      console.log("Respuesta OK:", response.ok);

      // Intentar leer la respuesta en JSON
      const responsejson = await response.json();
      console.log("Respuesta del servidor JSON:", responsejson);

      // 📌 Mueve la validación dentro del try
      if (response.ok) {
          alert(`Inicio de sesión exitoso. Bienvenido, ${responsejson.username}!`);
          localStorage.setItem("loggedInUser", responsejson.username);
          // No es necesario establecer manualmente la cookie HttpOnly desde el cliente
          window.location.href = "/users";  // Redirigir a otra página tras el login
      } else {
          errorMessage.textContent = responsejson.detail; // Mostrar mensaje de error
      }

  } catch (error) {
      // 📌 Captura cualquier error en la petición fetch()
      console.error("Error en la petición:", error);
      errorMessage.textContent = "Error de conexión con el servidor.";
  }
});

// Verificar si el usuario ya está logueado
if (localStorage.getItem("loggedInUser")) {
  document.body.innerHTML = `
    <h1>Bienvenido, ${localStorage.getItem("loggedInUser")}!</h1>
    <button id="logout">Cerrar Sesión</button>
  `;

  document.getElementById("logout").addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      window.location.reload();
  });
}

// // Verificar si hay token
// if (!localStorage.getItem("token")) { // Creo que este token es el nombre que tiene en el JSON (?).
//     window.location.href = "login.html";
// }

// Lo que hará el código si está logeado.
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html"
})