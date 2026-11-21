import Producto from "./Producto.js";

export default class ProductoCaliente extends Producto {
    constructor(id, nombre, tipo, esFrio = false, precio, cantidad, caducidad, numeroDeLote, paisDeOrigen, productor, codigoBarras, zonaId = null) {
        super(id, nombre, tipo, false, precio, cantidad, caducidad, numeroDeLote, paisDeOrigen, productor, codigoBarras, zonaId);
    }

    toString() {
        return `${super.toString()}, País de Origen: ${this.getPaisDeOrigen()}, Productor: ${this.getProductor()}, Código de Barras: ${this.getCodigoDeBarras()}`;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            temperaturaRecomendada: null
        };
    }
}
