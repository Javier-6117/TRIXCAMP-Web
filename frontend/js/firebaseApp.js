// js/firebaseApp.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDE2bAcf6Iy6CR1ke7vU3P0L6pj87RFn4",
  authDomain: "futbol-f2dc2.firebaseapp.com",
  projectId: "futbol-f2dc2",
  storageBucket: "futbol-f2dc2.appspot.com",
  messagingSenderId: "641576093516",
  appId: "1:641576093516:web:c0a35f58184ff4c4ab71e9",
  measurementId: "G-7NXX18KWT9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
