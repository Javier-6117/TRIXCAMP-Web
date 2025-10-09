// frontend/js/trainings.js
const trainingForm = document.getElementById('trainingForm');
const trainingIdInput = document.getElementById('trainingId');
const trainingTeamSelect = document.getElementById('trainingTeam');
const trainingFieldSelect = document.getElementById('trainingField');
const trainingDatetimeInput = document.getElementById('trainingDatetime');
const trainingsTableBody = document.querySelector('#trainingsTable tbody');
const cancelEditBtn = document.getElementById('cancelEdit');

async function fetchTeams() {
  const res = await fetch('/api/teams');
  return res.json();
}
async function fetchFields() {
  const res = await fetch('/api/fields');
  return res.json();
}
async function fetchTrainings() {
  const res = await fetch('/api/trainings');
  return res.json();
}

async function loadSelects() {
  const [teams, fields] = await Promise.all([fetchTeams(), fetchFields()]);
  trainingTeamSelect.innerHTML = '<option value="">-- Selecciona equipo --</option>';
  teams.forEach(t => trainingTeamSelect.append(new Option(t.name, t.id)));
  trainingFieldSelect.innerHTML = '<option value="">-- Selecciona campo --</option>';
  fields.forEach(f => trainingFieldSelect.append(new Option(f.name, f.id)));
}

function renderTrainings(list) {
  trainingsTableBody.innerHTML = '';
  list.forEach(tr => {
    const trElem = document.createElement('tr');
    const dt = new Date(tr.datetime);
    trElem.innerHTML = `
      <td>${tr.team?.name || ''}</td>
      <td>${tr.field?.name || ''}</td>
      <td>${dt.toLocaleString()}</td>
      <td>
        <button data-id="${tr.id}" class="btn edit">Editar</button>
        <button data-id="${tr.id}" class="btn del">Eliminar</button>
      </td>`;
    trainingsTableBody.appendChild(trElem);
  });
}

async function load() {
  await loadSelects();
  const trainings = await fetchTrainings();
  renderTrainings(trainings);
}

trainingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = trainingIdInput.value;
  const teamId = trainingTeamSelect.value;
  const fieldId = trainingFieldSelect.value;
  const dt = trainingDatetimeInput.value; // local datetime-local -> string like "2025-10-06T15:30"
  if (!teamId || !fieldId || !dt) return alert('Todos los campos son requeridos');

  // Convert to ISO for storage (preserve exact string)
  const datetimeISO = new Date(dt).toISOString();

  if (id) {
    const res = await fetch(`/api/trainings/${id}`, {
      method: 'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ teamId, fieldId, datetimeISO })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');
  } else {
    const res = await fetch('/api/trainings', {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ teamId, fieldId, datetimeISO })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');
  }
  trainingForm.reset();
  trainingIdInput.value = '';
  cancelEditBtn.style.display = 'none';
  await load();
});

trainingsTableBody.addEventListener('click', async (e) => {
  if (e.target.matches('.edit')) {
    const id = e.target.dataset.id;
    const trainings = await fetchTrainings();
    const t = trainings.find(x => x.id === id);
    if (!t) return alert('No encontrado');
    trainingIdInput.value = t.id;
    await loadSelects();
    if (t.team?.id) trainingTeamSelect.value = t.team.id;
    if (t.field?.id) trainingFieldSelect.value = t.field.id;
    // Convert stored ISO back to local datetime-local format
    const local = new Date(t.datetime);
    const tzOffset = local.getTimezoneOffset() * 60000;
    const localISO = new Date(local - tzOffset).toISOString().slice(0,16);
    trainingDatetimeInput.value = localISO;
    cancelEditBtn.style.display = 'inline';
  }
  if (e.target.matches('.del')) {
    if (!confirm('Eliminar entrenamiento?')) return;
    const id = e.target.dataset.id;
    const res = await fetch(`/api/trainings/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');
    await load();
  }
});

cancelEditBtn.addEventListener('click', () => {
  trainingForm.reset();
  trainingIdInput.value = '';
  cancelEditBtn.style.display = 'none';
});

load();
