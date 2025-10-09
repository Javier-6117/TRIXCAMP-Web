// backend/routes/teams.js
import express from 'express';
import { dbAdmin as db } from '../firebaseAdmin.js';

const router = express.Router();
const teamsCol = db.collection('teams');

// CREATE
router.post('/', async (req, res) => {
  try {
    const { name, coach } = req.body;
    if (!name) return res.status(400).json({ message: 'Nombre requerido' });

    // Checar unicidad por nombre
    const q = await teamsCol.where('name', '==', name).get();
    if (!q.empty) return res.status(400).json({ message: 'Equipo ya existe' });

    const ref = await teamsCol.add({ name, coach: coach || '', createdAt: new Date() });
    res.status(201).json({ id: ref.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creando equipo' });
  }
});

// READ all
router.get('/', async (req, res) => {
  try {
    const snap = await teamsCol.get();
    const teams = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo equipos' });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, coach } = req.body;
    if (!name) return res.status(400).json({ message: 'Nombre requerido' });

    // Verificar que no exista otro equipo con ese nombre (diferente id)
    const q = await teamsCol.where('name', '==', name).get();
    const conflict = q.docs.find(d => d.id !== id);
    if (conflict) return res.status(400).json({ message: 'Otro equipo ya usa ese nombre' });

    await teamsCol.doc(id).update({ name, coach });
    res.json({ message: 'Equipo actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error actualizando equipo' });
  }
});

// DELETE (evita borrar si hay jugadores asignados)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Check players
    const playersQuery = await db.collection('players').where('team.id', '==', id).limit(1).get();
    if (!playersQuery.empty) {
      return res.status(400).json({ message: 'No se puede eliminar: hay jugadores asociados' });
    }
    await teamsCol.doc(id).delete();
    res.json({ message: 'Equipo eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error eliminando equipo' });
  }
});

export default router;
