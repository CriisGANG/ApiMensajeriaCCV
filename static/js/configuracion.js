import { getUser } from "./httpFetch.js";
import { show } from "./viewController.js";

function initProfile() {
    const user = getUser();
    //console.log(user);
}

const btnImg = document.getElementById('perfil-logo');
btnImg.addEventListener('click', function () {
    alert("a");
    //console.log("Estoy mostrando profile!");
    show("profile");
});

export { initProfile }