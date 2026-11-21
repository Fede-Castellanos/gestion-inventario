import DescuentoService from '../../business/services/DescuentoService.js';

export default class DescuentoController {
    static async listar(req, res) {
        try {
            const descuentos = await DescuentoService.obtenerTodos();
            res.render('descuentos/index', {
                title: 'Políticas Comerciales de Descuento',
                path: '/descuentos',
                descuentos,
                success: req.query.success || null,
                error: req.query.error || null
            });
        } catch (error) {
            res.render('descuentos/index', {
                title: 'Políticas Comerciales de Descuento',
                path: '/descuentos',
                descuentos: [],
                success: null,
                error: error.message
            });
        }
    }

    static async guardar(req, res) {
        try {
            const { pais, factorDecimal } = req.body;
            await DescuentoService.guardarDescuento({ pais, factorDecimal });
            res.redirect('/descuentos?success=' + encodeURIComponent(`Descuento para ${pais} configurado exitosamente.`));
        } catch (error) {
            res.redirect(`/descuentos?error=${encodeURIComponent(error.message)}`);
        }
    }

    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            await DescuentoService.eliminarDescuento(id);
            res.redirect('/descuentos?success=' + encodeURIComponent('Descuento eliminado exitosamente.'));
        } catch (error) {
            res.redirect(`/descuentos?error=${encodeURIComponent(error.message)}`);
        }
    }
}
