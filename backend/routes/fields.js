// backend/routes/fields.js
import express from 'express';
import { dbAdmin as db } from '../firebaseAdmin.js';


const router = express.Router();
const fieldsCol = db.collection('fields');

// Helper: calcular humedad si llueve
function calcHumidity(baseHumidity, isRaining) {
  if (!baseHumidity && baseHumidity !== 0) baseHumidity = 50;
  let hum = Number(baseHumidity);
  if (isRaining) hum = Math.min(100, hum + 20); // +20 si llueve
  return Math.round(hum);
}

// CREATE
router.post('/', async (req, res) => {
  try {
    const { name, temperature, humidity, isRaining } = req.body;
  } catch (err) {
    // unused - placeholder
  }

  try {
    const { name, temperature = 25, humidity = 50, isRaining = false } = req.body;
    if (!name) return res.status(400).json({ message: 'Nombre requerido' });

    const h = calcHumidity(humidity, isRaining);
    const ref = await fieldsCol.add({
      name,
      temperature: Number(temperature),
      humidity: h,
      isRaining: Boolean(isRaining),
      createdAt: new Date()
    });
    res.status(201).json({ id: ref.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creando campo' });
  }
});

// READ
router.get('/', async (req, res) => {
  try {
    const snap = await fieldsCol.get();
    const fields = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo campos' });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, temperature = 25, humidity = 50, isRaining = false } = req.body;
    if (!name) return res.status(400).json({ message: 'Nombre requerido' });

    const h = calcHumidity(humidity, isRaining);
    await fieldsCol.doc(id).update({
      name,
      temperature: Number(temperature),
      humidity: h,
      isRaining: Boolean(isRaining)
    });
    res.json({ message: 'Campo actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error actualizando campo' });
  }
});

// DELETE (verificar que no haya entrenamientos asociados)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const trainingsQuery = await db.collection('trainings').where('field.id', '==', id).limit(1).get();
    if (!trainingsQuery.empty) {
      return res.status(400).json({ message: 'No se puede eliminar: hay entrenamientos en este campo' });
    }
    await fieldsCol.doc(id).delete();
    res.json({ message: 'Campo eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error eliminando campo' });
  }
});

export default router;
