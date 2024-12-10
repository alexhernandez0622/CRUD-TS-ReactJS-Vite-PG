// Importar Router de Express y los controladores
import { Router } from 'express';
import { getUsers, createUser, deleteUser, updateUser } from '../controller/userController'; // Asegúrate de importar updateUser

// Crear un nuevo router
const router = Router();

// Definir rutas del CRUD
router.get('/users', getUsers); // Ruta para obtener usuarios
router.post('/users', createUser); // Ruta para crear un usuario
router.put('/users/:id', updateUser); // Ruta para actualizar un usuario (agregada aquí)
router.delete('/users/:id', deleteUser); // Ruta para eliminar un usuario

// Exportar las rutas
export default router;
