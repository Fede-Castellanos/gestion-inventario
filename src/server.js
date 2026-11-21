import dotenv from 'dotenv';
import app from './app.js';
import { testConnection } from './config/db.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
    console.log('🚀 Iniciando Sistema Monolítico de Gestión de Inventario (3 Capas)...');

    // Comprobar estado de conexión con MySQL
    const dbStatus = await testConnection();
    if (dbStatus.ok) {
        console.log('✅ Conexión con base de datos MySQL establecida correctamente.');
    } else {
        console.warn('⚠️  ADVERTENCIA DE BASE DE DATOS:');
        console.warn(`   No se pudo conectar a MySQL (${dbStatus.error}).`);
        console.warn('   Si aún no creaste la base de datos o iniciaste MySQL, ejecuta:');
        console.warn('   👉 npm run init-db');
        console.warn('   Y revisa los parámetros en el archivo .env\n');
    }

    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`🌐 Servidor Web disponible en: http://localhost:${PORT}`);
        console.log(`📦 Capa Presentación : Express + EJS Views (Bootstrap 5)`);
        console.log(`⚙️  Capa Negocio      : Modelos POO y Servicios`);
        console.log(`💾 Capa Datos        : Repositorios / DAOs con MySQL2`);
        console.log(`====================================================`);
    });
}

startServer();
