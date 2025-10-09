// backend/firebaseAdmin.js
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';

// Para obtener la ruta absoluta del JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = path.join(__dirname, 'firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const dbAdmin = admin.firestore();
