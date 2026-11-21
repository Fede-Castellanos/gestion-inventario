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
    #zonaId;

    constructor(id, nombre, tipo, esFrio, precio, cantidad, caducidad, numeroDeLote, paisDeOrigen, productor, codigoBarras, zonaId = null) {
        this.#id = id;
        this.#nombre = nombre;
        this.#tipo = tipo;
        this.#esFrio = Boolean(esFrio);
        this.#precio = Number(precio);
        this.#cantidad = Number(cantidad);
        this.#caducidad = caducidad instanceof Date ? caducidad : new Date(caducidad);
        this.#numeroDeLote = numeroDeLote;
        this.#paisDeOrigen = paisDeOrigen;
        this.#productor = productor;
        this.#codigoBarras = String(codigoBarras);
        this.#zonaId = zonaId;
    }

    getId() { return this.#id; }
    getNombre() { return this.#nombre; }
    getTipo() { return this.#tipo; }
    getEsFrio() { return this.#esFrio; }
    getPrecio() { return this.#precio; }
    getCantidad() { return this.#cantidad; }
    getCaducidad() { return this.#caducidad; }
    getNumeroDeLote() { return this.#numeroDeLote; }
    getPaisDeOrigen() { return this.#paisDeOrigen; }
    getProductor() { return this.#productor; }
    getCodigoDeBarras() { return this.#codigoBarras; }
    getZonaId() { return this.#zonaId; }

    setZonaId(zonaId) {
        this.#zonaId = zonaId;
    }

    reducirStock(cantidad = 1) {
        if (cantidad > this.#cantidad) {
            throw new Error(`No hay suficiente stock de ${this.#nombre}. Stock actual: ${this.#cantidad}, cantidad solicitada: ${cantidad}.`);
        }
        this.#cantidad -= cantidad;
    }

    aumentarStock(cantidad = 1) {
        this.#cantidad += cantidad;
    }

    calcularSubtotal(descuento = 1) {
        return this.#precio * this.#cantidad * descuento;
    }

    toString() {
        return `ID: ${this.#id}, Nombre: ${this.#nombre}, Tipo: ${this.#tipo}, Es Frío: ${this.#esFrio}, Precio: ${this.#precio}, Cantidad: ${this.#cantidad}, Caducidad: ${this.#caducidad.toLocaleDateString()}, Número de Lote: ${this.#numeroDeLote}`;
    }

    toJSON() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            tipo: this.#tipo,
            esFrio: this.#esFrio,
            precio: this.#precio,
            cantidad: this.#cantidad,
            caducidad: this.#caducidad.toISOString().split('T')[0],
            numeroDeLote: this.#numeroDeLote,
            paisDeOrigen: this.#paisDeOrigen,
            productor: this.#productor,
            codigoBarras: this.#codigoBarras,
            zonaId: this.#zonaId
        };
    }
}
