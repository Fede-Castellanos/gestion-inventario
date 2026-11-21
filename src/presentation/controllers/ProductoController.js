import InventarioService from '../../business/services/InventarioService.js';
import ZonaService from '../../business/services/ZonaService.js';
import EmpleadoService from '../../business/services/EmpleadoService.js';

export default class ProductoController {
    static async listar(req, res) {
        try {
            const { zonaId, busqueda } = req.query;
            const items = await InventarioService.obtenerInventarioCompleto({ zonaId, busqueda });
            const zonas = await ZonaService.obtenerTodas();

            res.render('productos/index', {
                title: 'Catálogo de Productos',
                path: '/productos',
                items,
                zonas,
                zonaSeleccionada: zonaId || '',
                busqueda: busqueda || '',
                success: req.query.success || null,
                error: req.query.error || null
            });
        } catch (error) {
            res.render('productos/index', {
                title: 'Catálogo de Productos',
                path: '/productos',
                items: [],
                zonas: [],
                zonaSeleccionada: '',
                busqueda: '',
                success: null,
                error: error.message
            });
        }
    }

    static async mostrarFormularioNuevo(req, res) {
        try {
            const zonas = await ZonaService.obtenerTodas();
            const empleados = await EmpleadoService.obtenerTodos();

            res.render('productos/nuevo', {
                title: 'Registrar Nuevo Producto',
                path: '/productos/nuevo',
                zonas,
                empleados,
                formData: {},
                success: null,
                error: req.query.error || null
            });
        } catch (error) {
            res.redirect(`/productos?error=${encodeURIComponent(error.message)}`);
        }
    }

    static async crear(req, res) {
        try {
            const {
                nombre, tipo, esFrio, precio, cantidad, caducidad,
                numeroDeLote, paisDeOrigen, productor, codigoBarras,
                temperaturaRecomendada, zonaId, empleadoId
            } = req.body;

            await InventarioService.agregarProducto({
                nombre,
                tipo,
                esFrio: esFrio === '1' || esFrio === 'true',
                precio,
                cantidad,
                caducidad,
                numeroDeLote,
                paisDeOrigen,
                productor,
                codigoBarras,
                temperaturaRecomendada,
                zonaId
            }, empleadoId);

            res.redirect('/productos?success=' + encodeURIComponent(`¡Producto '${nombre}' agregado exitosamente al inventario!`));
        } catch (error) {
            try {
                const zonas = await ZonaService.obtenerTodas();
                const empleados = await EmpleadoService.obtenerTodos();
                res.render('productos/nuevo', {
                    title: 'Registrar Nuevo Producto',
                    path: '/productos/nuevo',
                    zonas,
                    empleados,
                    formData: req.body,
                    success: null,
                    error: error.message
                });
            } catch (err2) {
                res.redirect(`/productos?error=${encodeURIComponent(error.message)}`);
            }
        }
    }

    static async actualizarStock(req, res) {
        try {
            const { id } = req.params;
            const { nuevoStock } = req.body;
            await InventarioService.ajustarStock(id, nuevoStock);
            res.redirect('/productos?success=' + encodeURIComponent('Stock actualizado con éxito.'));
        } catch (error) {
            res.redirect(`/productos?error=${encodeURIComponent(error.message)}`);
        }
    }
}
