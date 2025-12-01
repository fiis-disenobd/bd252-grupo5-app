# Módulo de Monitoreo

## 1. Descripción general

El módulo de **Monitoreo** se encarga de supervisar en tiempo real y de forma histórica las operaciones del sistema, así como las incidencias, reportes, recursos y métricas clave.

Este módulo centraliza:

- La visualización del estado actual de las operaciones (marítimas y terrestres).
- La gestión de incidencias asociadas a operaciones y usuarios.
- La generación de reportes a partir de incidencias, operaciones y notificaciones de sensores.
- La consulta de recursos operativos (operadores, buques, vehículos, rutas, puertos, etc.).
- La obtención de indicadores KPI y estadísticas para dashboards.

---

## 2. Ubicación en el código

- Carpeta principal del módulo:
  - `backend/src/monitoreo/`

Dentro de esta carpeta se encuentran:

- **Módulo principal**
  - `monitoreo.module.ts`: declara el `MonitoreoModule`, registra controladores, servicios y entidades propias y compartidas.

- **Controladores** (manejan las peticiones HTTP principales):
  - `controllers/operaciones.controller.ts`
  - `controllers/incidencias.controller.ts`
  - `controllers/reportes.controller.ts`
  - `controllers/recursos.controller.ts`
  - *(además de otros controladores auxiliares como `contenedores`, `sensores`, `gps`, `entregas`, etc. registrados en el módulo).* 

- **Servicios** (contienen la lógica de negocio principal):
  - `services/operaciones.service.ts`
  - `services/incidencias.service.ts`
  - `services/reportes.service.ts`
  - `services/recursos.service.ts`
  - *(además de otros servicios de apoyo como `contenedores`, `sensores`, `gps`, `entregas`, etc.).*

- **Entidades / Modelos** relevantes del módulo:
  - `entities/operacion-monitoreo.entity.ts`: relación 1 a 1 con `shared.Operacion` para marcar operaciones que se monitorean.
  - `entities/operador.entity.ts`: define al operador de monitoreo y su relación con `Empleado`.
  - `entities/incidencia.entity.ts`: representación de incidencias asociadas a operaciones, tipos, estados y usuarios.
  - `entities/reporte.entity.ts`, `entities/incidencia-reporte.entity.ts`: reportes generados a partir de incidencias y relaciones entre ambos.
  - `entities/notificacion.entity.ts`, `entities/entrega.entity.ts`: entidades relacionadas con notificaciones de sensores y entregas.

- **DTOs** relevantes (en `dto/` y en servicios):
  - `dto/create-operacion.dto.ts`: datos para crear una operación monitoreada.
  - Tipos `CreateIncidenciaDto`, `UpdateIncidenciaDto`, `CreateReporteDto`, `UpdateReporteDto` definidos en los servicios correspondientes.

Esta sección sirve para cumplir con el requisito de **"Código por Módulo"**, listando los archivos más relevantes de Monitoreo.

---

## 3. Funcionalidades principales (descripción narrativa)

El módulo **Monitoreo** proporciona una vista transversal del estado de las operaciones del sistema, incluyendo:

- **Monitoreo de operaciones**
  - Listar operaciones con su estado actual (En Curso, En Espera, Completada, etc.).
  - Ver información consolidada de cada operación: operador asignado, buque, vehículo y cantidad de contenedores.
  - Crear nuevas operaciones (para fines de simulación o demo).
  - Actualizar y finalizar operaciones.

- **Gestión de incidencias**
  - Registrar incidencias asociadas a una operación.
  - Consultar incidencias con filtros y estadísticas.
  - Actualizar el estado y la información de una incidencia.
  - Eliminar incidencias si es necesario.

- **Gestión de reportes**
  - Crear reportes manuales.
  - Crear reportes a partir de operaciones e incidencias.
  - Crear reportes a partir de notificaciones de sensores de contenedores.
  - Consultar, actualizar y eliminar reportes.
  - Ejecutar procesos batch analíticos para cierre diario o de rangos de días.

- **Recursos para monitoreo**
  - Consultar estados de operación disponibles.
  - Listar operadores de monitoreo y su información básica.
  - Consultar vehículos disponibles.
  - Consultar buques disponibles.
  - Consultar puertos, muelles y rutas marítimas para apoyar la visualización y planificación.

- **Métricas e indicadores**
  - Obtener KPIs de operaciones activas, contenedores en tránsito, alertas recientes, etc.
  - Obtener estadísticas y resúmenes analíticos desde esquemas de auditoría/analytics.

---

## 4. Flujos principales del módulo

### 4.1. Flujo: Monitorear operaciones en tiempo real

1. El usuario (operador) accede a la pantalla de **"Monitoreo de operaciones"** en el frontend.
2. El frontend llama a `GET /monitoreo/operaciones?estado={opcional}` para obtener la lista de operaciones filtradas por estado o todas si no se indica.
3. El servicio `OperacionesService.findAll` ejecuta una consulta sobre `shared.operacion` unida con `shared.estadooperacion`.
4. Para cada operación, se enriquece la información con:
   - Operador asignado (vía `gestion_maritima.operacionempleado` y `monitoreo.operador`).
   - Buque asociado (vía `shared.OperacionMaritima`).
   - Vehículo asociado (vía `operaciones_terrestres` si aplica).
   - Cantidad de contenedores asignados (vía `gestion_maritima.OperacionContenedor`).
5. El backend devuelve una lista de operaciones con toda esta información lista para mostrarse en la UI de monitoreo.

### 4.2. Flujo: Ver detalle de una operación monitoreada

1. Desde la lista de operaciones, el usuario selecciona una operación.
2. El frontend llama a `GET /monitoreo/operaciones/:id`.
3. `OperacionesService.findOne` obtiene la operación y su estado actual.
4. Se obtienen además:
   - Datos del operador (nombre y apellido del empleado asociado).
   - Información del buque y/o vehículo.
   - Lista de contenedores involucrados (código y tipo).
5. El backend responde con un objeto detallado para la pantalla de detalle.

### 4.3. Flujo: Registrar y gestionar incidencias

1. Desde la vista de una operación o una pantalla de incidencias, el usuario registra una incidencia.
2. El frontend envía `POST /monitoreo/incidencias` con los datos de la incidencia y el JWT del usuario.
3. `IncidenciasController` aplica `JwtAuthGuard` y extrae `id_usuario` del token.
4. `IncidenciasService.create` valida y registra la incidencia enlazándola a:
   - La operación (`id_operacion`).
   - El tipo de incidencia (`id_tipo_incidencia`).
   - El estado inicial (`id_estado_incidencia`).
   - El usuario que la registró.
5. Para consultar incidencias y sus estadísticas:
   - `GET /monitoreo/incidencias` con filtros.
   - `GET /monitoreo/incidencias/estadisticas` para métricas globales.
   - `GET /monitoreo/incidencias/tipos` y `GET /monitoreo/incidencias/estados` para catálogos.

### 4.4. Flujo: Crear reportes de monitoreo

1. Desde una pantalla de reportes, el usuario puede:
   - Listar reportes: `GET /monitoreo/reportes`.
   - Ver estadísticas: `GET /monitoreo/reportes/estadisticas`.
   - Ver resumen analítico: `GET /monitoreo/reportes/analytics/resumen`.
2. Para crear un reporte manual se usa `POST /monitoreo/reportes` enviando `CreateReporteDto`.
3. Para crear un reporte a partir de una operación e incidencias:
   - `POST /monitoreo/reportes/operacion/:id` con lista de incidencias y un comentario.
4. Para crear un reporte a partir de notificaciones de sensores de un contenedor:
   - `POST /monitoreo/reportes/contenedor/:id` con lista de notificaciones y comentario.
5. `ReportesService` maneja la creación de reportes y las relaciones con incidencias (`IncidenciaReporte`) y notificaciones.

### 4.5. Flujos de recursos para planificación

1. Desde pantallas de planificación o asignación, el frontend llama a `GET /monitoreo/recursos/...` para obtener catálogos:
   - Estados de operación (`/estados`).
   - Operadores (`/operadores`).
   - Vehículos disponibles (`/vehiculos`).
   - Buques disponibles (`/buques` y `/buques/:id`).
   - Puertos (`/puertos`) y muelles por puerto (`/muelles?puertoId=...`).
   - Rutas marítimas entre puertos (`/rutas-maritimas?origen=...&destino=...`) y detalle de una ruta (`/rutas-maritimas/:id`).
2. `RecursosService` se encarga de obtener los datos de las entidades compartidas y de gestión marítima necesarias para alimentar estas vistas.

---

## 5. Pantallas relacionadas (frontend)

Algunas pantallas típicamente asociadas a este módulo son:

- Pantalla **"Monitoreo de operaciones"** (lista y detalle).
- Pantalla **"Gestión de incidencias"** (lista, registro, actualización).
- Pantalla **"Reportes de monitoreo"** (lista, creación, estadísticas y analytics).
- Pantallas de **"Recursos"** (operadores, vehículos, buques, puertos, rutas, etc.) para apoyar la operación.
- Dashboards con **KPIs** (operaciones activas, incidencias, contenedores en tránsito, alertas recientes, etc.).

---

## 6. Endpoints del módulo (API)

A continuación, se listan los endpoints principales (no exhaustivo) del módulo de Monitoreo:

- **Operaciones** (`OperacionesController`)
  - `GET /monitoreo/operaciones?estado={nombre}`
    - Lista operaciones filtradas por estado (opcional).
  - `GET /monitoreo/operaciones/kpis`
    - Devuelve métricas clave de operaciones (operaciones activas, contenedores en tránsito, alertas recientes, etc.).
  - `GET /monitoreo/operaciones/por-estado`
    - Devuelve un resumen de operaciones agrupadas por estado.
  - `GET /monitoreo/operaciones/:id`
    - Devuelve el detalle de una operación monitoreada.
  - `POST /monitoreo/operaciones`
    - Crea una nueva operación de monitoreo (incluyendo, opcionalmente, buque, operador y contenedores).
  - `PATCH /monitoreo/operaciones/:id`
    - Actualiza campos básicos de una operación.
  - `PATCH /monitoreo/operaciones/:id/finalizar`
    - Marca una operación como finalizada, actualizando estado y fecha de fin.
  - `DELETE /monitoreo/operaciones/:id`
    - Elimina una operación y sus relaciones asociadas (empleados, contenedores, operación marítima, etc.).

- **Incidencias** (`IncidenciasController`)
  - `GET /monitoreo/incidencias`
    - Lista incidencias con filtros.
  - `GET /monitoreo/incidencias/estadisticas`
    - Devuelve estadísticas de incidencias.
  - `GET /monitoreo/incidencias/tipos`
    - Lista tipos de incidencia.
  - `GET /monitoreo/incidencias/estados`
    - Lista estados de incidencia.
  - `GET /monitoreo/incidencias/:id`
    - Devuelve el detalle de una incidencia.
  - `POST /monitoreo/incidencias` (protegido con `JwtAuthGuard`)
    - Crea una nueva incidencia asociada a una operación y un usuario.
  - `PUT /monitoreo/incidencias/:id` (protegido)
    - Actualiza una incidencia existente.
  - `DELETE /monitoreo/incidencias/:id` (protegido)
    - Elimina una incidencia.

- **Reportes** (`ReportesController`)
  - `GET /monitoreo/reportes`
    - Lista reportes con paginación y filtros de fecha.
  - `GET /monitoreo/reportes/estadisticas`
    - Devuelve estadísticas sobre reportes.
  - `GET /monitoreo/reportes/analytics/resumen`
    - Devuelve un resumen analítico basado en procesos batch.
  - `POST /monitoreo/reportes/cierre-diario`
    - Ejecuta el proceso batch de cierre diario analítico para una fecha de corte.
  - `POST /monitoreo/reportes/cierre-rango-120`
    - Ejecuta el proceso batch analítico para los últimos 120 días.
  - `GET /monitoreo/reportes/:id`
    - Devuelve el detalle de un reporte.
  - `POST /monitoreo/reportes`
    - Crea un reporte manual.
  - `POST /monitoreo/reportes/operacion/:id`
    - Crea un reporte a partir de una operación y un conjunto de incidencias.
  - `POST /monitoreo/reportes/contenedor/:id`
    - Crea un reporte a partir de notificaciones de sensores de un contenedor.
  - `PUT /monitoreo/reportes/:id`
    - Actualiza un reporte existente.
  - `DELETE /monitoreo/reportes/:id`
    - Elimina un reporte.

- **Recursos** (`RecursosController`)
  - `GET /monitoreo/estados`
    - Devuelve estados de operación.
  - `GET /monitoreo/operadores`
    - Devuelve operadores de monitoreo con su empleado asociado.
  - `GET /monitoreo/vehiculos`
    - Devuelve vehículos disponibles.
  - `GET /monitoreo/buques`
    - Devuelve buques disponibles.
  - `GET /monitoreo/buques/:id`
    - Devuelve detalle de un buque específico.
  - `GET /monitoreo/puertos`
    - Devuelve puertos registrados.
  - `GET /monitoreo/muelles?puertoId={id}`
    - Devuelve muelles asociados a un puerto.
  - `GET /monitoreo/rutas-maritimas?origen={id_origen}&destino={id_destino}`
    - Devuelve rutas marítimas entre dos puertos.
  - `GET /monitoreo/rutas-maritimas/:id`
    - Devuelve detalle de una ruta marítima.

---

## 7. Reglas de negocio y validaciones

Algunas reglas de negocio clave del módulo de Monitoreo son:

- **Estados válidos para finalizar operaciones**
  - Solo se pueden finalizar operaciones cuyo estado actual sea "En Curso" o "En Espera"; en caso contrario se lanza una `BadRequestException`.

- **Configuración de estados y estatus**
  - Para finalizar operaciones, se requiere que exista el estado "Completada" en `EstadoOperacion`.
  - Para operaciones marítimas generadas desde Monitoreo, se selecciona un estatus de navegación por defecto (primer registro disponible).

- **Integridad en asignación de recursos**
  - Las operaciones se relacionan con operadores, buques, vehículos y contenedores mediante entidades intermedias.
  - Al eliminar una operación se eliminan previamente las relaciones para no violar restricciones de integridad referencial.

- **Seguridad y autenticación**
  - Las operaciones sobre incidencias (crear, actualizar, eliminar) están protegidas con `JwtAuthGuard`.
  - El `id_usuario` se obtiene a partir del token JWT para registrar quién crea o modifica una incidencia.

- **Procesos batch y analytics**
  - La ejecución de procesos de cierre diario o de rango de días se realiza mediante funciones SQL en esquemas analíticos (`monitoreo_analytics`).

---

## 8. Relación con otros módulos del backend

El módulo de Monitoreo está fuertemente integrado con otros módulos:

- **Módulo `shared`**
  - Utiliza `Operacion`, `EstadoOperacion`, `Contenedor`, `Vehiculo`, `Buque`, `Ruta`, `Usuario`, entre otras entidades compartidas.

- **Módulo de Gestión Marítima (`gestion_maritima`)**
  - Usa entidades como `OperacionEmpleado`, `OperacionContenedor`, `Puerto`, `Muelle`, `RutaMaritima`, `RutaPuertoIntermedio` para enriquecer la información de monitoreo.

- **Módulo de Operaciones Terrestres (`operaciones_terrestres`)**
  - Se apoya en `OperacionTerrestre` y `OperacionTerrestreDetalle` para mostrar la parte terrestre de las operaciones.

- **Módulo de Autenticación (`auth`)**
  - Utiliza los mecanismos de autenticación y autorización para proteger operaciones sensibles, especialmente en el manejo de incidencias.

Gracias a estas relaciones, el módulo de Monitoreo actúa como el **"tablero de control"** de la solución, integrando datos de distintos módulos para ofrecer una vista consolidada del estado de las operaciones.

---

## 9. Notas de implementación

- Framework: NestJS sobre Node.js y TypeScript.
- Uso de TypeORM con repositorios e `QueryBuilder`, así como consultas SQL nativas para casos específicos.
- Manejo de paginación y filtros en listados de operaciones, incidencias y reportes.
- Manejo de procesos batch mediante funciones SQL en esquemas analíticos.
- Integración con JWT y guards para protección de endpoints sensibles.
