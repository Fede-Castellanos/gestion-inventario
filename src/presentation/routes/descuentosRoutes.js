import { Router } from 'express';
import DescuentoController from '../controllers/DescuentoController.js';

const router = Router();

router.get('/', DescuentoController.listar);
router.post('/', DescuentoController.guardar);
router.post('/:id/eliminar', DescuentoController.eliminar);

export default router;
