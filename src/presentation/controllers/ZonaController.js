import ZonaService from '../../business/services/ZonaService.js';

export default class ZonaController {
    static async listar(req, res) {
        try {
            const zonas = await ZonaService.obtenerTodas();
            res.render('zonas/index', {
                title: 'Zonas de Almacenamiento',
                path: '/zonas',
                zonas,
                success: req.query.success || null,
                error: req.query.error || null
            });
        } catch (error) {
            res.render('zonas/index', {
                title: 'Zonas de Almacenamiento',
                path: '/zonas',
                zonas: [],
                success: null,
                error: error.message
            });
        }
    }

    static async mostrarFormularioNueva(req, res) {
        res.render('zonas/nueva', {
            title: 'Crear Nueva Zona',
            path: '/zonas/nueva',
            formData: {},
            success: null,
            error: null
        });
    }

    static async crear(req, res) {
        try {
            const { id, nombre, capacidadMaxima, esRefrigerada } = req.body;
            await ZonaService.crearZona({ id, nombre, capacidadMaxima, esRefrigerada });
            res.redirect('/zonas?success=' + encodeURIComponent(`Zona '${nombre}' creada exitosamente.`));
        } catch (error) {
            res.render('zonas/nueva', {
                title: 'Crear Nueva Zona',
                path: '/zonas/nueva',
                formData: req.body,
                success: null,
                error: error.message
            });
        }
    }

    static async detalle(req, res) {
        try {
            const { id } = req.params;
            const data = await ZonaService.obtenerPorIdConProductos(id);
            res.render('zonas/detalle', {
                title: `Detalle Zona: ${data.zona.getNombre()}`,
                path: '/zonas',
                data,
                success: req.query.success || null,
                error: req.query.error || null
            });
        } catch (error) {
            res.redirect(`/zonas?error=${encodeURIComponent(error.message)}`);
        }
    }
}
