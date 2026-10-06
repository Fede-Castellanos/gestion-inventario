export default class Producto {
    #id;
    #nombre;
    #tipo;
    #esFrio;
    #precio;
    #cantidad;
    #caducidad;
    #numeroDeLote;
    #paisDeOrigen;
    #productor;
    #codigoBarras;
    constructor(id, nombre, tipo, esFrio, precio, cantidad, caducidad, numeroDeLote, paisDeOrigen, productor, codigoBarras) {
        this.#id = id;
        this.#nombre = nombre;
        this.#tipo = tipo;
        this.#esFrio = esFrio;
        this.#precio = precio;
        this.#numeroDeLote = numeroDeLote;
        this.#cantidad = cantidad;
	    this.#caducidad = caducidad;
        this.#paisDeOrigen = paisDeOrigen;
        this.#productor = productor;
        this.#codigoBarras = codigoBarras;
    }
    getId() { return this.#id }
    getNumeroDeLote() { return this.#numeroDeLote }
    getEsFrio() { return this.#esFrio }
    getPaisDeOrigen() { return this.#paisDeOrigen }
    getProductor() { return this.#productor }
    getCodigoDeBarras() { return this.#codigoBarras }
    getPrecio() { return this.#precio }
    getCantidad() { return this.#cantidad }
    getCaducidad() { return this.#caducidad }
    getNombre() { return this.#nombre }
    getTipo() { return this.#tipo }


    //Reduce la cantidad de stock del producto, verificando que haya suficiente stock disponible
    reducirStock(cantidad) {
        if (cantidad > this.#cantidad) {
            throw new Error(`No hay suficiente stock de ${this.#nombre}. Stock actual: ${this.#cantidad}, cantidad solicitada: ${cantidad}.`);
        }
        this.#cantidad -= cantidad;
    }
    //Aumenta la cantidad de stock del producto
    aumentarStock(cantidad) {
        this.#cantidad += cantidad;
    }
    //Calcula el subtotal del producto, aplicando un descuento opcional
    calcularSubtotal(descuento=1) { 
        return this.#precio * this.#cantidad * descuento;
    } 

    //Devuelve una cadena con la información del producto, incluyendo ID, nombre, tipo, si es frío, precio, cantidad, caducidad y número de lote
    toString() {
        return `ID: ${this.#id}, Nombre: ${this.#nombre}, Tipo: ${this.#tipo}, Es Frío: ${this.#esFrio}, Precio: ${this.#precio}, Cantidad: ${this.#cantidad}, Caducidad: ${this.#caducidad.toLocaleDateString()}, Número de Lote: ${this.#numeroDeLote}`;
    }
}