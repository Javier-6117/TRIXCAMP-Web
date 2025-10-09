// Listar jugadores desde backend
const playersTableBody = document.querySelector('#playersTable tbody');

async function loadPlayers() {
  try {
    const res = await fetch('/api/players');
    const players = await res.json();
    playersTableBody.innerHTML = '';
    players.forEach(player => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${player.name}</td>
        <td>${player.position}</td>
        <td>${player.age}</td>
      `;
      playersTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error al cargar jugadores', error);
  }
}

loadPlayers();
