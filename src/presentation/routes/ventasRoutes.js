import { Router } from 'express';
import VentaController from '../controllers/VentaController.js';

const router = Router();

router.get('/', VentaController.historial);
router.get('/nueva', VentaController.mostrarCaja);
router.post('/nueva', VentaController.procesarVenta);

export default router;
