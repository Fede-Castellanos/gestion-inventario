import { Router } from 'express';
import DashboardController from '../controllers/DashboardController.js';
import productosRoutes from './productosRoutes.js';
import zonasRoutes from './zonasRoutes.js';
import empleadosRoutes from './empleadosRoutes.js';
import ventasRoutes from './ventasRoutes.js';
import descuentosRoutes from './descuentosRoutes.js';

const router = Router();

router.get('/', DashboardController.mostrarDashboard);

router.use('/productos', productosRoutes);
router.use('/zonas', zonasRoutes);
router.use('/empleados', empleadosRoutes);
router.use('/ventas', ventasRoutes);
router.use('/descuentos', descuentosRoutes);

export default router;
