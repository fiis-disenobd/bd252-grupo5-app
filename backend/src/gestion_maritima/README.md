# Módulo de Gestión Marítima

## 1. Descripción general

El módulo **Gestión Marítima** se encarga de administrar los procesos relacionados con las operaciones marítimas del sistema. Aquí se implementa la lógica de negocio vinculada a embarcaciones, rutas, viajes u otros elementos marítimos definidos en el proyecto.

Esta documentación describe:

- El propósito del módulo dentro de la aplicación.
- Sus principales funcionalidades y flujos.
- Los archivos de código que lo implementan.
- Los endpoints expuestos por su API.
- Su relación con otros módulos del backend y con el frontend.

---

## 2. Ubicación en el código

- Carpeta principal del módulo:
  - `backend/src/gestion_maritima/`

Dentro de esta carpeta se encuentran:

- **Módulo principal**
  - `gestion_maritima.module.ts`: declara el `GestionMaritimaModule`, registra controladores, servicios y entidades propias y compartidas.

- **Controladores** (manejan las peticiones HTTP):
  - `controllers/operacion-maritima.controller.ts`
  - `controllers/rutas-maritimas.controller.ts`
  - `controllers/operaciones-incidencias.controller.ts`
  - `controllers/conciliacion.controller.ts`
  - *(además de otros controladores de apoyo como `puertos`, `muelles`, `buques`, `estados`, `contenedores`, `hallazgos`, etc. declarados en el módulo)*.

- **Servicios** (contienen la lógica de negocio principal):
  - `services/operacion-maritima.service.ts`
  - `services/rutas-maritimas.service.ts`
  - `services/operaciones-incidencias.service.ts`
  - `services/conciliacion.service.ts`
  - *(junto con otros servicios de apoyo mencionados en `gestion_maritima.module.ts`).*

- **Entidades / Modelos** (tablas de la base de datos):
  - `entities/ruta-maritima.entity.ts`
  - `entities/puerto.entity.ts`
  - `entities/muelle.entity.ts`
  - `entities/operacion-ruta-maritima.entity.ts`
  - `entities/operacion-empleado.entity.ts`
  - `entities/operacion-contenedor.entity.ts`
  - `entities/buque-tripulante.entity.ts`
  - `entities/hallazgo.entity.ts`
  - `entities/inspeccion.entity.ts`

- **DTOs** (Data Transfer Objects, definen la forma de los datos de entrada/salida):
  - `dto/create-operacion-maritima.dto.ts`: define los campos necesarios para crear una operación marítima (código, fechas, estado, buque, ruta, muelles, tripulación, contenedores, etc.).

Esta sección sirve para cumplir con el requisito de **"Código por Módulo"** indicado por el profesor, listando los archivos más relevantes de la implementación.

---

## 3. Funcionalidades principales (descripción narrativa)

Desde el punto de vista funcional, el módulo de **Gestión Marítima** soporta los procesos centrales de operación en el dominio marítimo. Entre las funcionalidades más importantes se encuentran:

- **Gestión de rutas marítimas**
  - Consultar rutas marítimas entre dos puertos específicos, incluyendo distancia, duración, tarifa y puertos intermedios.
  - Consultar el detalle de una ruta marítima, con información de puertos de origen, destino e intermedios.

- **Gestión de operaciones marítimas**
  - Registrar una nueva operación marítima asociada a una ruta, un buque, tripulación y contenedores.
  - Consultar el listado paginado de operaciones marítimas, con información de código, cantidad de contenedores, estado de la operación, progreso del trayecto y buque asociado.

- **Gestión de incidencias asociadas a operaciones marítimas**
  - Consultar operaciones marítimas que presentan incidencias, con detalle de tipo de incidencia, severidad, fecha/hora, estado y usuario asociado.
  - Marcar una operación para investigación generando una inspección programada con tipo de inspección y prioridad.

- **Conciliación y análisis nocturno de operaciones**
  - Ejecutar un proceso batch de conciliación nocturna de operaciones marítimas.
  - Consultar correcciones aplicadas por el proceso de conciliación en un rango de fechas.
  - Exponer información agregada y de detalle que puede ser usada en dashboards y métricas de desempeño.

---

## 4. Flujos principales del módulo

En esta sección se describen, paso a paso, los flujos más importantes que soporta el módulo. La idea es que un lector pueda entender qué ocurre desde que el usuario usa la pantalla en el frontend hasta que el backend procesa la solicitud.

### 4.1. Flujo: Registrar nueva operación marítima

1. El usuario ingresa a la pantalla de **"Registro de operación marítima"** en el frontend.
2. Completa el formulario con los datos requeridos, entre ellos:
   - Código de la operación (`codigo`).
   - Fechas de inicio y, opcionalmente, fin (`fecha_inicio`, `fecha_fin`).
   - Estado inicial de la operación (`estado_nombre`).
   - Buque que realizará la operación (`id_buque`).
   - Ruta marítima seleccionada (`id_ruta_maritima`).
   - Muelles de origen y destino (`id_muelle_origen`, `id_muelle_destino`).
   - Tripulación y contenedores asociados (`tripulacion_ids`, `contenedor_ids`).
3. El frontend envía una petición `POST` al endpoint `POST /gestion-maritima/operaciones-maritimas` con el cuerpo definido por `CreateOperacionMaritimaDto`.
4. El **controlador** `OperacionMaritimaController` delega la lógica al **servicio** `OperacionMaritimaService`.
5. El servicio valida reglas de negocio, por ejemplo que la fecha de fin (si existe) sea posterior a la fecha de inicio.
6. Se registra la operación base en la tabla `shared.Operacion` y luego la operación marítima en `shared.OperacionMaritima`.
7. Se asocia la ruta marítima seleccionada mediante `gestion_maritima.OperacionRutaMaritima`.
8. Se registran las asignaciones de contenedores (`gestion_maritima.OperacionContenedor`) y tripulación (`gestion_maritima.OperacionEmpleado`).
9. Si todo es correcto, se confirma la transacción y el backend responde con los identificadores generados de la operación y de la operación marítima.

### 4.2. Flujo: Consultar operaciones marítimas registradas

1. El usuario accede a una pantalla de **"Listado de operaciones marítimas"**.
2. El frontend realiza una petición `GET /gestion-maritima/operaciones-maritimas?page={page}&limit={limit}`.
3. El servicio `OperacionMaritimaService` construye una consulta paginada sobre la entidad `OperacionMaritima`, incluyendo la relación con `Operacion`, `Buque` y `EstatusNavegacion`.
4. El servicio transforma el resultado en un formato amigable para la UI (código, contenedores, estado, progreso, buque, etc.).
5. El backend devuelve la lista paginada y datos de paginación (total, página, límite, total de páginas).

### 4.3. Flujo: Consultar rutas marítimas entre puertos

1. Desde una pantalla de búsqueda/monitoreo, el usuario selecciona puerto de origen y destino.
2. El frontend llama a `GET /monitoreo/rutas-maritimas?origen={id_origen}&destino={id_destino}&page={page}&limit={limit}`.
3. El servicio `RutasMaritimasService` ejecuta una consulta SQL que devuelve rutas, distancia, duración y tarifa entre los puertos indicados.
4. Para cada ruta, se consultan los puertos intermedios asociados a través de `RutaPuertoIntermedio`.
5. El backend devuelve un listado paginado con la información de rutas y sus puertos intermedios.

### 4.4. Flujo: Consultar operaciones con incidencias y marcarlas para investigación

1. El usuario ingresa a una pantalla donde se visualizan operaciones con incidencias.
2. El frontend realiza una petición `GET /gestion-maritima/operaciones-incidencias` con filtros opcionales de página, límite, búsqueda y severidad mínima.
3. El servicio `OperacionesIncidenciasService` obtiene las incidencias, agrupa por operación marítima y devuelve un listado con detalle de incidencias.
4. Si el usuario decide marcar una operación para investigación, el frontend envía un `POST /gestion-maritima/operaciones-incidencias/marcar-investigacion` con el código de la operación, tipo de inspección, prioridad, fecha, hora e identificador de usuario.
5. El servicio registra una nueva inspección en la tabla `gestion_maritima.Inspeccion`, asociada a la operación correspondiente.

### 4.5. Flujo: Conciliación nocturna y consulta de correcciones

1. Desde un proceso programado o una pantalla administrativa, se ejecuta `POST /gestion-maritima/conciliacion-nocturna` indicando opcionalmente una fecha de corte.
2. El servicio `ConciliacionService` invoca la función `gestion_maritima_audit.f_conciliacion_nocturna_operaciones` en la base de datos.
3. El proceso registra en tablas de auditoría las correcciones aplicadas sobre operaciones.
4. Posteriormente, el usuario puede consultar dichas correcciones mediante `GET /gestion-maritima/correcciones?fecha_desde=...&fecha_hasta=...`.
5. El servicio devuelve métricas como total de correcciones, correcciones por tipo y detalle de operaciones corregidas.

---

## 5. Pantallas relacionadas (frontend)

Aunque el detalle de las pantallas se documenta en el frontend, aquí se debe mencionar qué pantallas dependen de este módulo. Por ejemplo:

- Pantalla "Listado de operaciones marítimas".
- Pantalla "Registrar operación marítima".
- Pantalla "Detalle de operación marítima".

---

## 6. Endpoints del módulo (API)

A continuación se listan los endpoints principales expuestos por el módulo de Gestión Marítima (no exhaustivo, centrado en las operaciones más relevantes):

- **Operaciones marítimas** (`OperacionMaritimaController`)
  - `POST /gestion-maritima/operaciones-maritimas`
    - Crea una nueva operación marítima a partir de los datos enviados en el cuerpo (`CreateOperacionMaritimaDto`).
  - `GET /gestion-maritima/operaciones-maritimas?page={page}&limit={limit}`
    - Devuelve un listado paginado de operaciones marítimas con información resumida para la UI.

- **Rutas marítimas** (`RutasMaritimasController`)
  - `GET /monitoreo/rutas-maritimas?origen={id_origen}&destino={id_destino}&page={page}&limit={limit}`
    - Devuelve rutas marítimas entre un puerto de origen y uno de destino, incluyendo distancia, duración, tarifa y puertos intermedios.
  - `GET /monitoreo/rutas-maritimas/:id`
    - Devuelve el detalle de una ruta marítima específica, con puertos de origen, destino e intermedios.

- **Operaciones con incidencias** (`OperacionesIncidenciasController`)
  - `GET /gestion-maritima/operaciones-incidencias?search={texto}&severidadMin={n}&page={page}&limit={limit}`
    - Obtiene operaciones marítimas que tienen incidencias registradas, permitiendo filtrar por texto y severidad mínima.
  - `POST /gestion-maritima/operaciones-incidencias/marcar-investigacion`
    - Marca una operación para investigación, creando una inspección con tipo, prioridad, fecha/hora e identificador de usuario.

- **Conciliación y métricas** (`ConciliacionController`)
  - `POST /gestion-maritima/conciliacion-nocturna`
    - Ejecuta el proceso batch de conciliación nocturna de operaciones, opcionalmente para una fecha de corte específica.
  - `GET /gestion-maritima/correcciones?fecha_desde={yyyy-mm-dd}&fecha_hasta={yyyy-mm-dd}`
    - Devuelve estadísticas y detalle de correcciones aplicadas por el proceso de conciliación en el rango de fechas indicado.
  - `GET /gestion-maritima/dashboard/metricas`
    - Devuelve métricas agregadas para dashboards (implementado en `ConciliacionService`).
  - `GET /gestion-maritima/operaciones`
    - Devuelve el conjunto de operaciones que alimentan las vistas de monitoreo y conciliación.

---

## 7. Reglas de negocio y validaciones

Algunas de las reglas de negocio y validaciones aplicadas en el módulo son:

- **Consistencia de fechas en operaciones marítimas**
  - En la creación de operaciones marítimas (`OperacionMaritimaService.create`), si se envía una fecha de fin (`fecha_fin`), esta debe ser posterior a la fecha de inicio (`fecha_inicio`).
  - En caso contrario, se lanza una excepción de tipo `BadRequestException`.

- **Estados y estatus de navegación válidos**
  - El estado de la operación se obtiene desde `shared.EstadoOperacion` a partir del nombre enviado en el DTO (`estado_nombre`).
  - El estatus de navegación se obtiene desde `shared.EstatusNavegacion`, usando un valor por defecto (por ejemplo "En Puerto") si no se especifica.

- **Integridad en asignación de tripulación y contenedores**
  - Para cada contenedor asociado se inserta un registro en `gestion_maritima.OperacionContenedor`.
  - Para cada tripulante asociado se registra en `gestion_maritima.OperacionEmpleado`, vinculando la operación con el empleado correspondiente.

- **Manejo de errores y transacciones**
  - La creación de una operación marítima se realiza dentro de una transacción de base de datos. Si ocurre algún error en los pasos intermedios, se hace `rollback` y se lanza una `InternalServerErrorException`.
  - Los servicios de rutas marítimas, incidencias y conciliación capturan errores y registran mensajes en el log (`console.error`), devolviendo estructuras controladas o relanzando errores con mensajes claros.

---

## 8. Relación con otros módulos del backend

El módulo de Gestión Marítima se encuentra fuertemente integrado con otros módulos del backend:

- **Módulo `shared`**
  - Utiliza entidades compartidas como `Operacion`, `OperacionMaritima`, `Buque`, `Ruta`, `Contenedor`, `ContenedorMercancia`, `EstadoOperacion`, `EstatusNavegacion`, `Tripulante`, entre otras.
  - Estas entidades permiten que las operaciones marítimas se relacionen con rutas, estados, contenedores y tripulación de manera consistente en todo el sistema.

- **Módulo de Reservas (`gestion_reserva`)**
  - Comparte entidades como `Reserva`, `ReservaContenedor` y `Cliente`, lo que permite que las operaciones marítimas estén vinculadas a reservas de contenedores y clientes específicos.

- **Módulo de Monitoreo (`monitoreo`)**
  - Comparte entidades como `Operador`, `TipoIncidencia`, `Incidencia` y `EstadoIncidencia`, usadas para registrar y analizar incidencias asociadas a operaciones marítimas.
  - El endpoint de rutas marítimas se expone bajo el prefijo `monitoreo`, integrando la información de rutas en las vistas de monitoreo.

- **Módulo de Personal y Tripulación (`personal_tripulacion`)**
  - A través de `BuqueTripulante` y `Tripulante` se relaciona el personal embarcado con las operaciones marítimas registradas.

Gracias a estas relaciones, el módulo de Gestión Marítima actúa como núcleo de la operación marítima dentro del sistema, coordinando información de rutas, buques, tripulación, contenedores, incidencias y reservas.

---

## 9. Notas de implementación

- Framework: NestJS sobre Node.js y TypeScript.
- Patrón utilizado: módulos con controladores, servicios, entidades y DTOs.
- Dependencias o librerías específicas usadas en este módulo (si las hubiera).
