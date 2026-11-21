import DescuentoRepository from '../../data/DescuentoRepository.js';

export default class DescuentoService {
    static async obtenerTodos() {
        return await DescuentoRepository.obtenerTodos();
    }

    static async guardarDescuento({ pais, factorDecimal }) {
        if (!pais || pais.trim().length === 0) {
            throw new Error('El país es obligatorio.');
        }
        const factor = Number(factorDecimal);
        if (isNaN(factor) || factor <= 0 || factor > 1) {
            throw new Error('El factor de descuento debe ser un decimal entre 0 y 1 (ej: 0.90 para 10% de descuento).');
        }

        return await DescuentoRepository.guardarOActualizar(pais.trim(), factor);
    }

    static async eliminarDescuento(id) {
        return await DescuentoRepository.eliminar(id);
    }
}
