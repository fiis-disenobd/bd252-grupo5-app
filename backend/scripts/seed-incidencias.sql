-- Script para insertar datos iniciales de incidencias
-- Ejecutar en PostgreSQL después de crear las tablas

-- Tipos de Incidencia (usar los nombres que ya existen en la BD)
INSERT INTO shared.tipoincidencia (id_tipo_incidencia, nombre) VALUES
('11111111-1111-1111-1111-111111111111', 'Daño en Contenedor'),
('22222222-2222-2222-2222-222222222222', 'Retraso en Entrega'),
('33333333-3333-3333-3333-333333333333', 'Desvío de Ruta'),
('44444444-4444-4444-4444-444444444444', 'Daño en Mercancía'),
('55555555-5555-5555-5555-555555555555', 'Falla de Sensor'),
('66666666-6666-6666-6666-666666666666', 'Temperatura Fuera de Rango')
ON CONFLICT (nombre) DO NOTHING;

-- Estados de Incidencia (usar los nombres que ya existen en la BD)
INSERT INTO shared.estadoincidencia (id_estado_incidencia, nombre) VALUES
('10000000-0000-0000-0000-000000000001', 'Reportada'),
('20000000-0000-0000-0000-000000000002', 'En Investigacion'),
('30000000-0000-0000-0000-000000000003', 'Resuelta'),
('40000000-0000-0000-0000-000000000004', 'Cerrada'),
('50000000-0000-0000-0000-000000000005', 'Pendiente')
ON CONFLICT (nombre) DO NOTHING;

-- Verificar inserción
SELECT 'Tipos de Incidencia:' as tabla, COUNT(*) as total FROM shared.tipoincidencia
UNION ALL
SELECT 'Estados de Incidencia:' as tabla, COUNT(*) as total FROM shared.estadoincidencia;
