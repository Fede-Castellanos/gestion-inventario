import pool from '../config/db.js';
import ProductoFrio from '../business/models/ProductoFrio.js';
import ProductoCaliente from '../business/models/ProductoCaliente.js';

export default class ProductoRepository {
    static _mapearFilaAEntidad(r) {
        if (!r) return null;
        if (r.es_frio) {
            return new ProductoFrio(
                r.id,
                r.nombre,
                r.tipo,
                true,
                r.precio,
                r.cantidad,
                r.caducidad,
                r.numero_de_lote,
                r.pais_de_origen,
                r.productor,
                r.temperatura_recomendada || 0,
                r.codigo_barras,
                r.zona_id
            );
        } else {
            return new ProductoCaliente(
                r.id,
                r.nombre,
                r.tipo,
                false,
                r.precio,
                r.cantidad,
                r.caducidad,
                r.numero_de_lote,
                r.pais_de_origen,
                r.productor,
                r.codigo_barras,
                r.zona_id
            );
        }
    }

    static async obtenerTodos(filtros = {}) {
        let sql = `
            SELECT p.*, z.nombre AS zona_nombre, z.es_refrigerada AS zona_refrigerada
            FROM productos p
            LEFT JOIN zonas z ON p.zona_id = z.id
            WHERE 1=1
        `;
        const params = [];

        if (filtros.zonaId) {
            sql += ` AND p.zona_id = ?`;
            params.push(filtros.zonaId);
        }
        if (filtros.busqueda) {
            sql += ` AND (p.nombre LIKE ? OR p.codigo_barras LIKE ? OR p.pais_de_origen LIKE ?)`;
            const term = `%${filtros.busqueda}%`;
            params.push(term, term, term);
        }

        sql += ` ORDER BY p.id ASC`;

        const [rows] = await pool.query(sql, params);
        return rows.map(r => ({
            producto: this._mapearFilaAEntidad(r),
            zonaNombre: r.zona_nombre || 'Sin Zona',
            zonaRefrigerada: Boolean(r.zona_refrigerada)
        }));
    }

    static async obtenerPorId(id) {
        const sql = `
            SELECT p.*, z.nombre AS zona_nombre, z.es_refrigerada AS zona_refrigerada
            FROM productos p
            LEFT JOIN zonas z ON p.zona_id = z.id
            WHERE p.id = ?
        `;
        const [rows] = await pool.query(sql, [id]);
        if (rows.length === 0) return null;
        const r = rows[0];
        return {
            producto: this._mapearFilaAEntidad(r),
            zonaNombre: r.zona_nombre || 'Sin Zona',
            zonaRefrigerada: Boolean(r.zona_refrigerada)
        };
    }

    static async obtenerPorCodigoBarras(codigo) {
        const sql = `
            SELECT p.*, z.nombre AS zona_nombre, z.es_refrigerada AS zona_refrigerada
            FROM productos p
            LEFT JOIN zonas z ON p.zona_id = z.id
            WHERE p.codigo_barras = ?
        `;
        const [rows] = await pool.query(sql, [codigo]);
        if (rows.length === 0) return null;
        const r = rows[0];
        return {
            producto: this._mapearFilaAEntidad(r),
            zonaNombre: r.zona_nombre || 'Sin Zona',
            zonaRefrigerada: Boolean(r.zona_refrigerada)
        };
    }

    static async contarPorZona(zonaId) {
        const [rows] = await pool.query('SELECT COUNT(*) AS total FROM productos WHERE zona_id = ?', [zonaId]);
        return rows[0].total;
    }

    static async crear(producto) {
        const query = `
            INSERT INTO productos 
            (nombre, tipo, es_frio, precio, cantidad, caducidad, numero_de_lote, pais_de_origen, productor, codigo_barras, temperatura_recomendada, zona_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const esFrio = producto.getEsFrio();
        const temp = esFrio && typeof producto.getTemperaturaRecomendada === 'function' 
            ? producto.getTemperaturaRecomendada() 
            : null;

        const params = [
            producto.getNombre(),
            producto.getTipo(),
            esFrio ? 1 : 0,
            producto.getPrecio(),
            producto.getCantidad(),
            producto.getCaducidad().toISOString().split('T')[0],
            producto.getNumeroDeLote(),
            producto.getPaisDeOrigen(),
            producto.getProductor(),
            producto.getCodigoDeBarras(),
            temp,
            producto.getZonaId()
        ];

        const [result] = await pool.query(query, params);
        return this.obtenerPorId(result.insertId);
    }

    static async actualizarStock(id, nuevoStock) {
        await pool.query('UPDATE productos SET cantidad = ? WHERE id = ?', [nuevoStock, id]);
        return this.obtenerPorId(id);
    }
}
