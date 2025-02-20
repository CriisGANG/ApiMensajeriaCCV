


async function pintarUsuariosYGruposChat(idUser, idElementHTML, pintarMensajes) {
    const userList = document.getElementById(idElementHTML);
  
    // Limpiar la lista antes de agregar nuevos elementos
    userList.innerHTML = "";
  
    // Obtener conversaciones de usuarios y grupos
    const conversaciones = await conversacionesUserId(); // Aquí ya tienes toda la info
  
    //console.log("Conversaciones obtenidas:", conversaciones);
  
    if(conversaciones.interaction_type === "user"){

        conversaciones.forEach(conversacion => {
            // Crear el <li>
            const li = document.createElement("li");
            li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");
        
            // Crear la imagen (usuario)
            const img = document.createElement("img");
            img.setAttribute("src", conversacion.user_profile_picture_url || "/static/img/default-profile.png");
            img.setAttribute("alt", conversacion.interaction_type === "user" ? "Foto de perfil" : "Icono de grupo");
            img.classList.add("profile-picture", "rounded-circle", "mr-2");
        
            // Crear el div que contiene la info del usuario/grupo
            const userInfo = document.createElement("div");
            userInfo.classList.add("user-info");
        
            // Nombre del usuario o grupo
            const userName = document.createElement("span");
            userName.classList.add("user-name");
            userName.textContent = conversacion.username || conversacion.name;
        
            // Estado (último mensaje)
            const userStatus = document.createElement("span");
            userStatus.classList.add("user-status");
            userStatus.textContent = conversacion.last_message_content;
        
            // Agregar elementos al div de info
            userInfo.append(userName, userStatus);
            li.append(img, userInfo);conversaciones.forEach(conversacion => {
                // Crear el <li>
                const li = document.createElement("li");
                li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");
            
                // Crear la imagen (usuario o grupo)
                const img = document.createElement("img");
                img.setAttribute("src", conversacion.user_profile_picture_url || "https://img.freepik.com/foto-gratis/hombre-tomando-foto-el-sus-amigos-parque_1139-591.jpg");
                img.setAttribute("alt", conversacion.interaction_type === "user" ? "Foto de perfil" : "Icono de grupo");
                img.classList.add("profile-picture", "rounded-circle", "mr-2");
            
                // Crear el div que contiene la info del usuario/grupo
                const userInfo = document.createElement("div");
                userInfo.classList.add("user-info");
            
                // Nombre del usuario o grupo
                const userName = document.createElement("span");
                userName.classList.add("user-name");
                userName.textContent = conversacion.username || conversacion.name;
            
                // Estado (último mensaje)
                const userStatus = document.createElement("span");
                userStatus.classList.add("user-status");
                userStatus.textContent = conversacion.last_message_content;
            
                // Agregar elementos al div de info
                userInfo.append(userName, userStatus);
                li.append(img, userInfo);
            })
        })
    }
    conversaciones.forEach(conversacion => {
      // Crear el <li>
      const li = document.createElement("li");
      li.classList.add("list-group-item", "user-item", "d-flex", "align-items-center");
  
      // Crear la imagen (usuario o grupo)
      const img = document.createElement("img");
      img.setAttribute("src", conversacion.user_profile_picture_url || "https://img.freepik.com/foto-gratis/hombre-tomando-foto-el-sus-amigos-parque_1139-591.jpg");
      img.setAttribute("alt", conversacion.interaction_type === "user" ? "Foto de perfil" : "Icono de grupo");
      img.classList.add("profile-picture", "rounded-circle", "mr-2");
  
      // Crear el div que contiene la info del usuario/grupo
      const userInfo = document.createElement("div");
      userInfo.classList.add("user-info");
  
      // Nombre del usuario o grupo
      const userName = document.createElement("span");
      userName.classList.add("user-name");
      userName.textContent = conversacion.username || conversacion.name;
  
      // Estado (último mensaje)
      const userStatus = document.createElement("span");
      userStatus.classList.add("user-status");
      userStatus.textContent = conversacion.last_message_content;
  
      // Agregar elementos al div de info
      userInfo.append(userName, userStatus);
      li.append(img, userInfo);
  
      // **Evento Click** para usuarios y grupos
      li.addEventListener("click", function () {
        if (conversacion.interaction_type === "user") {
          //console.log("Usuario pulsado!", conversacion.interaction_id);
          pintarMensajes(conversacion.interaction_id, conversacion.last_interaction);
        } else {
          //console.log("Grupo pulsado!", conversacion.interaction_id);
          window.location.href = `/chatsGrupos/${conversacion.interaction_id}`;
        }
      });
  
      // Agregar el <li> al contenedor principal
      userList.appendChild(li);
    });
  
    // Evento para el logout
    document.getElementById("logout").addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      window.location.href = "/";
    });
  }