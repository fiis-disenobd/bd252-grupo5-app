-- Script para insertar datos de mercancía en ContenedorMercancia
-- Asocia tipos de mercancía a los primeros 30 contenedores

DO $$
DECLARE
    contenedor_record RECORD;
    tipos_mercancia TEXT[] := ARRAY['Electrónicos', 'Alimentos Congelados', 'Químicos', 'Frutas', 'Textiles', 'Maquinaria', 'Automóviles'];
    tipo_index INT := 1;
BEGIN
    -- Iteramos sobre los primeros 30 contenedores
    FOR contenedor_record IN 
        SELECT id_contenedor 
        FROM shared.contenedor 
        ORDER BY codigo 
        LIMIT 30
    LOOP
        -- Insertamos un tipo de mercancía para cada contenedor
        INSERT INTO shared.contenedormercancia (id_contenedor, tipo_mercancia)
        VALUES (contenedor_record.id_contenedor, tipos_mercancia[tipo_index])
        ON CONFLICT (id_contenedor, tipo_mercancia) DO NOTHING;
        
        -- Rotamos entre los tipos de mercancía
        tipo_index := tipo_index + 1;
        IF tipo_index > array_length(tipos_mercancia, 1) THEN
            tipo_index := 1;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Datos de mercancía insertados correctamente';
END $$;

-- Verificar los datos insertados
SELECT 
    c.codigo AS contenedor_codigo,
    cm.tipo_mercancia
FROM shared.contenedormercancia cm
JOIN shared.contenedor c ON c.id_contenedor = cm.id_contenedor
ORDER BY c.codigo
LIMIT 10;
