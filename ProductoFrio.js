import Producto from "./Producto.js";
class ProductoFrio extends Producto {
    #temperaturaRecomendada;
    constructor(id, nombre, tipo, esFrio, precio, cantidad, caducidad, numeroDeLote, paisDeOrigen, productor, temperaturaRecomendada, codigoBarras) {
        super(id, nombre, tipo, esFrio, precio, cantidad, caducidad, numeroDeLote, paisDeOrigen, productor, codigoBarras);
        this.#temperaturaRecomendada = temperaturaRecomendada;
    }
    getTemperaturaRecomendada() { return this.#temperaturaRecomendada;}
    toString() {
        return `${super.toString()}, País de Origen: ${this.getPaisDeOrigen()}, Productor: ${this.getProductor()}, Código de Barras: ${this.getCodigoDeBarras()}`;
    }//Devuelve una cadena con la información del producto, incluyendo país de origen, productor y código de barras
}
export default ProductoFrio;