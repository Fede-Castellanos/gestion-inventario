export default class GestorInventario {
    constructor() {
        this.baseDeDatos = new Map();
    }
    agregarProducto(producto) {
        this.baseDeDatos.set(producto.getId(), producto);
    }
    buscarProducto(id) {
        return this.baseDeDatos.get(id);
    }
    calcularSubtotal(id) {
        let total = 0;
        const producto = this.baseDeDatos.get(id);
        if (producto) {
            total = producto.calcularSubtotal();
        }
        return total;
    }
    calcularValorTotal() {
        let total = 0;
        for (const producto of this.baseDeDatos.values()) {
            total += producto.calcularSubtotal();
        }
        return total;
    }
    
}