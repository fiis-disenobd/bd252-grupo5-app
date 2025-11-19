-- Script para insertar estados de entrega iniciales
-- Ejecutar en PostgreSQL después de crear las tablas

-- Estados de Entrega
INSERT INTO shared.estadoentrega (id_estado_entrega, nombre) VALUES
('e1000000-0000-0000-0000-000000000001', 'Pendiente'),
('e2000000-0000-0000-0000-000000000002', 'En Transito'),
('e3000000-0000-0000-0000-000000000003', 'En Almacen'),
('e4000000-0000-0000-0000-000000000004', 'Entregada'),
('e5000000-0000-0000-0000-000000000005', 'Cancelada'),
('e6000000-0000-0000-0000-000000000006', 'Con Incidencia')
ON CONFLICT (nombre) DO NOTHING;

-- Verificar inserción
SELECT COUNT(*) as total FROM shared.estadoentrega;
SELECT * FROM shared.estadoentrega;
