import Zona from "./Zona.js";
export default class GestorInventario {
    constructor(politicaDescuentos) {
        this.zonas = new Map(); 
        this.politicaDescuentos = politicaDescuentos;
    }

    agregarZona(zona) {
        this.zonas.set(zona.getId(), zona);
    }//Agrega una zona al inventario, usando su ID como clave en el mapa de zonas

    agregarProducto(idZona, producto, empleado) {
        const puesto = empleado.getPuesto();
    
        if (puesto !== "Gerente" && puesto !== "Supervisor") {
            throw new Error(`Fallo de seguridad: El empleado ${empleado.getNombre()} (${puesto}) no tiene permisos para agregar productos.`);
        }//Valida que el empleado tenga permisos para agregar productos, si no, muestra error

        const zona = this.zonas.get(idZona);
        if (!zona) {
            throw new Error(`Fallo de puntero: La zona con ID ${idZona} no existe.`);
        }//Si la zona no existe, muestra error
        producto.aumentarStock(1); // Aumenta el stock del producto en 1 antes de agregarlo a la zona
        zona.agregarProducto(producto);
    }//Agrega un producto a una zona específica, verificando que la zona exista

    calcularValorTotal() {
        let total = 0;
        for (const zona of this.zonas.values()) {
            total += zona.calcularSubtotalZona(this.politicaDescuentos);
        }//Calcula el total de todas las zonas, aplicando descuentos según el país de origen
        return total;
    }//Calcula el valor total del inventario, sumando los subtotales de todas las zonas y aplicando descuentos según el país de origen de cada producto

    buscarPorCodigoDeBarras(codigo) {
        for (const zona of this.zonas.values()) {
            for (const producto of zona.getProductos().values()) {
                if (producto.getCodigoDeBarras() === codigo) {
                    return producto;
                }//Busca un producto por su código de barras en todas las zonas, devolviendo el producto si se encuentra
            }
        }
        throw new Error(`Lectura fallida: El producto con código ${codigo} no se encuentra en el establecimiento.`); 
    }//Si no se encuentra el producto, muestra error

    venderProducto(codigoDeBarras, empleado) {
        const puesto = empleado.getPuesto();
        if (puesto !== "Cajero" && puesto !== "Gerente") {
            throw new Error(`Fallo de seguridad: El empleado (${puesto}) no tiene autorización para operar la caja.`);
        }
        const producto = this.buscarPorCodigoDeBarras(codigoDeBarras);
        if (producto.getCantidad() <= 0) {
            throw new Error(`Quiebre de stock: No hay unidades disponibles de ${producto.getNombre()}.`);
        }
        producto.reducirStock(1); 
        const descuento = this.politicaDescuentos.obtenerDescuento(producto.getPaisDeOrigen());
        return {
            articulo: producto,
            precioCobrado: producto.getPrecio() * descuento
        };
    }/*Vende un producto, verificando que el empleado tenga autorización, que haya stock disponible y aplicando descuentos según el país de origen del producto.
    Devuelve el producto vendido y el precio cobrado por unidad.*/
}