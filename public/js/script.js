const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editName = document.getElementById('editName');
const editEmail = document.getElementById('editEmail');
const cancelEdit = document.getElementById('cancelEdit');

let editingUserId = null; // Almacena el ID del usuario en edición

// Crear usuario
userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });

  if (response.ok) {
    Swal.fire('Éxito', 'Usuario creado', 'success');
    userForm.reset();
    loadUsers();
  } else {
    Swal.fire('Error', 'Hubo un problema al crear el usuario', 'error');
  }
});

// Abrir modal de edición
const openEditModal = (user) => {
  editingUserId = user.id; // Guardar ID del usuario en edición
  editName.value = user.name; // Llenar campos del modal con los datos actuales
  editEmail.value = user.email;
  editModal.style.display = 'flex'; // Mostrar el modal
};

// Actualizar usuario (cuando se haga clic en "Guardar Cambios")
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Obtener los datos del formulario de edición
  const name = editName.value;
  const email = editEmail.value;

  // Verificar si hay campos vacíos
  if (!name || !email) {
    Swal.fire('Error', 'Por favor complete todos los campos', 'error');
    return;
  }

  // Hacer la solicitud PUT para actualizar el usuario
  try {
    const response = await fetch(`/api/users/${editingUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    if (response.ok) {
      Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
      editModal.style.display = 'none'; // Cerrar el modal
      loadUsers(); // Recargar la lista de usuarios
    } else {
      const errorData = await response.json();
      Swal.fire('Error', errorData.message || 'Hubo un problema al actualizar el usuario', 'error');
    }
  } catch (error) {
    Swal.fire('Error', 'Hubo un problema con la conexión al servidor', 'error');
  }
});

// Cancelar la edición
cancelEdit.addEventListener('click', () => {
  editModal.style.display = 'none'; // Cerrar el modal
});

// Cargar los usuarios
async function loadUsers() {
  const response = await fetch('/api/users');
  const users = await response.json();

  userList.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${user.name} (${user.email})</span>
      <div>
        <button class="edit-btn" data-id="${user.id}" data-name="${user.name}" data-email="${user.email}">Editar</button>
        <button class="delete-btn" data-id="${user.id}">Eliminar</button>
      </div>
    `;
    userList.appendChild(li);
  });

  // Agregar eventos a los botones de edición
  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const userId = e.target.getAttribute('data-id');
      const userName = e.target.getAttribute('data-name');
      const userEmail = e.target.getAttribute('data-email');

      openEditModal({ id: userId, name: userName, email: userEmail });
    });
  });

  // Agregar eventos a los botones de eliminación
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const userId = e.target.getAttribute('data-id');
      deleteUser(userId);
    });
  });
}

// Eliminar usuario
async function deleteUser(id) {
  const confirmation = await Swal.fire({
    title: '¿Eliminar usuario?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
  });

  if (confirmation.isConfirmed) {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    loadUsers(); // Recargar la lista de usuarios después de eliminar
  }
}

// Cargar los usuarios al iniciar
loadUsers();
