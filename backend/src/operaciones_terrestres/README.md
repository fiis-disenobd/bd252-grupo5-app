# Módulo de Operaciones Terrestres

## 1. Descripción general

El módulo de **Operaciones Terrestres** modela las operaciones de transporte terrestre asociadas a las operaciones generales del sistema. Aunque en esta versión el módulo se concentra principalmente en las **entidades** (sin controladores/servicios dedicados), su información es utilizada por otros módulos, especialmente **Monitoreo** y **Gestión de Reserva**, para complementar la trazabilidad de las operaciones.

Este módulo permite representar:

- Operaciones terrestres asociadas a una operación principal.
- Detalles de la operación terrestre: vehículo, ruta terrestre y conductor.
- Conductores (choferes) vinculados a empleados del sistema.

---

## 2. Ubicación en el código

- Carpeta principal del módulo:
  - `backend/src/operaciones_terrestres/`

Dentro de esta carpeta se encuentran:

- **Entidades / Modelos**:
  - `entities/operacion-terrestre.entity.ts`
    - Representa la operación terrestre asociada a una `Operacion` general.
  - `entities/operacion-terrestre-detalle.entity.ts`
    - Detalle de la operación terrestre: vehículo asignado, ruta terrestre y conductor.
  - `entities/conductor.entity.ts`
    - Representa a un conductor, vinculado a un `Empleado` del sistema.

En esta versión no hay **controladores** ni **servicios** específicos bajo `operaciones_terrestres`; la información se consume principalmente desde el módulo de **Monitoreo**.

---

## 3. Entidades principales

### 3.1. `OperacionTerrestre`

Archivo: `entities/operacion-terrestre.entity.ts`

- Esquema: `shared`, tabla `operacionterrestre`.
- Campos principales:
  - `id_operacion_terrestre` (PK, UUID).
  - `id_operacion` (UUID, único): referencia a la operación general (`shared.Operacion`).
  - `codigo` (varchar, único): código identificador de la operación terrestre.
  - `costo_operacion_terrestre` (decimal): costo asociado a la operación terrestre.
- Relaciones:
  - `operacion`: relación ManyToOne con `Operacion`.

### 3.2. `OperacionTerrestreDetalle`

Archivo: `entities/operacion-terrestre-detalle.entity.ts`

- Esquema: `operaciones_terrestres`, tabla `operacionterrestredetalle`.
- Campos principales:
  - `id_operacion_terrestre_detalle` (PK, UUID).
  - `id_operacion_terrestre` (UUID, único): referencia a `OperacionTerrestre`.
  - `id_vehiculo` (UUID): referencia a la entidad `Vehiculo` (módulo `shared`).
  - `id_ruta_terrestre` (UUID): referencia a la ruta terrestre (no mapeada como entidad en esta versión).
  - `id_conductor` (UUID): referencia a la entidad `Conductor`.
- Relaciones:
  - `operacion_terrestre`: ManyToOne con `OperacionTerrestre`.
  - `vehiculo`: ManyToOne con `Vehiculo`.
  - `conductor`: ManyToOne con `Conductor`.

### 3.3. `Conductor`

Archivo: `entities/conductor.entity.ts`

- Esquema: `operaciones_terrestres`, tabla `conductor`.
- Campos principales:
  - `id_conductor` (PK, UUID).
  - `id_empleado` (UUID, único): referencia a `Empleado`.
  - `licencia` (varchar, único): número de licencia del conductor.
  - `categoria` (varchar): categoría de la licencia.
  - `disponibilidad` (boolean): indica si el conductor está disponible.
- Relaciones:
  - `empleado`: ManyToOne con `Empleado` (`shared`).

---

## 4. Uso del módulo en otros componentes

Aunque este módulo no expone endpoints propios en esta versión, sus entidades son consumidas por otros módulos:

- **Monitoreo (`monitoreo`)**
  - `OperacionesService` utiliza `OperacionTerrestre` y `OperacionTerrestreDetalle` para enriquecer la información de las operaciones monitoreadas:
    - Asociar vehículos (placa) a una operación.
    - Mostrar información terrestre complementaria en el detalle de la operación.

- **Gestión de Reserva (`gestion_reserva`)**
  - A través de entidades compartidas (como `Ruta` y `Buque`), las reservas pueden vincularse a tramos terrestres modelados en este módulo, aunque no se gestionan directamente aquí.

Este módulo actúa como **soporte de datos** para la parte terrestre de las operaciones, mientras que la lógica de negocio se concentra en otros servicios (principalmente en `monitoreo`).

---

## 5. Posibles extensiones futuras

- Agregar **controladores y servicios** propios para crear/editar operaciones terrestres.
- Modelar explícitamente la entidad `RutaTerrestre` y sus relaciones.
- Incluir validaciones de negocio sobre disponibilidad de conductores y vehículos.
- Integrar reglas de negocio para combinación de tramos marítimos y terrestres en una misma operación.
