import Producto from "./Producto.js";

export default class ProductoFrio extends Producto {
    #temperaturaRecomendada;

    constructor(id, nombre, tipo, esFrio = true, precio, cantidad, caducidad, numeroDeLote, paisDeOrigen, productor, temperaturaRecomendada, codigoBarras, zonaId = null) {
        super(id, nombre, tipo, true, precio, cantidad, caducidad, numeroDeLote, paisDeOrigen, productor, codigoBarras, zonaId);
        this.#temperaturaRecomendada = Number(temperaturaRecomendada);
    }

    getTemperaturaRecomendada() { 
        return this.#temperaturaRecomendada; 
    }

    toString() {
        return `${super.toString()}, Temperatura: ${this.#temperaturaRecomendada}°C, País de Origen: ${this.getPaisDeOrigen()}, Productor: ${this.getProductor()}, Código de Barras: ${this.getCodigoDeBarras()}`;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            temperaturaRecomendada: this.#temperaturaRecomendada
        };
    }
}
