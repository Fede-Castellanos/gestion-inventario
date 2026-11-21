import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './presentation/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración de Motor de Plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'presentation', 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas de la Aplicación
app.use('/', routes);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).render('partials/header', {
        title: 'Página no encontrada (404)',
        path: '',
        success: null,
        error: 'La ruta solicitada no existe.'
    });
});

// Manejador global de errores (500)
app.use((err, req, res, next) => {
    console.error('❌ Error no controlado en la aplicación:', err);
    res.status(500).render('partials/header', {
        title: 'Error del Servidor (500)',
        path: '',
        success: null,
        error: `Ocurrió un error interno: ${err.message}`
    });
});

export default app;
