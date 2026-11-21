import EmpleadoRepository from '../../data/EmpleadoRepository.js';

export default class EmpleadoService {
    static async obtenerTodos() {
        return await EmpleadoRepository.obtenerTodos();
    }

    static async obtenerPorId(id) {
        const emp = await EmpleadoRepository.obtenerPorId(id);
        if (!emp) {
            throw new Error(`Empleado con ID ${id} no encontrado.`);
        }
        return emp;
    }

    static async crearEmpleado({ id, nombre, apellido, puesto, zonaAsignada, fechaIngreso, salario }) {
        if (!nombre || !apellido) {
            throw new Error('Nombre y Apellido son obligatorios.');
        }
        const puestosValidos = ["Gerente", "Supervisor", "Operario", "Cajero"];
        if (!puestosValidos.includes(puesto)) {
            throw new Error(`El puesto '${puesto}' no es válido. Opciones permitidas: ${puestosValidos.join(', ')}.`);
        }
        const sueldo = Number(salario);
        if (isNaN(sueldo) || sueldo < 0) {
            throw new Error('El salario debe ser un número positivo.');
        }

        return await EmpleadoRepository.crear({
            id: id ? Number(id) : null,
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            puesto,
            zonaAsignada: zonaAsignada ? zonaAsignada.trim() : 'Sin asignar',
            fechaIngreso: fechaIngreso || new Date().toISOString().split('T')[0],
            salario: sueldo
        });
    }
}
