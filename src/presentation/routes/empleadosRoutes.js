import { Router } from 'express';
import EmpleadoController from '../controllers/EmpleadoController.js';

const router = Router();

router.get('/', EmpleadoController.listar);
router.get('/nuevo', EmpleadoController.mostrarFormularioNuevo);
router.post('/nuevo', EmpleadoController.crear);

export default router;
