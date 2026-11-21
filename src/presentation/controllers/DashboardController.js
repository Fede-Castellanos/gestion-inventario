import InventarioService from '../../business/services/InventarioService.js';
import ZonaService from '../../business/services/ZonaService.js';
import VentaService from '../../business/services/VentaService.js';

export default class DashboardController {
    static async mostrarDashboard(req, res) {
        try {
            const inventarioMetricas = await InventarioService.calcularValorTotalInventario();
            const zonas = await ZonaService.obtenerTodas();
            const ventasMetricas = await VentaService.obtenerMetricas();
            const ultimasVentas = await VentaService.obtenerHistorial(5);

            res.render('dashboard', {
                title: 'Panel Principal - Inventario',
                path: '/',
                metricas: inventarioMetricas,
                zonas,
                ventasMetricas,
                ultimasVentas,
                success: req.query.success || null,
                error: req.query.error || null
            });
        } catch (error) {
            res.render('dashboard', {
                title: 'Panel Principal - Inventario',
                path: '/',
                metricas: { totalBruto: 0, totalConDescuentos: 0, totalDescuentoAhorrado: 0, totalProductos: 0, totalUnidadesStock: 0 },
                zonas: [],
                ventasMetricas: { total_ventas: 0, total_recaudado: 0, unidades_vendidas: 0 },
                ultimasVentas: [],
                success: null,
                error: `Error cargando dashboard: ${error.message}. Asegúrate de haber ejecutado 'npm run init-db' y tener MySQL activo.`
            });
        }
    }
}
