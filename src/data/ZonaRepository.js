import pool from '../config/db.js';
import Zona from '../business/models/Zona.js';

export default class ZonaRepository {
    static async obtenerTodas() {
        const query = `
            SELECT z.*, COUNT(p.id) AS cantidad_productos
            FROM zonas z
            LEFT JOIN productos p ON z.id = p.zona_id
            GROUP BY z.id
            ORDER BY z.id ASC
        `;
        const [rows] = await pool.query(query);
        return rows.map(r => {
            const zona = new Zona(r.id, r.nombre, r.capacidad_maxima, Boolean(r.es_refrigerada));
            return {
                zona,
                cantidadOcupada: Number(r.cantidad_productos || 0),
                capacidadMaxima: Number(r.capacidad_maxima),
                capacidadDisponible: Math.max(0, Number(r.capacidad_maxima) - Number(r.cantidad_productos || 0)),
                porcentajeOcupacion: Math.min(100, Math.round(((r.cantidad_productos || 0) / r.capacidad_maxima) * 100))
            };
        });
    }

    static async obtenerPorId(id) {
        const query = `
            SELECT z.*, COUNT(p.id) AS cantidad_productos
            FROM zonas z
            LEFT JOIN productos p ON z.id = p.zona_id
            WHERE z.id = ?
            GROUP BY z.id
        `;
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) return null;
        const r = rows[0];
        const zona = new Zona(r.id, r.nombre, r.capacidad_maxima, Boolean(r.es_refrigerada));
        return {
            zona,
            cantidadOcupada: Number(r.cantidad_productos || 0),
            capacidadMaxima: Number(r.capacidad_maxima),
            capacidadDisponible: Math.max(0, Number(r.capacidad_maxima) - Number(r.cantidad_productos || 0)),
            porcentajeOcupacion: Math.min(100, Math.round(((r.cantidad_productos || 0) / r.capacidad_maxima) * 100))
        };
    }

    static async crear(zonaData) {
        const { id, nombre, capacidadMaxima, esRefrigerada } = zonaData;
        let query;
        let params;
        if (id) {
            query = `INSERT INTO zonas (id, nombre, capacidad_maxima, es_refrigerada) VALUES (?, ?, ?, ?)`;
            params = [id, nombre, capacidadMaxima, esRefrigerada ? 1 : 0];
        } else {
            query = `INSERT INTO zonas (nombre, capacidad_maxima, es_refrigerada) VALUES (?, ?, ?)`;
            params = [nombre, capacidadMaxima, esRefrigerada ? 1 : 0];
        }

        const [result] = await pool.query(query, params);
        const insertId = id || result.insertId;
        return this.obtenerPorId(insertId);
    }
}
