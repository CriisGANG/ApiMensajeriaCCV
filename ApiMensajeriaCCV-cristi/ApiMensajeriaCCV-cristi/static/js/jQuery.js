$(document).ready(function(){
    // Verificar si ya está activado el modo oscuro en localStorage
    if (localStorage.getItem("dark-mode") === "enabled") {
        $("body").addClass("dark-mode");
    }

    $("#toggle-dark-mode").click(function() {
        $("body").toggleClass("dark-mode");
    
        // Guardar la preferencia en localStorage
        if ($("body").hasClass("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
        } else {
            localStorage.setItem("dark-mode", "disabled");
        }
    });
        
      });
