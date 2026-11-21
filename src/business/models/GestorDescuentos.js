export default class GestorDescuentos {
    #promocionesPorPais;

    constructor() {
        this.#promocionesPorPais = new Map();
    }

    agregarDescuento(pais, factorDecimal) {
        const factor = Number(factorDecimal);
        if (isNaN(factor) || factor <= 0 || factor > 1) {
            throw new Error("El factor de descuento debe ser un decimal entre 0 y 1.");
        }
        this.#promocionesPorPais.set(pais.trim(), factor);
    }

    eliminarDescuento(pais) {
        this.#promocionesPorPais.delete(pais.trim());
    }

    obtenerDescuento(pais) {
        if (!pais) return 1;
        return this.#promocionesPorPais.has(pais.trim()) 
            ? this.#promocionesPorPais.get(pais.trim()) 
            : 1;
    }

    obtenerTodos() {
        const resultado = [];
        for (const [pais, factor] of this.#promocionesPorPais.entries()) {
            resultado.push({ pais, factor, porcentaje: Math.round((1 - factor) * 100) });
        }
        return resultado;
    }
}
