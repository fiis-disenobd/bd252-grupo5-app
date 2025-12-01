# Frontend - Módulo Monitoreo

## 1. Descripción general

El módulo de **Monitoreo** en el frontend concentra las pantallas para:

- Visualizar un **dashboard** general de operaciones y contenedores en tiempo real.
- Navegar al detalle de **operaciones monitoreadas**.
- Gestionar y analizar **incidencias**.
- Revisar y administrar **contenedores** monitoreados por sensores.
- Consultar **reportes** operativos y analíticos.
- Ver y revisar **notificaciones** generadas por sensores.
- Acceder a un **mapa** interactivo con la ubicación de recursos.

Todas estas vistas consumen la API del módulo `monitoreo` del backend (y entidades compartidas/documentos de otros módulos), documentado en `backend/src/monitoreo/README.md`.

---

## 2. Ubicación en el código

Carpeta principal del módulo en el frontend:

- `frontend/app/monitoreo/`

Archivos/páginas principales:

- `page.tsx`: **Dashboard principal de monitoreo** (KPIs, gráficos, alertas recientes, mapa embebido).
- `operaciones/page.tsx`: listado de operaciones monitoreadas, filtros y navegación al detalle.
- `operaciones/[id]/page.tsx`: detalle de una operación en particular.
- `operaciones/nueva/page.tsx`: creación de una nueva operación de monitoreo (según alcance implementado).
- `incidencias/page.tsx`: listado y filtros de incidencias.
- `incidencias/[id]/page.tsx`: detalle/seguimiento de una incidencia.
- `contenedores/page.tsx`: listado de contenedores (estado, sensores, ubicación, etc.).
- `contenedores/[id]/page.tsx`: detalle de contenedor.
- `contenedores/nuevo/page.tsx`: registro/configuración de contenedor (según alcance implementado).
- `reportes/page.tsx`: listado de reportes.
- `reportes/[id]/page.tsx`: detalle visual de un reporte.
- `reportes/analytics/page.tsx`: vistas analíticas y gráficas sobre reportes.
- `reportes/nuevo/page.tsx`: creación de reportes (según alcance implementado).
- `notificaciones/page.tsx`: listado de notificaciones de sensores.
- `notificaciones/[id]/page.tsx`: detalle de una notificación específica.
- `mapa/page.tsx`: mapa de monitoreo en modo pantalla completa.

Adicionalmente, se reutilizan componentes en:

- `components/monitoreo/*`: `MapHeader`, `MapaGPSDashboard`, y otros componentes visuales.

---

## 3. Dashboard principal (`/monitoreo`)

Archivo: `page.tsx`

### 3.1. Tecnologías y componentes

- Usa **Chart.js** (vía `react-chartjs-2`) para renderizar gráficos de barras y líneas:
  - Se registran escalas, elementos y plugins (`CategoryScale`, `LinearScale`, `BarElement`, `LineElement`, `Tooltip`, `Legend`, etc.).
- Usa un componente de mapa cargado dinámicamente:
  - `MapaGPSDashboard` importado con `next/dynamic` para desactivar SSR (`ssr: false`).
- Usa un encabezado específico de monitoreo:
  - `MapHeader` desde `components/monitoreo/MapHeader`.

La URL base de la API se toma de `NEXT_PUBLIC_API_URL` o por defecto `http://localhost:3001`.

### 3.2. Datos que consume desde el backend

En el `useEffect` inicial, el dashboard llama a varios endpoints del backend de monitoreo:

- `GET {API_URL}/monitoreo/operaciones/kpis`
  - KPIs agregados:
    - `operaciones_activas`.
    - `contenedores_transito`.
    - `alertas_pendientes`.
    - `entregas_hoy`.

- `GET {API_URL}/monitoreo/operaciones/por-estado`
  - Datos agregados por estado de operación para el **gráfico de barras** (ej. Programada, En Curso, Completada, Cancelada, Retrasada, etc.).

- `GET {API_URL}/monitoreo/sensores/notificaciones/por-dia?dias=7`
  - Serie temporal de notificaciones para el **gráfico de líneas** (cantidad de notificaciones por día en la última semana).

- `GET {API_URL}/monitoreo/sensores/notificaciones?limite=10`
  - Lista de notificaciones recientes de sensores.
  - Se mapean a un modelo de alerta interna con:
    - `id_notificacion`, `tipo_notificacion.nombre`, `sensor.tipo_sensor.nombre`, `sensor.contenedor.codigo`, `fecha_hora`, etc.

En caso de error al llamar al backend, el frontend rellena valores de ejemplo para no dejar la pantalla vacía.

### 3.3. Secciones de la UI

- **KPIs principales** (tarjetas):
  - Operaciones activas.
  - Contenedores en tránsito.
  - Alertas pendientes.
  - Entregas de hoy.

- **Gráfico de Barras**:
  - "Operaciones por estado".
  - Muestra barras por cada estado definido en `ESTADOS_OPERACION`.

- **Gráfico de Líneas**:
  - "Notificaciones por día (última semana)".
  - Muestra la evolución diaria del número de notificaciones.

- **Alertas recientes**:
  - Lista vertical de alertas, con estilo según severidad (`alta`, `media`, `baja`).
  - Severidad calculada en frontend según el nombre del tipo de notificación (contiene "crítica", "advertencia", etc.).

- **Mapa embebido**:
  - Muestra ubicaciones actuales de recursos (contenedores, buques, vehículos, etc.) sobre un mapa.
  - Incluye un link a `/monitoreo/mapa` para ver el mapa en pantalla completa.

---

## 4. Sección Operaciones (`/monitoreo/operaciones`)

Carpeta: `app/monitoreo/operaciones/`

Pantallas principales (a alto nivel):

- `page.tsx`:
  - Lista de **operaciones monitoreadas** con filtros por estado, fecha, tipo de operación, etc. (según implementación real del archivo).
  - Consume endpoints como `GET /monitoreo/operaciones` y/o `GET /monitoreo/operaciones?estado=...` documentados en el backend.
- `[id]/page.tsx`:
  - **Detalle de una operación**: muestra ruta, buque/vehículo, contenedores vinculados, estado actual, hitos, posibles incidencias asociadas, etc.
- `nueva/page.tsx` (si está implementado):
  - Flujo para registrar manualmente una nueva operación de monitoreo, vinculándola con una operación marítima o terrestre de base.

Esta sección se apoya fuertemente en las entidades `Operacion`, `EstadoOperacion`, `Buque`, `Vehiculo`, `Contenedor` y sus relaciones de backend.

---

## 5. Sección Incidencias (`/monitoreo/incidencias`)

Carpeta: `app/monitoreo/incidencias/`

Pantallas principales:

- `page.tsx`:
  - Vista de **lista de incidencias** con filtros por tipo, estado, severidad, rango de fechas, contenedor u operación.
  - Permite ordenar, ver estado de atención y navegar al detalle.
  - Consume principalmente `GET /monitoreo/incidencias` y endpoints afines.

- `[id]/page.tsx`:
  - **Detalle de una incidencia**: muestra datos completos de la incidencia, su línea de tiempo, el contenedor/operación afectada y el usuario que la registró.
  - Puede incluir acciones para actualizar estado, cerrar la incidencia o agregar comentarios, según lo implementado.

Esta sección está alineada con los endpoints del backend protegidos con `JwtAuthGuard` (por ejemplo, creación/actualización de incidencias). El frontend representa las reglas de negocio definidas allí (quién puede crear, estados válidos de cierre, etc.).

---

## 6. Sección Contenedores (`/monitoreo/contenedores`)

Carpeta: `app/monitoreo/contenedores/`

Pantallas principales:

- `page.tsx`:
  - Lista de **contenedores monitorizados**: código, tipo, estado (`Disponible`, `En Tránsito`, `En Operación`, etc.), posibles valores de última lectura de sensor.
  - Filtros por estado, tipo de contenedor, ruta o cliente (según implementación final de la página).
  - Consume endpoints como `GET /monitoreo/contenedores` y/o `GET /monitoreo/contenedores?estado=...`.

- `[id]/page.tsx`:
  - Detalle de un contenedor: historial de lecturas de sensores, incidencias asociadas, operaciones en las que participa, ubicación actual aproximada.

- `nuevo/page.tsx` (si está implementado):
  - Formulario para registrar un nuevo contenedor dentro del esquema de monitoreo (asociación con entidad `Contenedor` de `shared` y configuración inicial de sensores).

---

## 7. Sección Reportes (`/monitoreo/reportes`)

Carpeta: `app/monitoreo/reportes/`

Pantallas principales:

- `page.tsx`:
  - Lista de **reportes** generados (operativos, de incidencias, de desempeño de rutas, etc.).

- `[id]/page.tsx`:
  - Detalle de un reporte individual.

- `analytics/page.tsx`:
  - Vistas analíticas más avanzadas, reutilizando gráficos (Chart.js) para mostrar KPIs, tendencias y comparaciones.

- `nuevo/page.tsx`:
  - Pantalla para crear nuevos reportes configurando filtros (rango de fechas, cliente, ruta, tipo de operación, etc.).

Todos estos componentes consumen endpoints de `monitoreo` relacionados con `reportes` (ver backend `monitoreo` para los detalles exactos).

---

## 8. Sección Notificaciones (`/monitoreo/notificaciones`)

Carpeta: `app/monitoreo/notificaciones/`

Pantallas principales:

- `page.tsx`:
  - Tabla/listado de notificaciones generadas por **sensores**: temperatura, apertura de puertas, golpes, batería, etc.
  - Permite filtrar por tipo de sensor, severidad, contenedor u operación, y por rango de fechas.
  - Consume `GET /monitoreo/sensores/notificaciones` con distintos parámetros de filtro.

- `[id]/page.tsx`:
  - Detalle de una notificación puntual, mostrando la lectura exacta, ubicación y metadatos.

El dashboard principal (`/monitoreo`) ya muestra un resumen de notificaciones recientes; esta sección amplía el análisis de esos datos.

---

## 9. Mapa de monitoreo (`/monitoreo/mapa`)

Carpeta: `app/monitoreo/mapa/`

Pantalla principal:

- `page.tsx`:
  - Vista de mapa a **pantalla completa**, generalmente reutilizando el componente `MapaGPSDashboard` u otro similar basado en Leaflet/Mapbox.
  - Muestra posiciones de contenedores, buques, vehículos, puertos o zonas de monitoreo.
  - Puede incluir filtros en el mapa (por estado, módulo, tipo de recurso) y popups al hacer clic en los marcadores.

Esta pantalla se apoya en endpoints de monitoreo que devuelven coordenadas geográficas y metadatos de los recursos.

---

## 10. Relación con el backend de Monitoreo

- El módulo de frontend `monitoreo` es la **capa visual** del módulo backend `monitoreo`.
- Principales tipos de datos que se consumen:
  - Operaciones monitoreadas (estado, tipo, recursos asociados).
  - Incidencias (tipo, estado, severidad, usuario que registra).
  - Contenedores con información de sensores y estado logístico.
  - Notificaciones de sensores (alertas críticas, advertencias, información).
  - Reportes y agregaciones (KPIs, series temporales, reportes por periodo).
- El dashboard y las secciones internas respetan las **reglas de negocio** y estados definidos en el backend (por ejemplo, estados válidos de operación, condiciones para cerrar incidencias, etc.).

Esta documentación debe leerse junto con:

- `backend/src/monitoreo/README.md` (endpoints y reglas de negocio de monitoreo).
- `backend/src/shared/README.md` (entidades compartidas: `Operacion`, `Contenedor`, `EstadoOperacion`, `EstadoContenedor`, etc.).
