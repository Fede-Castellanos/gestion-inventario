import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
    console.log('🔄 Conectando a MySQL para inicializar la base de datos...');
    
    const host = process.env.DB_HOST || 'localhost';
    const port = Number(process.env.DB_PORT) || 3306;
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'inventario_db';

    let connection;
    try {
        // Conexión inicial sin seleccionar base de datos para poder crearla
        connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
            multipleStatements: true
        });

        console.log(`✅ Conexión establecida con MySQL en ${host}:${port}`);

        const sqlScriptPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(sqlScriptPath, 'utf8');

        console.log(`📄 Ejecutando script schema.sql en la base '${database}'...`);
        await connection.query(sql);

        console.log('🎉 ¡Base de datos y tablas creadas/actualizadas con éxito!');
        console.log('📊 Datos iniciales insertados correctamente.');
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:');
        console.error(error.message);
        console.error('\n💡 Consejo: Asegúrate de que el servicio MySQL esté corriendo y que las credenciales en .env sean correctas.');
        process.exitCode = 1;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

initDatabase();
