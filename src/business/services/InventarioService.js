import ProductoRepository from '../../data/ProductoRepository.js';
import ZonaRepository from '../../data/ZonaRepository.js';
import EmpleadoRepository from '../../data/EmpleadoRepository.js';
import DescuentoRepository from '../../data/DescuentoRepository.js';
import ProductoFrio from '../models/ProductoFrio.js';
import ProductoCaliente from '../models/ProductoCaliente.js';

export default class InventarioService {
    static async obtenerInventarioCompleto(filtros = {}) {
        return await ProductoRepository.obtenerTodos(filtros);
    }

    static async obtenerProductoPorId(id) {
        const item = await ProductoRepository.obtenerPorId(id);
        if (!item) {
            throw new Error(`Lectura fallida: El producto con ID ${id} no existe.`);
        }
        return item;
    }

    static async buscarPorCodigoDeBarras(codigo) {
        const item = await ProductoRepository.obtenerPorCodigoBarras(codigo);
        if (!item) {
            throw new Error(`Lectura fallida: El producto con código '${codigo}' no se encuentra en el establecimiento.`);
        }
        return item;
    }

    static async agregarProducto(productoRawData, idEmpleado) {
        // 1. Validar permisos del empleado
        const empleado = await EmpleadoRepository.obtenerPorId(idEmpleado);
        if (!empleado) {
            throw new Error(`Fallo de seguridad: Empleado no encontrado (ID: ${idEmpleado}).`);
        }
        if (!empleado.puedeAgregarProductos()) {
            throw new Error(`Fallo de seguridad: El empleado ${empleado.getNombre()} (${empleado.getPuesto()}) no tiene permisos para agregar productos. Solo Gerente o Supervisor pueden realizar esta operación.`);
        }

        // 2. Validar existencia de la zona
        const idZona = Number(productoRawData.zonaId);
        const zonaResult = await ZonaRepository.obtenerPorId(idZona);
        if (!zonaResult) {
            throw new Error(`Fallo de puntero: La zona con ID ${idZona} no existe.`);
        }
        const { zona, cantidadOcupada, capacidadMaxima } = zonaResult;

        // 3. Validar capacidad máxima de la zona
        if (cantidadOcupada >= capacidadMaxima) {
            throw new Error(`Capacidad excedida: La zona '${zona.getNombre()}' alcanzó su capacidad máxima de ${capacidadMaxima} productos.`);
        }

        // 4. Instanciar la entidad correspondiente (Polimorfismo frío/caliente)
        const esFrio = productoRawData.esFrio === 'true' || productoRawData.esFrio === true || productoRawData.esFrio === 1;
        
        // 5. Validar compatibilidad térmica
        if (esFrio !== zona.getEsRefrigerada()) {
            const tipoZona = zona.getEsRefrigerada() ? 'refrigerada' : 'no refrigerada (secos)';
            const tipoProd = esFrio ? 'frío / refrigerado' : 'seco / a temperatura ambiente';
            throw new Error(`Incompatibilidad térmica: No puedes guardar '${productoRawData.nombre}' (${tipoProd}) en la zona '${zona.getNombre()}' (${tipoZona}).`);
        }

        let nuevoProducto;
        if (esFrio) {
            const temp = Number(productoRawData.temperaturaRecomendada) || 4;
            nuevoProducto = new ProductoFrio(
                null,
                productoRawData.nombre,
                productoRawData.tipo,
                true,
                Number(productoRawData.precio),
                Number(productoRawData.cantidad),
                productoRawData.caducidad,
                productoRawData.numeroDeLote,
                productoRawData.paisDeOrigen,
                productoRawData.productor,
                temp,
                productoRawData.codigoBarras,
                idZona
            );
        } else {
            nuevoProducto = new ProductoCaliente(
                null,
                productoRawData.nombre,
                productoRawData.tipo,
                false,
                Number(productoRawData.precio),
                Number(productoRawData.cantidad),
                productoRawData.caducidad,
                productoRawData.numeroDeLote,
                productoRawData.paisDeOrigen,
                productoRawData.productor,
                productoRawData.codigoBarras,
                idZona
            );
        }

        // 6. Persistir en la base de datos
        return await ProductoRepository.crear(nuevoProducto);
    }

    static async calcularValorTotalInventario() {
        const gestorDescuentos = await DescuentoRepository.obtenerGestorDescuentos();
        const lista = await ProductoRepository.obtenerTodos();

        let totalBruto = 0;
        let totalConDescuentos = 0;
        let totalUnidadesStock = 0;

        for (const item of lista) {
            const prod = item.producto;
            const subtotalBruto = prod.getPrecio() * prod.getCantidad();
            const descuento = gestorDescuentos.obtenerDescuento(prod.getPaisDeOrigen());
            const subtotalConDescuento = prod.calcularSubtotal(descuento);

            totalBruto += subtotalBruto;
            totalConDescuentos += subtotalConDescuento;
            totalUnidadesStock += prod.getCantidad();
        }

        return {
            totalBruto,
            totalConDescuentos,
            totalDescuentoAhorrado: totalBruto - totalConDescuentos,
            totalProductos: lista.length,
            totalUnidadesStock
        };
    }

    static async ajustarStock(productoId, nuevoStock) {
        const cantidad = Number(nuevoStock);
        if (isNaN(cantidad) || cantidad < 0) {
            throw new Error('La cantidad de stock debe ser un número entero mayor o igual a 0.');
        }
        return await ProductoRepository.actualizarStock(productoId, cantidad);
    }
}
