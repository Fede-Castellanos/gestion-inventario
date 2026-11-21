-- ==============================================================
-- Script de Creación y Carga Inicial de Base de Datos
-- Sistema de Gestión de Inventario (Monolito 3 Capas)
-- ==============================================================

CREATE DATABASE IF NOT EXISTS inventario_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE inventario_db;

-- 1. Tabla de Empleados
CREATE TABLE IF NOT EXISTS empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    puesto ENUM('Gerente', 'Supervisor', 'Operario', 'Cajero') NOT NULL,
    zona_asignada VARCHAR(100) NULL,
    fecha_ingreso DATE NOT NULL,
    salario DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Zonas de Almacenamiento
CREATE TABLE IF NOT EXISTS zonas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    capacidad_maxima INT NOT NULL,
    es_refrigerada TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Descuentos por País
CREATE TABLE IF NOT EXISTS descuentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pais VARCHAR(100) NOT NULL UNIQUE,
    factor_decimal DECIMAL(4, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Productos (Almacena productos fríos y calientes/secos)
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    es_frio TINYINT(1) NOT NULL DEFAULT 0,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    caducidad DATE NOT NULL,
    numero_de_lote VARCHAR(50) NOT NULL,
    pais_de_origen VARCHAR(100) NOT NULL,
    productor VARCHAR(150) NOT NULL,
    codigo_barras VARCHAR(50) NOT NULL UNIQUE,
    temperatura_recomendada DECIMAL(5, 2) NULL,
    zona_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_producto_zona FOREIGN KEY (zona_id) 
        REFERENCES zonas(id) ON DELETE SET NULL
);

-- 5. Tabla de Ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    empleado_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    descuento_aplicado DECIMAL(4, 2) NOT NULL,
    total_cobrado DECIMAL(10, 2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_venta_producto FOREIGN KEY (producto_id) 
        REFERENCES productos(id) ON DELETE RESTRICT,
    CONSTRAINT fk_venta_empleado FOREIGN KEY (empleado_id) 
        REFERENCES empleados(id) ON DELETE RESTRICT
);

-- ==============================================================
-- Datos Iniciales (Semilla de prueba)
-- ==============================================================

-- Empleados con distintos puestos para verificar validaciones de negocio
INSERT INTO empleados (id, nombre, apellido, puesto, zona_asignada, fecha_ingreso, salario) VALUES
(4432, 'Juan', 'Pérez', 'Gerente', 'Pasillo Central', '2020-06-15', 80000.00),
(4433, 'Carlos', 'Gómez', 'Supervisor', 'Heladeras Fondo', '2021-03-10', 65000.00),
(4434, 'Lucía', 'Martínez', 'Cajero', 'Línea de Cajas', '2022-01-20', 50000.00),
(4435, 'Martín', 'Díaz', 'Operario', 'Pasillo Central', '2023-05-18', 45000.00)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Zonas iniciales (1 seca y 1 refrigerada)
INSERT INTO zonas (id, nombre, capacidad_maxima, es_refrigerada) VALUES
(101, 'Pasillo Central', 500, 0),
(102, 'Heladeras Fondo', 100, 1)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Descuentos comerciales por país
INSERT INTO descuentos (pais, factor_decimal) VALUES
('Argentina', 0.90),
('Brasil', 0.85),
('Uruguay', 0.95)
ON DUPLICATE KEY UPDATE factor_decimal=VALUES(factor_decimal);

-- Productos iniciales
INSERT INTO productos (id, nombre, tipo, es_frio, precio, cantidad, caducidad, numero_de_lote, pais_de_origen, productor, codigo_barras, temperatura_recomendada, zona_id) VALUES
(1, 'Fideos Mostachol', 'no perecedero', 0, 1200.00, 50, '2026-11-20', 'L001', 'Argentina', 'Molinos Río de la Plata', '25588751746', NULL, 101),
(2, 'Leche Entera', 'perecedero', 1, 900.00, 20, '2026-12-20', 'L002', 'Uruguay', 'Conaprole', '25588751747', 4.00, 102),
(3, 'Café Tostado Brasil', 'no perecedero', 0, 3500.00, 30, '2027-01-15', 'L003', 'Brasil', 'Café do Ponto', '25588751748', NULL, 101)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);
