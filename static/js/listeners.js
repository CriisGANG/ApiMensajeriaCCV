import { login } from "./httpFetch.js";
import { show } from "./viewController.js";

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    await login(username, password);
    show("chats")
    


  });