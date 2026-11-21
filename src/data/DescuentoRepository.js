import pool from '../config/db.js';
import GestorDescuentos from '../business/models/GestorDescuentos.js';

export default class DescuentoRepository {
    static async obtenerGestorDescuentos() {
        const [rows] = await pool.query('SELECT * FROM descuentos ORDER BY pais ASC');
        const gestor = new GestorDescuentos();
        for (const row of rows) {
            gestor.agregarDescuento(row.pais, Number(row.factor_decimal));
        }
        return gestor;
    }

    static async obtenerTodos() {
        const [rows] = await pool.query('SELECT * FROM descuentos ORDER BY pais ASC');
        return rows.map(r => ({
            id: r.id,
            pais: r.pais,
            factorDecimal: Number(r.factor_decimal),
            porcentaje: Math.round((1 - Number(r.factor_decimal)) * 100)
        }));
    }

    static async guardarOActualizar(pais, factorDecimal) {
        const query = `
            INSERT INTO descuentos (pais, factor_decimal)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE factor_decimal = VALUES(factor_decimal)
        `;
        await pool.query(query, [pais.trim(), factorDecimal]);
        return this.obtenerGestorDescuentos();
    }

    static async eliminar(id) {
        await pool.query('DELETE FROM descuentos WHERE id = ?', [id]);
    }
}
