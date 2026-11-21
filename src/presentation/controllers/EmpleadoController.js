import EmpleadoService from '../../business/services/EmpleadoService.js';
import ZonaService from '../../business/services/ZonaService.js';

export default class EmpleadoController {
    static async listar(req, res) {
        try {
            const empleados = await EmpleadoService.obtenerTodos();
            res.render('empleados/index', {
                title: 'Nómina de Empleados',
                path: '/empleados',
                empleados,
                success: req.query.success || null,
                error: req.query.error || null
            });
        } catch (error) {
            res.render('empleados/index', {
                title: 'Nómina de Empleados',
                path: '/empleados',
                empleados: [],
                success: null,
                error: error.message
            });
        }
    }

    static async mostrarFormularioNuevo(req, res) {
        try {
            const zonas = await ZonaService.obtenerTodas();
            res.render('empleados/nuevo', {
                title: 'Registrar Empleado',
                path: '/empleados/nuevo',
                zonas,
                formData: {},
                success: null,
                error: null
            });
        } catch (error) {
            res.redirect(`/empleados?error=${encodeURIComponent(error.message)}`);
        }
    }

    static async crear(req, res) {
        try {
            const { id, nombre, apellido, puesto, zonaAsignada, fechaIngreso, salario } = req.body;
            await EmpleadoService.crearEmpleado({ id, nombre, apellido, puesto, zonaAsignada, fechaIngreso, salario });
            res.redirect('/empleados?success=' + encodeURIComponent(`Empleado ${nombre} ${apellido} (${puesto}) registrado con éxito.`));
        } catch (error) {
            try {
                const zonas = await ZonaService.obtenerTodas();
                res.render('empleados/nuevo', {
                    title: 'Registrar Empleado',
                    path: '/empleados/nuevo',
                    zonas,
                    formData: req.body,
                    success: null,
                    error: error.message
                });
            } catch (err2) {
                res.redirect(`/empleados?error=${encodeURIComponent(error.message)}`);
            }
        }
    }
}
