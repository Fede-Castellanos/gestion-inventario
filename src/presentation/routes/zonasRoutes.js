import { Router } from 'express';
import ZonaController from '../controllers/ZonaController.js';

const router = Router();

router.get('/', ZonaController.listar);
router.get('/nueva', ZonaController.mostrarFormularioNueva);
router.post('/nueva', ZonaController.crear);
router.get('/:id', ZonaController.detalle);

export default router;
