// frontend/js/teams.js
const teamForm = document.getElementById('teamForm');
const teamIdInput = document.getElementById('teamId');
const teamNameInput = document.getElementById('teamName');
const teamCoachInput = document.getElementById('teamCoach');
const cancelEditBtn = document.getElementById('cancelEdit');
const teamsTableBody = document.querySelector('#teamsTable tbody');

async function fetchTeams() {
  const res = await fetch('/api/teams');
  return res.json();
}

function renderTeams(list) {
  teamsTableBody.innerHTML = '';
  list.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.name}</td>
      <td>${t.coach || ''}</td>
      <td>
        <button data-id="${t.id}" class="btn edit">Editar</button>
        <button data-id="${t.id}" class="btn del">Eliminar</button>
      </td>`;
    teamsTableBody.appendChild(tr);
  });
}

async function load() {
  const teams = await fetchTeams();
  renderTeams(teams);
}

teamForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = teamIdInput.value;
  const name = teamNameInput.value.trim();
  const coach = teamCoachInput.value.trim();

  if (!name) return alert('Nombre requerido');

  if (id) {
    // update
    const res = await fetch(`/api/teams/${id}`, {
      method: 'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, coach })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');
    teamIdInput.value = '';
    cancelEditBtn.style.display = 'none';
  } else {
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, coach })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');
  }
  teamForm.reset();
  await load();
});

teamsTableBody.addEventListener('click', async (e) => {
  if (e.target.matches('.edit')) {
    const id = e.target.dataset.id;
    const teams = await fetchTeams();
    const t = teams.find(x => x.id === id);
    if (!t) return alert('No encontrado');
    teamIdInput.value = t.id;
    teamNameInput.value = t.name;
    teamCoachInput.value = t.coach || '';
    cancelEditBtn.style.display = 'inline';
  }
  if (e.target.matches('.del')) {
    if (!confirm('Eliminar equipo?')) return;
    const id = e.target.dataset.id;
    const res = await fetch(`/api/teams/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');
    await load();
  }
});

cancelEditBtn.addEventListener('click', () => {
  teamForm.reset();
  teamIdInput.value = '';
  cancelEditBtn.style.display = 'none';
});

load();
