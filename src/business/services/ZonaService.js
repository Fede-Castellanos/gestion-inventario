import ZonaRepository from '../../data/ZonaRepository.js';
import ProductoRepository from '../../data/ProductoRepository.js';

export default class ZonaService {
    static async obtenerTodas() {
        return await ZonaRepository.obtenerTodas();
    }

    static async obtenerPorIdConProductos(id) {
        const zonaResult = await ZonaRepository.obtenerPorId(id);
        if (!zonaResult) {
            throw new Error(`La zona con ID ${id} no existe.`);
        }
        const productos = await ProductoRepository.obtenerTodos({ zonaId: id });
        return {
            ...zonaResult,
            productos
        };
    }

    static async crearZona({ id, nombre, capacidadMaxima, esRefrigerada }) {
        if (!nombre || nombre.trim().length === 0) {
            throw new Error('El nombre de la zona es obligatorio.');
        }
        const capacidad = Number(capacidadMaxima);
        if (isNaN(capacidad) || capacidad <= 0) {
            throw new Error('La capacidad máxima debe ser un número entero mayor a 0.');
        }

        return await ZonaRepository.crear({
            id: id ? Number(id) : null,
            nombre: nombre.trim(),
            capacidadMaxima: capacidad,
            esRefrigerada: esRefrigerada === 'true' || esRefrigerada === true || esRefrigerada === '1' || esRefrigerada === 1
        });
    }
}
