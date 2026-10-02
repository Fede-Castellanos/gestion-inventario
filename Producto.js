export default class Producto {
    #id;
    #nombre;
    #tipo
    #esFrio;
    #precio;
    #cantidad;
    #caducidad;
    constructor(id, nombre, tipo, esFrio, precio, cantidad, caducidad){
        this.#id = id;
        this.#nombre = nombre;
        this.#tipo = tipo;
        this.#esFrio = esFrio;
        this.#precio = precio;
        this.#cantidad = cantidad;
	    this.#caducidad = caducidad;
    }
    getId() { return this.#id }

    calcularSubtotal() { return this.#precio * this.#cantidad; }

}