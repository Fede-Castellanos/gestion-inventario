import pool from '../config/db.js';

export default class VentaRepository {
    static async registrar(ventaData) {
        const { productoId, empleadoId, cantidad, precioUnitario, descuentoAplicado, totalCobrado } = ventaData;
        const query = `
            INSERT INTO ventas (producto_id, empleado_id, cantidad, precio_unitario, descuento_aplicado, total_cobrado)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [
            productoId,
            empleadoId,
            cantidad,
            precioUnitario,
            descuentoAplicado,
            totalCobrado
        ]);
        return result.insertId;
    }

    static async obtenerTodas(limite = 50) {
        const query = `
            SELECT v.*, 
                   p.nombre AS producto_nombre, p.codigo_barras, p.pais_de_origen,
                   e.nombre AS empleado_nombre, e.apellido AS empleado_apellido, e.puesto AS empleado_puesto
            FROM ventas v
            JOIN productos p ON v.producto_id = p.id
            JOIN empleados e ON v.empleado_id = e.id
            ORDER BY v.fecha DESC
            LIMIT ?
        `;
        const [rows] = await pool.query(query, [limite]);
        return rows;
    }

    static async obtenerMetricas() {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) AS total_ventas,
                COALESCE(SUM(total_cobrado), 0) AS total_recaudado,
                COALESCE(SUM(cantidad), 0) AS unidades_vendidas
            FROM ventas
        `);
        return rows[0];
    }
}
