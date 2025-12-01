# Módulo de Personal y Tripulación

## 1. Descripción general

El módulo de **Personal y Tripulación** modela la asignación de tripulantes a buques dentro del sistema. En esta versión, el módulo se centra en la entidad **`BuqueTripulante`**, que representa qué tripulante se encuentra asignado a qué buque y en qué momento.

La lógica de negocio que consume esta información se encuentra principalmente en otros módulos, como **Gestión Marítima** y **Monitoreo**, que utilizan estas relaciones para construir operaciones y flujos de trabajo.

---

## 2. Ubicación en el código

- Carpeta principal del módulo:
  - `backend/src/personal_tripulacion/`

Dentro de esta carpeta se encuentra:

- **Entidades / Modelos**:
  - `entities/buque-tripulante.entity.ts`
    - Define la relación entre buques y tripulantes.

En esta versión no se han definido **controladores** ni **servicios** específicos bajo `personal_tripulacion`; la información se consume desde otros módulos a través de las entidades compartidas.

---

## 3. Entidad principal: `BuqueTripulante`

Archivo: `entities/buque-tripulante.entity.ts`

- Esquema: `personal_tripulacion`, tabla `BuqueTripulante`.
- Campos principales:
  - `id_buque_tripulante` (PK, UUID, generado con `gen_random_uuid()`).
  - `id_buque` (UUID): referencia al buque al que se asigna el tripulante.
  - `id_tripulante` (UUID): referencia al tripulante asignado.
  - `fecha_asignacion` (date): fecha en que se realizó la asignación.
  - `hora_asignacion` (time): hora en que se realizó la asignación.
- Relaciones:
  - `buque`: ManyToOne con `Buque` (`shared.entities.buque`).
  - `tripulante`: ManyToOne con `Tripulante` (`shared.entities.tripulante`).

Esta entidad permite representar la composición de tripulación de un buque en un momento dado.

---

## 4. Uso del módulo en otros componentes

- **Gestión Marítima (`gestion_maritima`)**
  - Utiliza la información de `BuqueTripulante` para relacionar tripulaciones con operaciones marítimas.
  - En el flujo de creación de operaciones marítimas, se puede consultar qué tripulantes están asociados a un buque en un intervalo de tiempo.

- **Monitoreo (`monitoreo`)**
  - A través de entidades compartidas (`Tripulante`, `Empleado`) y las relaciones con `BuqueTripulante`, se puede construir una vista de quién está a bordo de cada buque durante una operación.

De esta manera, el módulo de Personal y Tripulación actúa como **fuente de verdad** para las asignaciones de tripulantes a buques, mientras que otros módulos se encargan de exponer APIs y pantallas para explotar esta información.

---

## 5. Posibles extensiones futuras

- Agregar **controladores y servicios** para gestionar asignaciones de tripulación (alta, baja, cambios de buque, historial de asignaciones).
- Incluir reglas de negocio sobre disponibilidad de tripulantes, rangos de fechas y compatibilidad de roles.
- Integrar validaciones adicionales (por ejemplo, tamaño máximo de tripulación por buque según tipo o capacidad).
