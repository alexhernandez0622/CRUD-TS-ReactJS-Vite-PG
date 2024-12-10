// Importar librerías y módulos necesarios
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path'; // Importar módulo path para manejar rutas
import userRoutes from './routes/userRoutes';

// Crear una instancia de la aplicación Express
const app = express();

// Middleware para manejar CORS y parsear el cuerpo de las solicitudes
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Configurar la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Usar las rutas de usuarios
app.use('/api', userRoutes);

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
