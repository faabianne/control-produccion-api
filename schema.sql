CREATE TABLE lineas_produccion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    estado VARCHAR(20) DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'MANTENIMIENTO', 'DETENIDA'))
);
--La regla CHECK impide que alguien escriba un estado inventado; solo acepta esas tres palabras exactas.

CREATE TABLE lotes (
    id SERIAL PRIMARY KEY,
    codigo_lote VARCHAR(50) UNIQUE NOT NULL,
    formula VARCHAR(120) NOT NULL,
    cantidad_litros NUMERIC(10, 2) NOT NULL,
    linea_id INT REFERENCES lineas_produccion(id) ON DELETE SET NULL,
    estado_calidad VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado_calidad IN ('PENDIENTE', 'APROBADO', 'RECHAZADO')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO lineas_produccion (nombre, estado) VALUES 
('Línea A - Mezclado Fino', 'ACTIVA'),
('Línea B - Envasado Industrial', 'ACTIVA'),
('Línea C - Destilación', 'MANTENIMIENTO');
