# Frontend - Módulo Gestión de Reservas

## 1. Descripción general

El módulo de **Gestión de Reservas** en el frontend permite a los usuarios:

- Crear nuevas reservas asignando cliente, contenedor, ruta marítima, buque y agente.
- Visualizar y filtrar el listado de reservas existentes.
- Analizar un **dashboard** con indicadores de reservas, contenedores, buques y rutas.
- Consultar información consolidada de **clientes** y su historial de reservas.
- Revisar las **tarifas** asociadas a las rutas marítimas.

Todas las pantallas consumen la API del backend del módulo `gestion_reserva` (y algunos endpoints de `monitoreo`) documentado en `backend/src/gestion_reserva/README.md`.

---

## 2. Ubicación en el código

Carpeta principal del módulo en el frontend:

- `frontend/app/gestion-reservas/`

Archivos/páginas principales:

- `layout.tsx`: layout específico del módulo, con navegación por pestañas.
- `page.tsx`: redirección automática al dashboard.
- `dashboard/page.tsx`: dashboard de reservas.
- `nueva-reserva/page.tsx`: formulario para crear nuevas reservas.
- `reservas/page.tsx`: listado y filtros de reservas.
- `clientes/page.tsx`: listado de clientes y su historial de reservas.
- `tarifas/page.tsx`: listado de rutas y tarifas.

---

## 3. Layout y navegación del módulo

### 3.1. Layout del módulo

Archivo: `layout.tsx`

Responsabilidades:

- Define un **layout común** para todas las subrutas de `/gestion-reservas`.
- Muestra el encabezado con logo Hapag-Lloyd y el título.
- Implementa una **barra de navegación tipo tabs** con enlaces a:
  - `/gestion-reservas/nueva-reserva` (Nueva Reserva).
  - `/gestion-reservas/reservas` (Reservas).
  - `/gestion-reservas/clientes` (Clientes).
  - `/gestion-reservas/tarifas` (Tarifas).
  - `/gestion-reservas/dashboard` (Dashboard).
- Usa `usePathname()` para resaltar la pestaña activa.

### 3.2. Redirección a Dashboard

Archivo: `page.tsx`

- Al ingresar a `/gestion-reservas` directamente, se redirige al usuario a `/gestion-reservas/dashboard` usando `useRouter().push`.

---

## 4. Pantalla Dashboard de Reservas (`/gestion-reservas/dashboard`)

Archivo: `dashboard/page.tsx`

### 4.1. Datos que consume

En el `useEffect` inicial se realizan varias llamadas `fetch` a la API del backend (puerto 3001):

- `GET http://localhost:3001/gestion-reserva/reservas/estadisticas`
  - Obtiene estadísticas agregadas (total de reservas, etc.).
- `GET http://localhost:3001/gestion-reserva/reservas`
  - Lista de reservas (usada para contar contenedores, clientes, etc.).
- `GET http://localhost:3001/gestion-reserva/buques-operaciones`
  - Buques con información de operaciones y porcentaje de trayecto.
- `GET http://localhost:3001/gestion-reserva/tarifas`
  - Rutas y tarifas (usadas como "rutas activas").
- `GET http://localhost:3001/gestion-reserva/clientes`
  - Lista de clientes con reservas.

Los datos se guardan en estados locales: `stats`, `reservas`, `buques`, `rutas`, `clientes` y se maneja un flag `loading`.

### 4.2. Secciones principales de la UI

- **Tarjetas de KPIs**:
  - Total Reservas.
  - Total Contenedores (calculado sumando `contenedores.length` en las reservas).
  - Buques en Operación (cantidad de buques devueltos).
  - Rutas Activas (cantidad de rutas con tarifa).

- **Buques en Operación y Progreso del Trayecto**:
  - Lista de buques con una barra de progreso (`porcentaje_trayecto`).
  - Permite ver más/menos buques con un botón de "Ver más / Ver menos" (`showAllBuques`).

- **Top Rutas Más Usadas**:
  - Ordena las rutas según la cantidad de reservas asociadas (`reservas.filter(r => r.id_ruta === ruta.id_ruta)`).
  - Permite ver más/menos rutas (`showAllRutas`).

- **Clientes con Más Reservas**:
  - Tabla que combina la lista de clientes con la cantidad de reservas por cliente.

### 4.3. Reglas de negocio visibles en UI

- Si no hay datos o están cargando, se muestran mensajes de estado (`Cargando...`, `No hay clientes/rutas/buques disponibles`).
- La pantalla combina **datos de varias entidades** para dar una vista consolidada al usuario de negocio.

---

## 5. Pantalla Nueva Reserva (`/gestion-reservas/nueva-reserva`)

Archivo: `nueva-reserva/page.tsx`

### 5.1. Datos que consume

En el `useEffect` inicial:

- `GET /gestion-reserva/clientes`
  - Para llenar el combo de clientes (`ruc_cliente`).
- `GET /monitoreo/contenedores?estado=Disponible`
  - Desde el módulo de monitoreo, para obtener contenedores disponibles.
- `GET /gestion-reserva/rutas-maritimas`
  - Lista de rutas marítimas, cada una con `id_ruta_maritima`, `puerto_origen`, `puerto_destino` e `id_ruta`.
- `GET /gestion-reserva/buques-operaciones`
  - Buques disponibles para asociar a la reserva.
- `GET /gestion-reserva/agentes`
  - Agentes de reservas disponibles.

### 5.2. Formulario y validaciones de UI

Campos principales del formulario (`formData`):

- Cliente (`ruc_cliente`): select obligatorio.
- Contenedor (`id_contenedor`): select obligatorio, valores provenientes de contenedores disponibles.
- Ruta (`id_ruta_maritima`): select obligatorio, muestra origen → destino.

Validaciones/controles en el `handleSubmit`:

- Verifica que existan **buques** y **agentes** disponibles; si no, muestra un `alert` y cancela.
- Busca la ruta seleccionada para obtener su `id_ruta`; si no la encuentra, muestra un `alert`.
- Genera un código de reserva único en frontend: `RES-<últimos 8 dígitos de timestamp>`.

### 5.3. Envío al backend

Construye un objeto `reservaData` con el formato esperado por el backend:

- `codigo`: código generado.
- `ruc_cliente`: según selección.
- `id_ruta`: obtenido de la ruta marítima.
- `id_buque`: toma el primer buque de la lista (`buques[0]`).
- `id_agente_reservas`: toma el primer agente (`agentes[0]`).
- `id_estado_reserva`: valor fijo (UUID) correspondiente al estado inicial de la reserva.
- `contenedores`: arreglo con al menos un contenedor (`id_contenedor`, `cantidad: 1`).

Se envía con:

- `POST http://localhost:3001/gestion-reserva/reservas`
  - Cabeceras: `Content-Type: application/json`.

Manejo de respuesta:

- Si `res.ok`: muestra `alert("Reserva creada exitosamente")` y redirige a `/gestion-reservas/reservas`.
- Si hay error: muestra `alert` con el mensaje devuelto por el backend o un mensaje genérico.

---

## 6. Pantalla Lista de Reservas (`/gestion-reservas/reservas`)

Archivo: `reservas/page.tsx`

### 6.1. Datos que consume

En carga inicial (`useEffect`):

- `GET /gestion-reserva/clientes`
  - Para popular el combo de clientes.
- `GET /gestion-reserva/estados-reserva`
  - Lista de estados de reserva (Confirmada, Completada, Cancelada, etc.).
- `GET /gestion-reserva/reservas`
  - Lista completa de reservas (por defecto).

### 6.2. Búsqueda y filtros

- **Buscar por código de reserva**:
  - Campo de texto `searchTerm`.
  - Botón/Enter que dispara `handleSearchByCodigo`.
  - Si hay término de búsqueda:
    - `GET /gestion-reserva/reservas/codigo/{codigo}`.
    - Si encuentra, convierte la respuesta (objeto) a array y la muestra.
    - Si no, muestra tabla vacía.
  - Si no hay término, recarga todas las reservas (`GET /gestion-reserva/reservas`).

- **Filtro por cliente** (`filterCliente`):
  - Combo que al cambiar llama a `handleFilterByCliente`.
  - Construye URL:
    - `GET /gestion-reserva/reservas` o `GET /gestion-reserva/reservas?ruc_cliente={ruc}`.

- **Filtros locales por fecha y estado**:
  - Fecha desde (`filterFechaDesde`) y hasta (`filterFechaHasta`): filtra en frontend usando `fecha_registro`.
  - Estado (`filterEstado`): compara contra `r.estado_reserva.id_estado_reserva`.

- **Limpiar filtros**:
  - Botón que limpia todos los estados de filtro y recarga las reservas (`GET /gestion-reserva/reservas`).

### 6.3. Tabla de resultados

- Muestra columnas:
  - Código Reserva.
  - Cliente (razón social).
  - Fecha de registro (formateada `es-PE`).
  - Estado (badge de color según `getEstadoBadge`).

- La tabla maneja estados:
  - Cargando.
  - Sin resultados.
  - Lista filtrada.

---

## 7. Pantalla Gestión de Clientes (`/gestion-reservas/clientes`)

Archivo: `clientes/page.tsx`

### 7.1. Datos que consume

En el `useEffect` inicial:

- `GET /gestion-reserva/clientes`
  - Lista de todos los clientes (RUC, razón social, etc.).
  - Selecciona el primero como cliente activo por defecto.
- `GET /gestion-reserva/reservas`
  - Todas las reservas para calcular historial y estado de clientes.

### 7.2. Funcionalidad de la UI

- Campo de **búsqueda por nombre o RUC** filtra `clientes` en frontend.
- Tabla de clientes que muestra:
  - Nombre (razón social).
  - RUC.
  - Estado del cliente (Activo/Inactivo) calculado:
    - Activo si tiene reservas con estado "En Proceso" o "Confirmada".
  - Fecha de la última reserva (derivada de `fecha_registro`).

- Al hacer clic en un cliente se selecciona (`selectedCliente`) y se muestra su **historial de reservas**:
  - Código, fecha y estado (presentado como badge).

---

## 8. Pantalla Gestión de Tarifas (`/gestion-reservas/tarifas`)

Archivo: `tarifas/page.tsx`

### 8.1. Datos que consume

- `GET /gestion-reserva/tarifas`
  - Lista de rutas con su `codigo`, `puerto_origen`, `puerto_destino`, `duracion` y `tarifa`.

### 8.2. UI y reglas de presentación

- Muestra una tabla con columnas:
  - Código de Ruta.
  - Ruta (origen → destino).
  - Duración en días.
  - Tarifa (formateada en dólares con 2 decimales y locale `es-PE`).

- Maneja estados:
  - Cargando.
  - Sin tarifas disponibles.
  - Lista de rutas.

---

## 9. Relación con el backend

- Todas las pantallas consumen endpoints del módulo `gestion_reserva` documentado en el backend.
- La pantalla **Nueva Reserva** respeta el formato esperado por el endpoint `POST /gestion-reserva/reservas` (código, cliente, ruta, buque, agente, estado y contenedores).
- Los listados (reservas, clientes, tarifas, dashboard) son capas de presentación sobre consultas expuestas por el backend (`/clientes`, `/reservas`, `/estadisticas`, `/buques-operaciones`, `/rutas-maritimas`, `/tarifas`, `/agentes`, `/estados-reserva`).
- Se complementa con el módulo `monitoreo` para obtener contenedores disponibles.

Esta documentación debe leerse en conjunto con:

- `backend/src/gestion_reserva/README.md` (reglas de negocio y endpoints).
- `backend/src/shared/README.md` (entidades compartidas: clientes, rutas, contenedores, estados, etc.).
