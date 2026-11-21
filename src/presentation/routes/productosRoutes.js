import { Router } from 'express';
import ProductoController from '../controllers/ProductoController.js';

const router = Router();

router.get('/', ProductoController.listar);
router.get('/nuevo', ProductoController.mostrarFormularioNuevo);
router.post('/nuevo', ProductoController.crear);
router.post('/:id/stock', ProductoController.actualizarStock);

export default router;
