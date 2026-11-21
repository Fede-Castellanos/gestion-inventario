# Sistema Monolítico de Gestión de Inventario (3 Capas)

Aplicación monolítica completa en **3 capas** para la gestión de inventario, zonas de almacenamiento, control térmico, nómina de empleados y terminal de ventas con descuentos por país, persistido en base de datos **MySQL**.

---

## 🏛️ Arquitectura de la Aplicación (3 Capas)

La arquitectura sigue una estricta separación de responsabilidades:

```
src/
├── presentation/          👉 CAPA 1: PRESENTACIÓN (UI / Vistas y Controladores)
│   ├── controllers/      Controladores que procesan las peticiones HTTP y orquestan respuestas
│   ├── routes/           Enrutamiento modular de Express
│   └── views/            Plantillas EJS renderizadas en el servidor con Bootstrap 5
│
├── business/              👉 CAPA 2: NEGOCIO (Reglas del Dominio y Servicios)
│   ├── models/           Entidades POO con encapsulamiento y polimorfismo
│   │   ├── Empleado.js
│   │   ├── Zona.js
│   │   ├── Producto.js
│   │   ├── ProductoFrio.js      (Hereda de Producto, añade temperatura recomendada)
│   │   ├── ProductoCaliente.js  (Hereda de Producto para secos/ambiente)
│   │   └── GestorDescuentos.js  (Cálculos comerciales por país)
│   └── services/         Servicios que hacen cumplir las reglas de negocio y seguridad
│       ├── InventarioService.js
│       ├── VentaService.js
│       ├── ZonaService.js
│       ├── EmpleadoService.js
│       └── DescuentoService.js
│
├── data/                  👉 CAPA 3: DATOS / PERSISTENCIA (DAOs y Repositorios)
│   ├── EmpleadoRepository.js
│   ├── ZonaRepository.js
│   ├── ProductoRepository.js
│   ├── DescuentoRepository.js
│   └── VentaRepository.js
│
└── config/
    └── db.js              Pool de conexiones MySQL (mysql2/promise) con soporte para .env
```

---

## 📋 Reglas de Negocio Implementadas

1. **Jerarquía y Permisos de Empleados**:
   - **Gerente**: Autorizado para todas las operaciones (ingreso de productos y operación de caja).
   - **Supervisor**: Autorizado para ingresar productos y administrar inventario.
   - **Cajero**: Autorizado exclusivamente para operar la terminal de ventas en caja.
   - **Operario**: Personal de planta sin permisos de administración de stock ni caja.
   - *Cualquier intento no autorizado dispara un error de seguridad.*

2. **Compatibilidad Térmica**:
   - **Producto Frío (`ProductoFrio`)**: Requiere temperatura recomendada y solo puede guardarse en zonas **refrigeradas**.
   - **Producto Caliente / Seco (`ProductoCaliente`)**: Solo puede guardarse en zonas **no refrigeradas**.
   - *Intentar guardar un producto en una zona incompatible dispara un error de incompatibilidad térmica.*

3. **Capacidad Máxima de Zona**:
   - Cada zona posee una capacidad máxima de productos distintos. Se valida antes de permitir cualquier ingreso.

4. **Políticas de Descuentos Comerciales y Ventas**:
   - Los productos aplican un factor de descuento porcentual en la venta según su **país de procedencia** (ej: Argentina 10% OFF, Brasil 15% OFF, etc.).
   - Al vender un producto, se valida que haya stock suficiente, se deduce el stock automáticamente y se emite el ticket con el total cobrado.

---

## 🚀 Puesta en Marcha

### 1. Variables de Entorno (`.env`)
Revisa o edita el archivo `.env` en la raíz de `GestionAlmacenamiento/`:

```env
PORT=3000
NODE_ENV=development

# Conexión MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=inventario_db
```

### 2. Inicializar la Base de Datos MySQL
Asegúrate de que tu servicio MySQL (XAMPP, Laragon, MySQL Server o Docker) esté corriendo y ejecuta:

```bash
npm run init-db
```
*Este comando conectará a MySQL, creará la base de datos `inventario_db`, creará las 5 tablas y cargará los datos de prueba iniciales.*

### 3. Iniciar la Aplicación
```bash
# Modo Producción
npm start

# Modo Desarrollo (con autorecarga en cambios de código)
npm run dev
```

La aplicación estará lista en: **`http://localhost:3000`**

---

## 🖥️ Módulos de la Aplicación Web

- **Dashboard (`/`)**: Resumen del valor total del inventario valorizado con descuentos, stock global, ocupación gráfica de cada zona y últimas ventas.
- **Catálogo de Productos (`/productos`)**: Listado completo con filtros por zona o término de búsqueda, badges térmicos y ajuste rápido de stock.
- **Nuevo Producto (`/productos/nuevo`)**: Formulario con validación de jerarquía del empleado responsable y compatibilidad térmica de la zona.
- **Zonas (`/zonas`)**: Monitor de ocupación en tiempo real (porcentaje, lugares libres y barra de estado).
- **Detalle de Zona (`/zonas/:id`)**: Listado de los productos almacenados específicamente en esa zona.
- **Terminal de Caja (`/ventas/nueva`)**: Sistema de venta con lector de código de barras, selección de cajero autorizado, cálculo de descuento por país e impresión de ticket.
- **Historial de Ventas (`/ventas`)**: Registro de todas las transacciones realizadas con métricas de recaudación.
- **Nómina de Empleados (`/empleados`)**: Visualización y alta de empleados con legajo, puesto y salarios.
- **Políticas de Descuentos (`/descuentos`)**: Administración de porcentajes de descuentos comerciales por país.
