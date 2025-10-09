// backend/routes/trainings.js
import express from 'express';
import { dbAdmin as db } from '../firebaseAdmin.js';


const router = express.Router();
const trainingsCol = db.collection('trainings');
const teamsCol = db.collection('teams');
const fieldsCol = db.collection('fields');

// Helper: check conflict (misma fecha/hora exacta y mismo campo)
async function hasConflict(fieldId, datetimeISO) {
  const q = await trainingsCol
    .where('field.id', '==', fieldId)
    .where('datetime', '==', datetimeISO)
    .get();
  return !q.empty;
}

// CREATE training (checks)
router.post('/', async (req, res) => {
  try {
    const { teamId, fieldId, datetimeISO } = req.body;
    if (!teamId || !fieldId || !datetimeISO) {
      return res.status(400).json({ message: 'Campos requeridos: teamId, fieldId, datetimeISO' });
    }

    // Validate team and field exist
    const [teamSnap, fieldSnap] = await Promise.all([teamsCol.doc(teamId).get(), fieldsCol.doc(fieldId).get()]);
    if (!teamSnap.exists) return res.status(400).json({ message: 'Equipo no existe' });
    if (!fieldSnap.exists) return res.status(400).json({ message: 'Campo no existe' });

    // Conflicto: mismo campo y misma datetimeISO
    const conflict = await hasConflict(fieldId, datetimeISO);
    if (conflict) return res.status(400).json({ message: 'Conflicto: otro equipo ya reservó ese campo a esa hora' });

    const team = { id: teamSnap.id, name: teamSnap.data().name };
    const field = { id: fieldSnap.id, name: fieldSnap.data().name };

    const ref = await trainingsCol.add({
      team,
      field,
      datetime: datetimeISO,
      createdAt: new Date()
    });
    res.status(201).json({ id: ref.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error agendando entrenamiento' });
  }
});

// READ trainings
router.get('/', async (req, res) => {
  try {
    const snap = await trainingsCol.get();
    const trainings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(trainings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo entrenamientos' });
  }
});

// UPDATE training (permitir cambiar hora/equipo/campo; validar conflictos)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, fieldId, datetimeISO } = req.body;
    if (!teamId || !fieldId || !datetimeISO) return res.status(400).json({ message: 'Campos incompletos' });

    const [teamSnap, fieldSnap] = await Promise.all([teamsCol.doc(teamId).get(), fieldsCol.doc(fieldId).get()]);
    if (!teamSnap.exists) return res.status(400).json({ message: 'Equipo no existe' });
    if (!fieldSnap.exists) return res.status(400).json({ message: 'Campo no existe' });

    // Conflicto: otro doc distinto al actual con mismo field & datetime
    const q = await trainingsCol
      .where('field.id', '==', fieldId)
      .where('datetime', '==', datetimeISO)
      .get();

    const conflict = q.docs.find(d => d.id !== id);
    if (conflict) return res.status(400).json({ message: 'Conflicto de horario en ese campo' });

    const team = { id: teamSnap.id, name: teamSnap.data().name };
    const field = { id: fieldSnap.id, name: fieldSnap.data().name };

    await trainingsCol.doc(id).update({ team, field, datetime: datetimeISO });
    res.json({ message: 'Entrenamiento actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error actualizando entrenamiento' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await trainingsCol.doc(id).delete();
    res.json({ message: 'Entrenamiento eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error eliminando entrenamiento' });
  }
});

export default router;
