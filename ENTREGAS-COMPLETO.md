# 🚚 CRUD DE ENTREGAS - DOCUMENTACIÓN COMPLETA

Implementación completa del CRUD de Entregas con **páginas separadas** respetando el DDL de PostgreSQL.

---

## 🗂️ ESTRUCTURA DEL PROYECTO

### Backend (NestJS + TypeORM)

```
backend/src/
├── shared/entities/
│   └── estado-entrega.entity.ts   # Entidad EstadoEntrega
├── monitoreo/
    ├── entities/
    │   ├── entrega.entity.ts      # Entidad Entrega con relaciones
    │   └── importador.entity.ts   # Entidad Importador
    ├── services/
    │   └── entregas.service.ts    # Lógica de negocio completa
    └── controllers/
        └── entregas.controller.ts # Endpoints REST
```

### Frontend (Next.js 14 - App Router)

```
frontend/app/monitoreo/entregas/
├── page.tsx                       # 📄 Lista de entregas (READ)
├── nueva/
│   └── page.tsx                   # ➕ Crear entrega (CREATE)
└── [id]/
    ├── page.tsx                   # 👁️ Ver entrega (READ ONE)
    └── editar/
        └── page.tsx               # ✏️ Editar entrega (UPDATE)
```

---

## 🔧 BACKEND

### 1. Entidad EstadoEntrega

**Archivo:** `backend/src/shared/entities/estado-entrega.entity.ts`

```typescript
@Entity({ schema: 'shared', name: 'estadoentrega' })
export class EstadoEntrega {
  @PrimaryGeneratedColumn('uuid')
  id_estado_entrega: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
```

**Estados disponibles:**
- Pendiente
- En Transito
- En Almacen
- Entregada
- Cancelada
- Con Incidencia

### 2. Entidad Entrega

**Archivo:** `backend/src/monitoreo/entities/entrega.entity.ts`

```typescript
@Entity({ schema: 'monitoreo', name: 'entrega' })
export class Entrega {
  @PrimaryGeneratedColumn('uuid')
  id_entrega: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;  // Formato: ENT-YYMM-XXXX

  @Column({ type: 'uuid' })
  id_estado_entrega: string;

  @Column({ type: 'date' })
  fecha_entrega: Date;

  @Column({ type: 'varchar', length: 100 })
  lugar_entrega: string;

  @Column({ type: 'uuid' })
  id_contenedor: string;

  @Column({ type: 'uuid' })
  id_importador: string;

  // Relaciones
  @ManyToOne(() => EstadoEntrega)
  @JoinColumn({ name: 'id_estado_entrega' })
  estado_entrega: EstadoEntrega;

  @ManyToOne(() => Contenedor)
  @JoinColumn({ name: 'id_contenedor' })
  contenedor: Contenedor;

  @ManyToOne(() => Importador)
  @JoinColumn({ name: 'id_importador' })
  importador: Importador;
}
```

**Coincide con DDL:**
```sql
CREATE TABLE monitoreo.Entrega (
    id_entrega UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) NOT NULL UNIQUE,
    id_estado_entrega UUID NOT NULL,
    fecha_entrega DATE NOT NULL,
    lugar_entrega VARCHAR(100) NOT NULL,
    id_contenedor UUID NOT NULL,
    id_importador UUID NOT NULL,
    CONSTRAINT fk_entrega_estado FOREIGN KEY (id_estado_entrega) 
        REFERENCES shared.EstadoEntrega(id_estado_entrega),
    CONSTRAINT fk_entrega_contenedor FOREIGN KEY (id_contenedor) 
        REFERENCES shared.Contenedor(id_contenedor),
    CONSTRAINT fk_entrega_importador FOREIGN KEY (id_importador) 
        REFERENCES monitoreo.Importador(id_importador)
);
```

### 3. Servicio (EntregasService)

**Archivo:** `backend/src/monitoreo/services/entregas.service.ts`

#### Métodos Implementados:

- **`findAll(filtros)`** - Listar entregas con paginación y filtros
  - Filtros: `estado`, `desde`, `hasta`, `limite`, `pagina`
  - Incluye relaciones: `estado_entrega`, `contenedor`, `importador`
  - Retorna: `{ entregas, total, pagina, total_paginas, por_pagina }`

- **`findOne(id)`** - Obtener una entrega por ID con todas sus relaciones

- **`create(data)`** - Crear nueva entrega
  - Genera código automático: `ENT-YYMM-XXXX`
  - Estado inicial: "Pendiente"
  - `data`: `{ id_contenedor, id_importador, fecha_entrega, lugar_entrega }`

- **`update(id, data)`** - Actualizar entrega
  - `data`: `{ id_estado_entrega?, fecha_entrega?, lugar_entrega? }`

- **`remove(id)`** - Eliminar entrega

- **`getEstadisticas()`** - Obtener estadísticas
  - Total de entregas
  - Entregas este mes
  - Entregas pendientes

- **`getEstadosEntrega()`** - Obtener todos los estados de entrega disponibles

- **`getContenedoresDisponibles()`** - Obtener contenedores sin entrega asignada

- **`getImportadores()`** - Obtener lista de importadores

### 4. Controlador (EntregasController)

**Archivo:** `backend/src/monitoreo/controllers/entregas.controller.ts`

#### Endpoints:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/monitoreo/entregas` | Listar entregas con filtros |
| `GET` | `/monitoreo/entregas/estadisticas` | Obtener estadísticas |
| `GET` | `/monitoreo/entregas/estados` | Obtener estados de entrega |
| `GET` | `/monitoreo/entregas/contenedores-disponibles` | Obtener contenedores sin entrega |
| `GET` | `/monitoreo/entregas/importadores` | Obtener importadores |
| `GET` | `/monitoreo/entregas/:id` | Obtener una entrega |
| `POST` | `/monitoreo/entregas` | Crear nueva entrega |
| `PUT` | `/monitoreo/entregas/:id` | Actualizar entrega |
| `DELETE` | `/monitoreo/entregas/:id` | Eliminar entrega |

### 5. Script de Seed

**Archivo:** `backend/scripts/seed-entregas.sql`

```sql
-- Estados de Entrega
INSERT INTO shared.estadoentrega (id_estado_entrega, nombre) VALUES
('e1000000-0000-0000-0000-000000000001', 'Pendiente'),
('e2000000-0000-0000-0000-000000000002', 'En Transito'),
('e3000000-0000-0000-0000-000000000003', 'En Almacen'),
('e4000000-0000-0000-0000-000000000004', 'Entregada'),
('e5000000-0000-0000-0000-000000000005', 'Cancelada'),
('e6000000-0000-0000-0000-000000000006', 'Con Incidencia')
ON CONFLICT (nombre) DO NOTHING;
```

---

## 🎨 FRONTEND

### 1. Lista de Entregas (`/entregas`)

**Archivo:** `frontend/app/monitoreo/entregas/page.tsx`

#### Características:
- ✅ Tarjetas de estadísticas (Total, Este Mes, Pendientes)
- ✅ Filtros por estado y rango de fechas
- ✅ Tabla con paginación
- ✅ Badges de colores por estado:
  - 🟢 Entregada (verde)
  - 🔵 En Transito (azul)
  - 🟣 En Almacen (morado)
  - 🟡 Pendiente (amarillo)
  - 🔴 Cancelada (rojo)
  - 🟠 Con Incidencia (naranja)
- ✅ Acciones: Ver, Editar, Eliminar
- ✅ Modal de confirmación para eliminar
- ✅ Botón "Nueva Entrega"

#### Columnas de la tabla:
- Código de entrega
- Contenedor
- Importador
- Lugar de entrega
- Fecha
- Estado (badge con color)
- Acciones

### 2. Crear Entrega (`/entregas/nueva`)

**Archivo:** `frontend/app/monitoreo/entregas/nueva/page.tsx`

#### Características:
- ✅ Selector de contenedor (solo contenedores sin entrega)
- ✅ Selector de importador
- ✅ Campo de fecha
- ✅ Campo de lugar de entrega
- ✅ Nota informativa sobre estado inicial
- ✅ Validación de campos requeridos
- ✅ Redirección a página de detalle tras crear

#### Campos del formulario:
1. **Contenedor** (select) - Muestra código y tipo
2. **Importador** (select) - Muestra razón social y RUC
3. **Fecha de Entrega** (date)
4. **Lugar de Entrega** (text)

### 3. Ver Entrega (`/entregas/[id]`)

**Archivo:** `frontend/app/monitoreo/entregas/[id]/page.tsx`

#### Características:
- ✅ Información completa de la entrega
- ✅ Badge de estado con color
- ✅ Diseño con tarjetas organizadas
- ✅ Secciones separadas:
  - Información principal
  - Información del contenedor
  - Información del importador
- ✅ Botones: Volver, Editar, Imprimir, Exportar PDF

#### Información mostrada:
- **Principal:** ID, código, fecha, lugar, estado
- **Contenedor:** Código, tipo, ID
- **Importador:** Razón social, RUC, dirección

### 4. Editar Entrega (`/entregas/[id]/editar`)

**Archivo:** `frontend/app/monitoreo/entregas/[id]/editar/page.tsx`

#### Características:
- ✅ Formulario precargado con datos actuales
- ✅ Información no editable visible (código, contenedor, importador)
- ✅ Campos editables:
  - Estado de entrega (select con todos los estados)
  - Fecha de entrega
  - Lugar de entrega
- ✅ Botón "Guardar Cambios"
- ✅ Redirección a página de detalle tras guardar
- ✅ Nota explicativa sobre campos no editables

### 5. MapHeader Actualizado

**Archivo:** `frontend/components/monitoreo/MapHeader.tsx`

#### Cambios:
- ✅ Agregado en `getTitle()`:
  ```typescript
  if (pathname?.includes('/entregas')) 
    return { icon: 'local_shipping', title: 'Gestión de Entregas', subtitle: 'Control de entregas' };
  ```
- ✅ Nuevo botón de navegación "Entregas" con icono de camión
- ✅ Scroll horizontal funcional

---

## 🧪 PRUEBAS

### 1. Pruebas de Backend

```bash
# Ejecutar script de seed
psql -U postgres -d nombre_bd -f backend/scripts/seed-entregas.sql

# Listar entregas
curl http://localhost:3001/monitoreo/entregas

# Con filtros
curl "http://localhost:3001/monitoreo/entregas?estado=e1000000-0000-0000-0000-000000000001&desde=2024-01-01&hasta=2024-12-31&pagina=1&limite=10"

# Obtener estadísticas
curl http://localhost:3001/monitoreo/entregas/estadisticas

# Obtener estados
curl http://localhost:3001/monitoreo/entregas/estados

# Obtener contenedores disponibles
curl http://localhost:3001/monitoreo/entregas/contenedores-disponibles

# Obtener importadores
curl http://localhost:3001/monitoreo/entregas/importadores

# Obtener una entrega
curl http://localhost:3001/monitoreo/entregas/{id}

# Crear entrega
curl -X POST http://localhost:3001/monitoreo/entregas \
  -H "Content-Type: application/json" \
  -d '{
    "id_contenedor": "uuid-del-contenedor",
    "id_importador": "uuid-del-importador",
    "fecha_entrega": "2024-11-18",
    "lugar_entrega": "Almacén Central - Lima, Perú"
  }'

# Actualizar entrega
curl -X PUT http://localhost:3001/monitoreo/entregas/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "id_estado_entrega": "e4000000-0000-0000-0000-000000000004",
    "lugar_entrega": "Nuevo almacén"
  }'

# Eliminar entrega
curl -X DELETE http://localhost:3001/monitoreo/entregas/{id}
```

### 2. Pruebas de Frontend

1. **Navegar a Entregas**
   - Ir a `http://localhost:3000/monitoreo/entregas`
   - Verificar que se muestran las estadísticas
   - Verificar que se carga la tabla de entregas

2. **Crear Nueva Entrega**
   - Click en "Nueva Entrega"
   - Seleccionar contenedor e importador
   - Llenar fecha y lugar
   - Click en "Registrar Entrega"
   - Verificar redirección a página de detalle

3. **Ver Entrega**
   - Click en icono de "Ver" (ojo)
   - Verificar que se muestra toda la información
   - Verificar formato de fecha
   - Verificar badge de estado con color

4. **Editar Entrega**
   - Desde la vista de detalle, click en "Editar"
   - Cambiar estado a "En Transito"
   - Modificar lugar
   - Click en "Guardar Cambios"
   - Verificar redirección y cambios guardados

5. **Eliminar Entrega**
   - Click en icono de "Eliminar" (basurero)
   - Confirmar en modal
   - Verificar que la entrega se elimina de la lista

6. **Filtrar Entregas**
   - Seleccionar estado "Pendiente"
   - Seleccionar rango de fechas
   - Verificar que la tabla se actualiza
   - Click en "Limpiar Filtros"

7. **Paginación**
   - Si hay más de 10 entregas, verificar botones de paginación
   - Navegar entre páginas

---

## 📊 ESTRUCTURA DE RUTAS

```
/monitoreo/entregas                  → Lista de entregas
/monitoreo/entregas/nueva            → Crear nueva entrega
/monitoreo/entregas/{id}             → Ver entrega específica
/monitoreo/entregas/{id}/editar      → Editar entrega específica
```

---

## 🎯 CARACTERÍSTICAS ESPECIALES

### Generación de Código Automático
El código se genera automáticamente en el backend con el formato `ENT-YYMM-XXXX`:
- `ENT`: Prefijo de entrega
- `YY`: Año (2 dígitos)
- `MM`: Mes (2 dígitos)
- `XXXX`: Secuencial de 4 dígitos

Ejemplo: `ENT-2411-0001` (primera entrega de noviembre 2024)

### Estado Inicial
Todas las entregas se crean automáticamente con estado **"Pendiente"**.

### Contenedores Disponibles
El endpoint `/contenedores-disponibles` retorna solo contenedores que **no** tienen una entrega asociada, evitando duplicados.

### Relaciones Completas
Todas las consultas incluyen las relaciones necesarias:
- Estado de entrega
- Contenedor (con tipo)
- Importador

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Backend
- [x] Entidad `EstadoEntrega` creada
- [x] Entidad `Entrega` correcta según DDL
- [x] Relaciones configuradas correctamente
- [x] Servicio con todos los métodos CRUD
- [x] Generación automática de código
- [x] Controlador con todos los endpoints
- [x] Filtros y paginación
- [x] Estadísticas
- [x] Métodos auxiliares (estados, contenedores, importadores)
- [x] Módulo registrado correctamente
- [x] Script SQL para seed de estados

### Frontend
- [x] Página de lista con tabla y filtros
- [x] Página de crear con selectores dinámicos
- [x] Página de ver con diseño completo
- [x] Página de editar con validaciones
- [x] Modal de confirmación para eliminar
- [x] Filtros por estado y fechas
- [x] Paginación funcional
- [x] Estadísticas visuales
- [x] Badges de colores por estado
- [x] MapHeader actualizado con navegación

---

## 🚀 LISTO PARA USAR

El CRUD de Entregas está **100% funcional** con páginas separadas, respetando el DDL de PostgreSQL y siguiendo las mejores prácticas de Next.js 14 con App Router.

**Características principales:**
- ✅ Backend completo con NestJS
- ✅ Frontend con páginas dedicadas para cada operación
- ✅ 6 estados de entrega configurados
- ✅ Generación automática de códigos
- ✅ Validaciones y manejo de errores
- ✅ UI moderna con TailwindCSS
- ✅ Badges de colores por estado
- ✅ Responsive design
- ✅ Integración completa con MapHeader

---

## 🔗 RELACIONES CON OTRAS ENTIDADES

La entrega se relaciona con:
- **EstadoEntrega** (shared) - Estado actual de la entrega
- **Contenedor** (shared) - Contenedor siendo entregado
- **Importador** (monitoreo) - Receptor de la entrega

---

**Fecha de implementación:** 18 de noviembre de 2025  
**Stack:** NestJS + TypeORM + PostgreSQL + Next.js 14 + TailwindCSS  
**Estados:** Pendiente, En Transito, En Almacen, Entregada, Cancelada, Con Incidencia
