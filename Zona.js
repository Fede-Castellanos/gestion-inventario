export default class Zona {
    #id;
    #nombre;
    #capacidadMaxima;
    #esRefrigerada;
    #productos;

    constructor(id, nombre, capacidadMaxima, esRefrigerada) {
        this.#id = id;
        this.#nombre = nombre;
        this.#capacidadMaxima = capacidadMaxima;
        this.#esRefrigerada = esRefrigerada;
        this.#productos = new Map(); 
    }

    getId() { return this.#id; }
    getNombre() { return this.#nombre; }
    getProductos() { return Array.from(this.#productos.values()); }
    
    agregarProducto(producto) {
        if (this.#productos.size >= this.#capacidadMaxima) {
            throw new Error(`La zona ${this.#nombre} alcanzó su capacidad máxima de ${this.#capacidadMaxima}.`);
        } //Si supera el límite, muestra error
        if (producto.getEsFrio() !== this.#esRefrigerada) {
            throw new Error(`Incompatibilidad térmica: No podés guardar ${producto.getNombre()} en ${this.#nombre}.`);
        }//Si la temperatura del producto no coincide con la de la zona, muestra error

        this.#productos.set(producto.getId(), producto);
    }//Agrega un producto a la zona, verificando capacidad y compatibilidad térmica

    calcularSubtotalZona(gestorDescuentos) {
        let total = 0;
        for (const producto of this.#productos.values()) {
            const pais = producto.getPaisDeOrigen();
            // Le exige al motor de descuentos que resuelva la regla matemática
            const descuento = gestorDescuentos.obtenerDescuento(pais);
            total += producto.calcularSubtotal(descuento);
        }//Calcula el subtotal de la zona, aplicando descuentos según el país de origen de cada producto
        return total;
    }
}