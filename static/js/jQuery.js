//Ready caller
$(function() {
    ////console.log("JQuery");
    // Verificar si ya está activado el mo
    // do oscuro en localStorage
    if (localStorage.getItem("dark-mode") === "enabled") {
        $("body").addClass("dark-mode");
    }

    $("#toggle-dark-mode").on("click", function() {
        ////console.log("JQuery");
        
        $("body").toggleClass("dark-mode");
    
        // Guardar la preferencia en localStorage
        if ($("body").hasClass("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
        } else {
            localStorage.setItem("dark-mode", "disabled");
        }
    });
});   
     

