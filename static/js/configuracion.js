import { getUser } from "./httpFetch.js";
import { show } from "./viewController.js";

function initProfile() {
    const user = getUser();
    console.log(user);
}

const btnImg = document.getElementById('perfil-logo');
btnImg.addEventListener('click', function () {
    alert("a");
    console.log("Estoy mostrando profile!");
    show("profile");
});
// const profileImg = document.querySelector('.profile-img');
// fetch('/api/get-profile-picture-url')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         if (data.profile_picture_url) {
//             profileImg.src = data.profile_picture_url;
//         } else {
//             console.error('No profile picture URL found');
//         }
//     })
//     .catch(error => console.error('Error fetching profile picture URL:', error));

export { initProfile }