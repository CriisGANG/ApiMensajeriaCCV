document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message");
  
    // Validar nombre de usuario (sin @)
    if (username.includes("@")) {
      errorMessage.textContent = "El nombre de usuario no debe contener el símbolo '@'.";
      return;
    }
  
    // Validar contraseña (DNI o NIE)
    const dniRegex = /^\d{8}$/; // Exactamente 8 dígitos
    const nieRegex = /^[A-Z]\d{7}[A-Z]?$/; // Letra inicial, 7 dígitos, letra final opcional
  
    if (!dniRegex.test(password) && !nieRegex.test(password)) {
      errorMessage.textContent = "La contraseña debe ser un DNI (8 dígitos) o un NIE válido (letra inicial + 7 dígitos + letra opcional).";
      return;
    }
  
    // Simular inicio de sesión exitoso
    localStorage.setItem("loggedInUser", username); // Guardar la sesión
    alert("Inicio de sesión exitoso. Bienvenido, " + username + "!");
    window.location.reload(); // Recargar la página o redirigir
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
