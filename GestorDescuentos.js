export default class GestorDescuentos {
    #promocionesPorPais;

    constructor() {
        this.#promocionesPorPais = new Map();
    }

    agregarDescuento(pais, factorDecimal) {
        if (factorDecimal <= 0 || factorDecimal > 1) {
            throw new Error("El factor de descuento debe ser un decimal entre 0 y 1.");
        }
        this.#promocionesPorPais.set(pais, factorDecimal);
    }//Agrega un descuento para un país específico, validando que el factor sea un decimal entre 0 y 1

    eliminarDescuento(pais) {
        this.#promocionesPorPais.delete(pais);
    }//Elimina el descuento asociado a un país específico

    obtenerDescuento(pais) {
        return this.#promocionesPorPais.has(pais) ? this.#promocionesPorPais.get(pais) : 1;
    }//Obtiene el factor de descuento para un país específico, devolviendo 1 si no hay descuento
}