// Importar la conexión a la base de datos
import { Request, Response } from 'express';
import pool from '../database/db';

// Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users'); // Consultar todos los usuarios
    res.json(result.rows); // Enviar los usuarios como respuesta
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;
  
    try {
      // Actualiza el usuario en la base de datos
      const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
      const updatedUser = result.rows[0]; // Obtiene el usuario actualizado

      // Devuelve el usuario actualizado en la respuesta
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};
  

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body; // Obtener datos del cuerpo de la solicitud
  try {
    await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]); // Insertar un usuario
    res.json({ message: 'Usuario creado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params; // Obtener el ID del usuario de los parámetros
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]); // Eliminar un usuario por ID
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};
