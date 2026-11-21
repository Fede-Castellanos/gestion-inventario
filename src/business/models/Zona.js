export default class Zona {
    #id;
    #nombre;
    #capacidadMaxima;
    #esRefrigerada;
    #productos;

    constructor(id, nombre, capacidadMaxima, esRefrigerada) {
        this.#id = id;
        this.#nombre = nombre;
        this.#capacidadMaxima = Number(capacidadMaxima);
        this.#esRefrigerada = Boolean(esRefrigerada);
        this.#productos = new Map(); 
    }

    getId() { return this.#id; }
    getNombre() { return this.#nombre; }
    getCapacidadMaxima() { return this.#capacidadMaxima; }
    getEsRefrigerada() { return this.#esRefrigerada; }
    getProductos() { return Array.from(this.#productos.values()); }
    
    getCantidadOcupada() {
        return this.#productos.size;
    }

    getCapacidadDisponible() {
        return Math.max(0, this.#capacidadMaxima - this.#productos.size);
    }

    getPorcentajeOcupacion() {
        if (this.#capacidadMaxima === 0) return 0;
        return Math.min(100, Math.round((this.#productos.size / this.#capacidadMaxima) * 100));
    }

    agregarProducto(producto) {
        if (this.#productos.size >= this.#capacidadMaxima) {
            throw new Error(`La zona ${this.#nombre} alcanzó su capacidad máxima de ${this.#capacidadMaxima}.`);
        }
        if (producto.getEsFrio() !== this.#esRefrigerada) {
            const tipoZona = this.#esRefrigerada ? "refrigerada" : "no refrigerada (secos)";
            const tipoProd = producto.getEsFrio() ? "frío" : "ambiente/caliente";
            throw new Error(`Incompatibilidad térmica: No puedes guardar el producto ${producto.getNombre()} (${tipoProd}) en la zona ${this.#nombre} (${tipoZona}).`);
        }

        this.#productos.set(producto.getId(), producto);
        producto.setZonaId(this.#id);
    }

    removerProducto(productoId) {
        this.#productos.delete(productoId);
    }

    calcularSubtotalZona(gestorDescuentos) {
        let total = 0;
        for (const producto of this.#productos.values()) {
            const pais = producto.getPaisDeOrigen();
            const descuento = gestorDescuentos ? gestorDescuentos.obtenerDescuento(pais) : 1;
            total += producto.calcularSubtotal(descuento);
        }
        return total;
    }

    toJSON() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            capacidadMaxima: this.#capacidadMaxima,
            esRefrigerada: this.#esRefrigerada,
            cantidadOcupada: this.getCantidadOcupada(),
            capacidadDisponible: this.getCapacidadDisponible(),
            porcentajeOcupacion: this.getPorcentajeOcupacion()
        };
    }
}
