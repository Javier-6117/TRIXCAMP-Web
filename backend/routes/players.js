// backend/routes/players.js
import express from 'express';
import { dbAdmin as db } from '../firebaseAdmin.js';


const router = express.Router();
const playersCol = db.collection('players');
const teamsCol = db.collection('teams');

// CREATE player (teamId required)
router.post('/', async (req, res) => {
  try {
    const { name, position, age, teamId } = req.body;
    if (!name || !position || !age || !teamId) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const teamSnap = await teamsCol.doc(teamId).get();
    if (!teamSnap.exists) return res.status(400).json({ message: 'Equipo no existe' });

    const teamData = { id: teamSnap.id, name: teamSnap.data().name };
    const ref = await playersCol.add({
      name,
      position,
      age,
      team: teamData,
      createdAt: new Date()
    });
    res.status(201).json({ id: ref.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creando jugador' });
  }
});

// READ all players (include team name)
router.get('/', async (req, res) => {
  try {
    const snap = await playersCol.get();
    const players = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo jugadores' });
  }
});

// UPDATE player
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, age, teamId } = req.body;
    if (!name || !position || !age || !teamId) return res.status(400).json({ message: 'Campos incompletos' });

    const teamSnap = await teamsCol.doc(teamId).get();
    if (!teamSnap.exists) return res.status(400).json({ message: 'Equipo no existe' });

    const teamData = { id: teamSnap.id, name: teamSnap.data().name };

    await playersCol.doc(id).update({ name, position, age, team: teamData });
    res.json({ message: 'Jugador actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error actualizando jugador' });
  }
});

// DELETE player
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await playersCol.doc(id).delete();
    res.json({ message: 'Jugador eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error eliminando jugador' });
  }
});

export default router;
