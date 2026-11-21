import VentaService from '../../business/services/VentaService.js';
import EmpleadoService from '../../business/services/EmpleadoService.js';
import ProductoRepository from '../../data/ProductoRepository.js';

export default class VentaController {
    static async mostrarCaja(req, res) {
        try {
            const empleados = await EmpleadoService.obtenerTodos();
            const ventas = await VentaService.obtenerHistorial(20);
            const productos = await ProductoRepository.obtenerTodos();

            res.render('ventas/nueva', {
                title: 'Terminal de Ventas (Caja)',
                path: '/ventas/nueva',
                empleados,
                ventas,
                productos,
                recibo: null,
                formData: {},
                success: req.query.success || null,
                error: req.query.error || null
            });
        } catch (error) {
            res.render('ventas/nueva', {
                title: 'Terminal de Ventas (Caja)',
                path: '/ventas/nueva',
                empleados: [],
                ventas: [],
                productos: [],
                recibo: null,
                formData: {},
                success: null,
                error: error.message
            });
        }
    }

    static async procesarVenta(req, res) {
        try {
            const { codigoBarras, empleadoId, cantidad } = req.body;
            const recibo = await VentaService.realizarVenta({
                codigoBarras,
                empleadoId,
                cantidad
            });

            const empleados = await EmpleadoService.obtenerTodos();
            const ventas = await VentaService.obtenerHistorial(20);
            const productos = await ProductoRepository.obtenerTodos();

            res.render('ventas/nueva', {
                title: 'Terminal de Ventas (Caja)',
                path: '/ventas/nueva',
                empleados,
                ventas,
                productos,
                recibo,
                formData: {},
                success: `¡Venta procesada con éxito! Total cobrado: $${recibo.totalCobrado}`,
                error: null
            });
        } catch (error) {
            try {
                const empleados = await EmpleadoService.obtenerTodos();
                const ventas = await VentaService.obtenerHistorial(20);
                const productos = await ProductoRepository.obtenerTodos();

                res.render('ventas/nueva', {
                    title: 'Terminal de Ventas (Caja)',
                    path: '/ventas/nueva',
                    empleados,
                    ventas,
                    productos,
                    recibo: null,
                    formData: req.body,
                    success: null,
                    error: error.message
                });
            } catch (err2) {
                res.redirect(`/ventas/nueva?error=${encodeURIComponent(error.message)}`);
            }
        }
    }

    static async historial(req, res) {
        try {
            const ventas = await VentaService.obtenerHistorial(100);
            const metricas = await VentaService.obtenerMetricas();
            res.render('ventas/index', {
                title: 'Historial de Ventas',
                path: '/ventas',
                ventas,
                metricas,
                success: req.query.success || null,
                error: req.query.error || null
            });
        } catch (error) {
            res.render('ventas/index', {
                title: 'Historial de Ventas',
                path: '/ventas',
                ventas: [],
                metricas: { total_ventas: 0, total_recaudado: 0, unidades_vendidas: 0 },
                success: null,
                error: error.message
            });
        }
    }
}
