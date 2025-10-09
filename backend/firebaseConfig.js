// backend/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCDE2bAcf6Iy6CR1ke7vU3P0L6pj87RFn4",
  authDomain: "futbol-f2dc2.firebaseapp.com",
  projectId: "futbol-f2dc2",
  storageBucket: "futbol-f2dc2.firebasestorage.app",
  messagingSenderId: "641576093516",
  appId: "1:641576093516:web:c0a35f58184ff4c4ab71e9",
  measurementId: "G-7NXX18KWT9"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta correctamente auth y db
export const auth = getAuth(app);
export const db = getFirestore(app);
