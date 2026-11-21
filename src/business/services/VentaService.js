import ProductoRepository from '../../data/ProductoRepository.js';
import EmpleadoRepository from '../../data/EmpleadoRepository.js';
import DescuentoRepository from '../../data/DescuentoRepository.js';
import VentaRepository from '../../data/VentaRepository.js';

export default class VentaService {
    static async realizarVenta({ codigoBarras, empleadoId, cantidad = 1 }) {
        const cant = Number(cantidad);
        if (isNaN(cant) || cant <= 0) {
            throw new Error('La cantidad a vender debe ser un número entero mayor a 0.');
        }

        // 1. Validar autorización del empleado
        const empleado = await EmpleadoRepository.obtenerPorId(empleadoId);
        if (!empleado) {
            throw new Error(`Fallo de seguridad: Empleado no encontrado (ID: ${empleadoId}).`);
        }
        if (!empleado.puedeOperarCaja()) {
            throw new Error(`Fallo de seguridad: El empleado ${empleado.getNombre()} (${empleado.getPuesto()}) no tiene autorización para operar la caja. Solo Cajero o Gerente pueden registrar ventas.`);
        }

        // 2. Buscar producto por código de barras
        const item = await ProductoRepository.obtenerPorCodigoBarras(codigoBarras.trim());
        if (!item) {
            throw new Error(`Lectura fallida: El producto con código '${codigoBarras}' no se encuentra en el establecimiento.`);
        }
        const producto = item.producto;

        // 3. Validar stock
        if (producto.getCantidad() < cant) {
            throw new Error(`Quiebre de stock: No hay unidades suficientes de '${producto.getNombre()}'. Stock actual: ${producto.getCantidad()}, solicitadas: ${cant}.`);
        }

        // 4. Aplicar política comercial de descuento
        const gestorDescuentos = await DescuentoRepository.obtenerGestorDescuentos();
        const factorDescuento = gestorDescuentos.obtenerDescuento(producto.getPaisDeOrigen());
        const precioUnitario = producto.getPrecio();
        const totalSinDescuento = precioUnitario * cant;
        const totalCobrado = Math.round((totalSinDescuento * factorDescuento) * 100) / 100;

        // 5. Reducir stock del producto en la entidad y persistir
        producto.reducirStock(cant);
        await ProductoRepository.actualizarStock(producto.getId(), producto.getCantidad());

        // 6. Registrar la venta en la base de datos
        const ventaId = await VentaRepository.registrar({
            productoId: producto.getId(),
            empleadoId: empleado.getId(),
            cantidad: cant,
            precioUnitario,
            descuentoAplicado: factorDescuento,
            totalCobrado
        });

        return {
            ventaId,
            articulo: producto.toJSON(),
            empleado: empleado.toJSON(),
            cantidad: cant,
            precioUnitario,
            factorDescuento,
            descuentoPorcentaje: Math.round((1 - factorDescuento) * 100),
            totalCobrado,
            nuevoStock: producto.getCantidad()
        };
    }

    static async obtenerHistorial(limite = 50) {
        return await VentaRepository.obtenerTodas(limite);
    }

    static async obtenerMetricas() {
        return await VentaRepository.obtenerMetricas();
    }
}
