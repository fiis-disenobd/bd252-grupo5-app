# Frontend - Módulo Operaciones Marítimas

## 1. Descripción general

El módulo de **Operaciones Marítimas** en el frontend permite a los usuarios:

- Visualizar un **dashboard** de operaciones marítimas con métricas de conciliación y estado.
- Iniciar el flujo de **nueva operación marítima**, seleccionando buque, ruta, contenedores y tripulación.
- Seleccionar operaciones para **registrar incidencias** asociadas.
- Gestionar **inspecciones e hallazgos** relacionados con las operaciones.

Este módulo se apoya principalmente en los endpoints de backend de `gestion_maritima`, `monitoreo` (para algunos datos de buques) y servicios específicos de conciliación e inspecciones documentados en el backend.

---

## 2. Ubicación en el código

Carpeta principal del módulo en el frontend:

- `frontend/app/operaciones-maritimas/`

Archivos/páginas principales:

- `page.tsx`: menú principal del módulo (tarjetas de acciones).
- `dashboard/page.tsx`: dashboard de operaciones marítimas y conciliación.
- `nueva/page.tsx`: entrada al formulario de nueva operación marítima.
- `incidencias/page.tsx`: selección de operación para registrar incidencia.
- `incidencias/nueva/page.tsx`: formulario de nueva incidencia (no se detalla aquí pero se enlaza desde `incidencias/page.tsx`).
- `incidencias/gestion/page.tsx`: gestión de incidencias ya registradas (según implementación del archivo).
- `hallazgos/page.tsx`: listado de inspecciones y registro de hallazgos asociados.

Además, utiliza componentes y clientes de API en:

- `components/operaciones-maritimas/OperacionForm`.
- `lib/api/conciliacion`.
- `lib/api/operaciones-maritimas`.
- `lib/api/hallazgos`.

---

## 3. Menú principal del módulo (`/operaciones-maritimas`)

Archivo: `page.tsx`

- Muestra tarjetas de acción para cada flujo del módulo:
  - **Registro de Operaciones** → `/operaciones-maritimas/dashboard`.
  - **Nueva Operación Marítima** → `/operaciones-maritimas/nueva`.
  - **Registrar Incidencia** → `/operaciones-maritimas/incidencias`.
  - **Gestionar Inspecciones** → `/operaciones-maritimas/hallazgos`.
  - **Gestionar Incidencias** → `/operaciones-maritimas/incidencias/gestion`.
- Reutiliza `Header` común del frontend.

Sirve de **punto de entrada** al módulo y organiza la navegación para el usuario.

---

## 4. Dashboard de Operaciones Marítimas (`/operaciones-maritimas/dashboard`)

Archivo: `dashboard/page.tsx`

### 4.1. Datos que consume

Usa un cliente de API especializado:

- `conciliacionAPI` desde `@/lib/api/conciliacion` con los métodos:
  - `getMetricas()` → retorna `DashboardMetricas`.
  - `getOperaciones()` → retorna un arreglo de `OperacionMaritima`.
  - `ejecutarBatch()` → dispara un proceso batch de conciliación.

La carga inicial (`cargarDatos`) hace:

- `Promise.all([conciliacionAPI.getMetricas(), conciliacionAPI.getOperaciones()])`.
- Maneja estado de carga (`loading`) y errores con `alert` en caso de fallo.

### 4.2. KPIs y controles

- **KPIs principales** (`metricas.kpis`):
  - `total_operaciones` (últimos 30 días).
  - `operaciones_activas`.
  - `operaciones_finalizadas`.
  - `total_incidencias` e `incidencias_criticas`.
  - `correcciones_recientes` (últimos 7 días).
  - `intervencion_manual` (operaciones que requieren revisión).

- **Control de ejecución de conciliación**:
  - Botón "Ejecutar Conciliación" llama a `conciliacionAPI.ejecutarBatch()`.
  - Muestra confirmación previa (`window.confirm`) y recarga datos tras éxito.
  - Muestra mensaje de error si falla.

- Accesos rápidos:
  - Botón "Nueva Operación" → `/operaciones-maritimas/nueva`.
  - Botón "Hallazgos" → `/operaciones-maritimas/hallazgos`.

### 4.3. Tabla de operaciones

- Muestra lista paginada de `OperacionMaritima` con columnas:
  - Código de operación.
  - Buque (nombre y matrícula).
  - Estado.
  - Progreso (porcentaje de trayecto con barra visual).
  - Totales de incidencias y críticas.
  - Fecha de inicio.
  - Estado de **corrección** (si fue corregida, tipo de corrección, descripción).

- Implementa paginación en frontend con `itemsPerPage = 10`.
- Muestra mensaje si no hay operaciones en los últimos 30 días.

### 4.4. Uso relacionado con backend

- Representa el resultado de procesos de **conciliación nocturna** y correcciones aplicadas sobre las operaciones marítimas.
- Se apoya en consultas agregadas del backend y en banderas de corrección por operación.

---

## 5. Nueva Operación Marítima (`/operaciones-maritimas/nueva`)

Archivo: `nueva/page.tsx`

### 5.1. Flujo general

- Esta ruta actúa como **wrapper** para el componente `OperacionForm`:
  - Resuelve `searchParams` (Next.js App Router) para obtener parámetros de preselección:
    - `id_buque`, `routeId`, `routeCode`, `originName`, `destinationName`, `distance`, `duration`, `originDockCode`, `destinationDockCode`, `contenedores`, `tripulacion`, etc.

### 5.2. Datos que consume

- Si existe `id_buque` en `searchParams`:
  - Hace `GET http://localhost:3001/monitoreo/buques/{id_buque}` (sin caché) para obtener los detalles del buque.
  - Pasa el objeto `buque` al formulario.

### 5.3. Formulario de operación

- El componente `OperacionForm` (en `components/operaciones-maritimas/OperacionForm`) se encarga de:
  - Construir el formulario completo de operación marítima.
  - Utilizar parámetros opcionales (`searchParams`) para prellenar ruta, buque, contenedores y tripulación.
  - Enviar los datos al backend (`gestion_maritima`) para **crear la operación marítima**.

---

## 6. Seleccionar operación para incidencia (`/operaciones-maritimas/incidencias`)

Archivo: `incidencias/page.tsx`

### 6.1. Datos que consume

Utiliza `operacionesAPI` desde `@/lib/api/operaciones-maritimas` con:

- `getOperaciones(page, limit)` → devuelve `PaginatedResponse<OperacionMaritima>` con:
  - `data`: operaciones por página.
  - `total` y `totalPages`.

La pantalla:

- Carga operaciones en un `useEffect` inicial y cada vez que cambia `currentPage`.
- Maneja estados de `loading` y `error` con mensajes claros.

### 6.2. Funcionalidad de la UI

- Tabla con columnas:
  - Selector (radio) para elegir una operación.
  - Código de operación.
  - Nombre del buque.
  - Estado (badge con estilos según `statusBadgeStyles`).

- Búsqueda local por texto:
  - Filtra por código de operación o nombre de buque.

- Paginación:
  - Controles `«` / `»` y botones por página basados en `operationsData.totalPages`.

### 6.3. Flujo de registro de incidencia

- El usuario selecciona una operación (radio) → `selectedCode`.
- Botón "Registrar Incidencia":
  - Construye un `URLSearchParams` con `op=<code>`.
  - Redirige a `/operaciones-maritimas/incidencias/nueva?op=<code>` vía `router.push`.
- Así se inicia el formulario de nueva incidencia sobre una operación específica.

---

## 7. Gestión de inspecciones y hallazgos (`/operaciones-maritimas/hallazgos`)

Archivo: `hallazgos/page.tsx`

### 7.1. Datos que consume

Utiliza `hallazgosAPI` desde `@/lib/api/hallazgos`:

- `getInspecciones()`:
  - Devuelve inspecciones con campos como:
    - `id`, `type`, `date`, `time`, `priority`, `operationCode`, `inspectionCode`, `status`.
- `getTiposHallazgo()`:
  - Devuelve tipos de hallazgo disponibles (`id_tipo_hallazgo`, `nombre`).
- `createHallazgo()`:
  - Crea un nuevo hallazgo asociado a una inspección:
    - `id_tipo_hallazgo`, `nivel_gravedad`, `descripcion`, `accion_sugerida`, `id_inspeccion`.

### 7.2. Listado de inspecciones

- Muestra una tabla con inspecciones:
  - Tipo de inspección, fecha, hora, prioridad, código de operación, código de inspección, estado.
- Permite:
  - Búsqueda por código de inspección/operación o tipo.
  - Seleccionar una inspección (radio); se guarda `selectedId`.
  - Paginación local (`itemsPerPage = 5`).

### 7.3. Formulario de registro de hallazgos

- Formulario en la parte inferior:
  - Campos:
    - Tipo de Hallazgo (select con `tiposHallazgo`).
    - Nivel de Gravedad (1–5).
    - Descripción (textarea, requerido).
    - Acción sugerida (textarea, opcional).
  - Envía los datos a `hallazgosAPI.createHallazgo`.
  - Muestra mensajes de éxito o error con `alert`.

- El título del formulario indica la inspección seleccionada: `Inspección {inspectionCode}`.

---

## 8. Relación con el backend

- El módulo de frontend de **Operaciones Marítimas** se apoya principalmente en:
  - Backend `gestion_maritima` (creación y consulta de operaciones marítimas, estados, rutas, buques, contenedores).
  - Servicios de `conciliacion` para:
    - Métricas de corrección.
    - Ejecución de batch de conciliación.
  - Backend `monitoreo` para obtener detalles de buques (`/monitoreo/buques/{id}`) cuando se crea una nueva operación.
  - Backend de inspecciones y hallazgos (parte del contexto de operaciones marítimas/monitoreo) para `getInspecciones`, `getTiposHallazgo`, `createHallazgo`.

- La UI refleja las reglas de negocio implementadas en backend:
  - Estados de operación y su progreso.
  - Diferenciación de incidencias críticas vs. totales.
  - Necesidad de intervención manual tras procesos de conciliación.
  - Priorización de inspecciones y hallazgos (prioridad/nivel de gravedad).

Para detalles completos de los endpoints y reglas, revisar:

- `backend/src/gestion_maritima/README.md`.
- `backend/src/monitoreo/README.md`.
- `backend/src/shared/README.md` (entidades `Buque`, `Operacion`, `Contenedor`, etc.).
