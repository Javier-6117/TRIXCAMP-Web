// backend/server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import teamsRoutes from './routes/teams.js';
import playersRoutes from './routes/players.js';
import fieldsRoutes from './routes/fields.js';
import trainingsRoutes from './routes/trainings.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));

// Rutas API
app.use('/api/teams', teamsRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/fields', fieldsRoutes);
app.use('/api/trainings', trainingsRoutes);

app.get('/test', (req, res) => res.send('Servidor funcionando 🔥'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
