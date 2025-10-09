import { auth } from './firebaseApp.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    registerMessage.style.color = 'green';
    registerMessage.textContent = 'Registro exitoso';
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
  } catch (err) {
    registerMessage.style.color = 'red';
    registerMessage.textContent = err.message;
  }
});
