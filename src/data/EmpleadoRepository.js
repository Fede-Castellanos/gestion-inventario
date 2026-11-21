import pool from '../config/db.js';
import Empleado from '../business/models/Empleado.js';

export default class EmpleadoRepository {
    static async obtenerTodos() {
        const [rows] = await pool.query('SELECT * FROM empleados ORDER BY id ASC');
        return rows.map(r => new Empleado(
            r.id,
            r.nombre,
            r.apellido,
            r.puesto,
            r.zona_asignada,
            r.fecha_ingreso,
            r.salario
        ));
    }

    static async obtenerPorId(id) {
        const [rows] = await pool.query('SELECT * FROM empleados WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        const r = rows[0];
        return new Empleado(
            r.id,
            r.nombre,
            r.apellido,
            r.puesto,
            r.zona_asignada,
            r.fecha_ingreso,
            r.salario
        );
    }

    static async crear(empleadoData) {
        const { id, nombre, apellido, puesto, zonaAsignada, fechaIngreso, salario } = empleadoData;
        
        let query;
        let params;
        if (id) {
            query = `INSERT INTO empleados (id, nombre, apellido, puesto, zona_asignada, fecha_ingreso, salario)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
            params = [id, nombre, apellido, puesto, zonaAsignada || 'Sin asignar', fechaIngreso, salario];
        } else {
            query = `INSERT INTO empleados (nombre, apellido, puesto, zona_asignada, fecha_ingreso, salario)
                     VALUES (?, ?, ?, ?, ?, ?)`;
            params = [nombre, apellido, puesto, zonaAsignada || 'Sin asignar', fechaIngreso, salario];
        }

        const [result] = await pool.query(query, params);
        const insertId = id || result.insertId;
        return this.obtenerPorId(insertId);
    }
}
