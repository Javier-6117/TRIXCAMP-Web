// frontend/js/players.js
const playerForm = document.getElementById('playerForm');
const playerIdInput = document.getElementById('playerId');
const playerNameInput = document.getElementById('playerName');
const playerPositionInput = document.getElementById('playerPosition');
const playerAgeInput = document.getElementById('playerAge');
const playerTeamSelect = document.getElementById('playerTeamSelect');
const playersTableBody = document.querySelector('#playersTable tbody');
const cancelEditBtn = document.getElementById('cancelEdit');

async function fetchTeams() {
  const res = await fetch('/api/teams');
  return res.json();
}

async function fetchPlayers() {
  const res = await fetch('/api/players');
  return res.json();
}

function renderPlayers(list) {
  playersTableBody.innerHTML = '';
  list.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.position}</td>
      <td>${p.age}</td>
      <td>${p.team?.name || 'Sin equipo'}</td>
      <td>
        <button data-id="${p.id}" class="btn edit">Editar</button>
        <button data-id="${p.id}" class="btn del">Eliminar</button>
      </td>`;
    playersTableBody.appendChild(tr);
  });
}

async function loadTeamsToSelect() {
  const teams = await fetchTeams();
  playerTeamSelect.innerHTML = '<option value="">-- Selecciona equipo --</option>';
  teams.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.name;
    playerTeamSelect.appendChild(opt);
  });
}

async function load() {
  await loadTeamsToSelect();
  const players = await fetchPlayers();
  renderPlayers(players);
}

playerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = playerIdInput.value;
  const name = playerNameInput.value.trim();
  const position = playerPositionInput.value.trim();
  const age = Number(playerAgeInput.value);
  const teamId = playerTeamSelect.value;

  if (!name || !position || !age || !teamId) return alert('Todos los campos y el equipo son requeridos');

  if (id) {
    const res = await fetch(`/api/players/${id}`, {
      method: 'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, position, age, teamId })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');
  } else {
    const res = await fetch('/api/players', {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, position, age, teamId })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');
  }
  playerForm.reset();
  playerIdInput.value = '';
  cancelEditBtn.style.display = 'none';
  await load();
});

playersTableBody.addEventListener('click', async (e) => {
  if (e.target.matches('.edit')) {
    const id = e.target.dataset.id;
    const players = await fetchPlayers();
    const p = players.find(x => x.id === id);
    if (!p) return alert('Jugador no encontrado');
    playerIdInput.value = p.id;
    playerNameInput.value = p.name;
    playerPositionInput.value = p.position;
    playerAgeInput.value = p.age;
    await loadTeamsToSelect();
    if (p.team?.id) playerTeamSelect.value = p.team.id;
    cancelEditBtn.style.display = 'inline';
  }
  if (e.target.matches('.del')) {
    if (!confirm('Eliminar jugador?')) return;
    const id = e.target.dataset.id;
    const res = await fetch(`/api/players/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');
    await load();
  }
});

cancelEditBtn.addEventListener('click', () => {
  playerForm.reset();
  playerIdInput.value = '';
  cancelEditBtn.style.display = 'none';
});

load();
