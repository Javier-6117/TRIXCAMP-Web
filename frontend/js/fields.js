// frontend/js/fields.js
const fieldForm = document.getElementById('fieldForm');
const fieldIdInput = document.getElementById('fieldId');
const fieldNameInput = document.getElementById('fieldName');
const fieldTempInput = document.getElementById('fieldTemp');
const fieldHumidityInput = document.getElementById('fieldHumidity');
const fieldRainingInput = document.getElementById('fieldRaining');
const fieldsTableBody = document.querySelector('#fieldsTable tbody');
const cancelEditBtn = document.getElementById('cancelEdit');

async function fetchFields() {
  const res = await fetch('/api/fields');
  return res.json();
}

function renderFields(list) {
  fieldsTableBody.innerHTML = '';
  list.forEach(f => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${f.name}</td>
      <td>${f.temperature}</td>
      <td>${f.humidity}</td>
      <td>${f.isRaining ? 'Sí' : 'No'}</td>
      <td>
        <button data-id="${f.id}" class="btn edit">Editar</button>
        <button data-id="${f.id}" class="btn del">Eliminar</button>
      </td>`;
    fieldsTableBody.appendChild(tr);
  });
}

async function load() {
  const fields = await fetchFields();
  renderFields(fields);
}

fieldForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = fieldIdInput.value;
  const name = fieldNameInput.value.trim();
  const temperature = Number(fieldTempInput.value || 25);
  const humidity = Number(fieldHumidityInput.value || 50);
  const isRaining = fieldRainingInput.checked;

  if (!name) return alert('Nombre requerido');

  if (id) {
    const res = await fetch(`/api/fields/${id}`, {
      method: 'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, temperature, humidity, isRaining })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');
  } else {
    const res = await fetch('/api/fields', {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, temperature, humidity, isRaining })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');
  }
  fieldForm.reset();
  fieldIdInput.value = '';
  cancelEditBtn.style.display = 'none';
  await load();
});

fieldsTableBody.addEventListener('click', async (e) => {
  if (e.target.matches('.edit')) {
    const id = e.target.dataset.id;
    const fields = await fetchFields();
    const f = fields.find(x => x.id === id);
    if (!f) return alert('Campo no encontrado');
    fieldIdInput.value = f.id;
    fieldNameInput.value = f.name;
    fieldTempInput.value = f.temperature;
    fieldHumidityInput.value = f.humidity;
    fieldRainingInput.checked = !!f.isRaining;
    cancelEditBtn.style.display = 'inline';
  }
  if (e.target.matches('.del')) {
    if (!confirm('Eliminar campo?')) return;
    const id = e.target.dataset.id;
    const res = await fetch(`/api/fields/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');
    await load();
  }
});

cancelEditBtn.addEventListener('click', () => {
  fieldForm.reset();
  fieldIdInput.value = '';
  cancelEditBtn.style.display = 'none';
});

load();
