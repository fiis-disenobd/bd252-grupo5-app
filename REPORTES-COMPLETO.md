# 📋 CRUD DE REPORTES - DOCUMENTACIÓN COMPLETA

Implementación completa del CRUD de Reportes con **páginas separadas** (no modales).

---

## 🗂️ ESTRUCTURA DEL PROYECTO

### Backend (NestJS + TypeORM)

```
backend/src/monitoreo/
├── entities/
│   └── reporte.entity.ts          # Entidad Reporte (schema: monitoreo, table: reporte)
├── services/
│   └── reportes.service.ts        # Lógica de negocio completa
└── controllers/
    └── reportes.controller.ts     # Endpoints REST
```

### Frontend (Next.js 14 - App Router)

```
frontend/app/monitoreo/reportes/
├── page.tsx                       # 📄 Lista de reportes (READ)
├── nuevo/
│   └── page.tsx                   # ➕ Crear reporte (CREATE)
└── [id]/
    ├── page.tsx                   # 👁️ Ver reporte (READ ONE)
    └── editar/
        └── page.tsx               # ✏️ Editar reporte (UPDATE)
```

---

## 🔧 BACKEND

### 1. Entidad Reporte

**Archivo:** `backend/src/monitoreo/entities/reporte.entity.ts`

```typescript
@Entity({ schema: 'monitoreo', name: 'reporte' })
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id_reporte: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;  // Formato: RPT-YYMM-XXXX

  @Column({ type: 'date' })
  fecha_reporte: Date;

  @Column({ type: 'text' })
  detalle: string;
}
```

**Coincide con DDL:**
```sql
CREATE TABLE monitoreo.Reporte (
    id_reporte UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) NOT NULL UNIQUE,
    fecha_reporte DATE NOT NULL DEFAULT CURRENT_DATE,
    detalle TEXT NOT NULL
);
```

### 2. Servicio (ReportesService)

**Archivo:** `backend/src/monitoreo/services/reportes.service.ts`

#### Métodos Implementados:

- **`findAll(filtros)`** - Listar reportes con paginación y filtros
  - Filtros: `desde`, `hasta`, `limite`, `pagina`
  - Retorna: `{ reportes, total, pagina, total_paginas, por_pagina }`

- **`findOne(id)`** - Obtener un reporte por ID

- **`create(data)`** - Crear nuevo reporte
  - Genera código automático: `RPT-YYMM-XXXX`
  - `data`: `{ detalle, fecha_reporte? }`

- **`update(id, data)`** - Actualizar reporte
  - `data`: `{ detalle?, fecha_reporte? }`

- **`remove(id)`** - Eliminar reporte

- **`getEstadisticas()`** - Obtener estadísticas
  - Total de reportes
  - Reportes este mes
  - Último reporte generado

### 3. Controlador (ReportesController)

**Archivo:** `backend/src/monitoreo/controllers/reportes.controller.ts`

#### Endpoints:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/monitoreo/reportes` | Listar reportes con filtros |
| `GET` | `/monitoreo/reportes/estadisticas` | Obtener estadísticas |
| `GET` | `/monitoreo/reportes/:id` | Obtener un reporte |
| `POST` | `/monitoreo/reportes` | Crear nuevo reporte |
| `PUT` | `/monitoreo/reportes/:id` | Actualizar reporte |
| `DELETE` | `/monitoreo/reportes/:id` | Eliminar reporte |

---

## 🎨 FRONTEND

### 1. Lista de Reportes (`/reportes`)

**Archivo:** `frontend/app/monitoreo/reportes/page.tsx`

#### Características:
- ✅ Tarjetas de estadísticas (Total, Este Mes, Último Reporte)
- ✅ Filtros por rango de fechas
- ✅ Tabla con paginación
- ✅ Acciones: Ver, Editar, Eliminar
- ✅ Modal de confirmación para eliminar
- ✅ Botón "Nuevo Reporte"

#### Funcionalidades:
```typescript
- cargarDatos()          // Fetch reportes con filtros
- handleEliminar(id)     // Mostrar modal de confirmación
- confirmarEliminar()    // DELETE reporte
- limpiarFiltros()       // Resetear filtros
```

### 2. Crear Reporte (`/reportes/nuevo`)

**Archivo:** `frontend/app/monitoreo/reportes/nuevo/page.tsx`

#### Características:
- ✅ Formulario simple con 2 campos:
  - Fecha del reporte (date input)
  - Detalle (textarea)
- ✅ Validación requerida
- ✅ Contador de caracteres
- ✅ Botón "Crear Reporte"
- ✅ Redirección a página de detalle tras crear

#### Funcionalidades:
```typescript
- handleSubmit()  // POST nuevo reporte
- router.push()   // Redirigir a /reportes/{id}
```

### 3. Ver Reporte (`/reportes/[id]`)

**Archivo:** `frontend/app/monitoreo/reportes/[id]/page.tsx`

#### Características:
- ✅ Información completa del reporte
- ✅ Diseño de tarjeta con icono
- ✅ Campos mostrados:
  - ID del reporte
  - Código (RPT-YYMM-XXXX)
  - Fecha formateada
  - Detalle completo
- ✅ Botones: Volver, Editar
- ✅ Acciones adicionales: Imprimir, Exportar PDF

#### Funcionalidades:
```typescript
- useEffect()           // Fetch reporte por ID
- window.print()        // Imprimir
```

### 4. Editar Reporte (`/reportes/[id]/editar`)

**Archivo:** `frontend/app/monitoreo/reportes/[id]/editar/page.tsx`

#### Características:
- ✅ Formulario precargado con datos del reporte
- ✅ Código del reporte visible (no editable)
- ✅ Campos editables:
  - Fecha del reporte
  - Detalle
- ✅ Botón "Guardar Cambios"
- ✅ Redirección a página de detalle tras guardar

#### Funcionalidades:
```typescript
- useEffect()      // Fetch reporte y precargar form
- handleSubmit()   // PUT actualizar reporte
- router.push()    // Redirigir a /reportes/{id}
```

### 5. MapHeader Actualizado

**Archivo:** `frontend/components/monitoreo/MapHeader.tsx`

#### Cambios:
- ✅ Agregado en `getTitle()`:
  ```typescript
  if (pathname?.includes('/reportes')) 
    return { icon: 'description', title: 'Gestión de Reportes', subtitle: 'Generación y consulta' };
  ```
- ✅ Nuevo botón de navegación "Reportes"
- ✅ Scroll horizontal funcional

---

## 🧪 PRUEBAS

### 1. Pruebas de Backend

```bash
# Listar reportes
curl http://localhost:3001/monitoreo/reportes

# Con filtros
curl "http://localhost:3001/monitoreo/reportes?desde=2024-01-01&hasta=2024-12-31&pagina=1&limite=10"

# Obtener estadísticas
curl http://localhost:3001/monitoreo/reportes/estadisticas

# Obtener un reporte
curl http://localhost:3001/monitoreo/reportes/{id}

# Crear reporte
curl -X POST http://localhost:3001/monitoreo/reportes \
  -H "Content-Type: application/json" \
  -d '{
    "detalle": "Reporte de prueba",
    "fecha_reporte": "2024-11-18"
  }'

# Actualizar reporte
curl -X PUT http://localhost:3001/monitoreo/reportes/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "detalle": "Reporte actualizado"
  }'

# Eliminar reporte
curl -X DELETE http://localhost:3001/monitoreo/reportes/{id}
```

### 2. Pruebas de Frontend

1. **Navegar a Reportes**
   - Ir a `http://localhost:3000/monitoreo/reportes`
   - Verificar que se muestran las estadísticas
   - Verificar que se carga la tabla de reportes

2. **Crear Nuevo Reporte**
   - Click en "Nuevo Reporte"
   - Llenar fecha y detalle
   - Click en "Crear Reporte"
   - Verificar redirección a página de detalle

3. **Ver Reporte**
   - Click en icono de "Ver" (ojo)
   - Verificar que se muestra toda la información
   - Verificar formato de fecha

4. **Editar Reporte**
   - Desde la vista de detalle, click en "Editar"
   - Modificar detalle
   - Click en "Guardar Cambios"
   - Verificar redirección y cambios guardados

5. **Eliminar Reporte**
   - Click en icono de "Eliminar" (basurero)
   - Confirmar en modal
   - Verificar que el reporte se elimina de la lista

6. **Filtrar Reportes**
   - Seleccionar rango de fechas
   - Verificar que la tabla se actualiza
   - Click en "Limpiar Filtros"

7. **Paginación**
   - Si hay más de 10 reportes, verificar botones de paginación
   - Navegar entre páginas

---

## 📊 ESTRUCTURA DE RUTAS

```
/monitoreo/reportes              → Lista de reportes
/monitoreo/reportes/nuevo        → Crear nuevo reporte
/monitoreo/reportes/{id}         → Ver reporte específico
/monitoreo/reportes/{id}/editar  → Editar reporte específico
```

---

## 🎯 DIFERENCIAS CLAVE CON INCIDENCIAS

| Aspecto | Incidencias | Reportes |
|---------|-------------|----------|
| **UI Pattern** | Modales | Páginas separadas |
| **Navegación** | Todo en una página | Rutas independientes |
| **Crear/Editar** | Modal flotante | Páginas dedicadas |
| **Ver detalle** | No tiene vista dedicada | Página completa |
| **UX** | Rápido para ediciones | Mejor para lectura |

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Backend
- [x] Entidad `Reporte` correcta según DDL
- [x] Servicio con todos los métodos CRUD
- [x] Generación automática de código (RPT-YYMM-XXXX)
- [x] Controlador con todos los endpoints
- [x] Filtros y paginación
- [x] Estadísticas

### Frontend
- [x] Página de lista con tabla
- [x] Página de crear
- [x] Página de ver
- [x] Página de editar
- [x] Modal de confirmación para eliminar
- [x] Filtros por fecha
- [x] Paginación
- [x] Estadísticas
- [x] MapHeader actualizado

---

## 🚀 LISTO PARA USAR

El CRUD de Reportes está **100% funcional** con páginas separadas, respetando el DDL de PostgreSQL y siguiendo las mejores prácticas de Next.js 14 con App Router.

**Características principales:**
- ✅ Backend completo con NestJS
- ✅ Frontend con páginas dedicadas para cada operación
- ✅ Navegación fluida entre páginas
- ✅ Validaciones y manejo de errores
- ✅ UI moderna con TailwindCSS
- ✅ Responsive design
- ✅ Integración completa con MapHeader

---

**Fecha de implementación:** 18 de noviembre de 2025
**Stack:** NestJS + TypeORM + PostgreSQL + Next.js 14 + TailwindCSS
