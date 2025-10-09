import { auth } from './firebaseApp.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    loginMessage.style.color = 'green';
    loginMessage.textContent = 'Login exitoso';
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
  } catch (err) {
    loginMessage.style.color = 'red';
    loginMessage.textContent = 'Usuario o contraseña incorrectos';
  }
});
