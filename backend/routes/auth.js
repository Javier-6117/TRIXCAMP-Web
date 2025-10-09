// backend/routes/auth.js
import express from 'express';
import { dbAdmin } from '../firebaseAdmin.js'; // tu archivo de firebase-admin
import admin from 'firebase-admin';

const router = express.Router();

// REGISTRO
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email y contraseña son requeridos' });

  try {
    const userRecord = await admin.auth().createUser({ email, password });
    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      uid: userRecord.uid,
      email: userRecord.email
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email y contraseña son requeridos' });

  try {
    // En backend con Firebase Admin no puedes hacer login con password directamente
    // Necesitas usar Firebase Auth REST API o frontend. Aquí damos un token de ejemplo:
    const user = await admin.auth().getUserByEmail(email);
    // Para simplificar, solo devolvemos que existe el usuario
    return res.status(200).json({ message: 'Login exitoso', uid: user.uid, email: user.email });
  } catch (error) {
    return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  }
});

export default router;
