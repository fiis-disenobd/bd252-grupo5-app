# Módulo Shared (Entidades compartidas)

## 1. Descripción general

El módulo **Shared** contiene las entidades **compartidas** por los distintos módulos de la aplicación (Gestión Marítima, Gestión de Reserva, Monitoreo, Operaciones Terrestres, Personal y Tripulación, Auth, etc.).

En lugar de tener duplicadas las mismas tablas en cada módulo, aquí se concentran los **objetos de dominio comunes**, por ejemplo:

- Operaciones (`Operacion`) y sus estados (`EstadoOperacion`).
- Rutas (`Ruta`) y buques (`Buque`).
- Contenedores (`Contenedor`) y sus estados/tipos.
- Usuarios (`Usuario`) y empleados (`Empleado`).

Los servicios de los demás módulos utilizan estas entidades para garantizar la consistencia de la información en toda la aplicación.

---

## 2. Ubicación en el código

- Carpeta principal del módulo shared:
  - `backend/src/shared/`

Dentro de esta carpeta se encuentran principalmente:

- **Entidades / Modelos** en `entities/`.
- (Opcionalmente) algunos controladores/servicios de apoyo en `controllers/` y `services/` (por ejemplo, `tripulantes`), que ya son referenciados por otros módulos.

---

## 3. Entidades principales

A continuación se resumen algunas de las entidades compartidas más importantes.

### 3.1. `Operacion`

Archivo: `entities/operacion.entity.ts`

- Esquema: `shared`, tabla `operacion`.
- Representa una operación general (tanto marítima como terrestre).
- Campos claves:
  - `id_operacion` (PK, UUID).
  - `codigo` (varchar, único).
  - `fecha_inicio` (timestamp).
  - `fecha_fin` (timestamp, opcional).
  - `id_estado_operacion` (UUID): referencia a `EstadoOperacion`.
- Relación:
  - ManyToOne con `EstadoOperacion` (`estado_operacion`).
- Esta entidad es extendida/enlazada por:
  - `OperacionMaritima` (marítima).
  - `OperacionTerrestre` (terrestre).
  - `OperacionMonitoreo` (monitoreo).

### 3.2. `EstadoOperacion`

Archivo: `entities/estado-operacion.entity.ts`

- Esquema: `shared`, tabla `estadooperacion`.
- Representa los **estados posibles** para una operación (por ejemplo: En Curso, En Espera, Completada).
- Campos claves:
  - `id_estado_operacion` (PK, UUID).
  - `nombre` (varchar, único).
- Es utilizado por:
  - Servicios de Monitoreo (para filtrar y cambiar estados).
  - Servicios de Gestión Marítima (para validar estados de operación).

### 3.3. `Buque`

Archivo: `entities/buque.entity.ts`

- Esquema: `shared`, tabla `buque`.
- Representa un buque utilizado en operaciones marítimas.
- Campos claves:
  - `id_buque` (PK, UUID).
  - `matricula` (varchar, único).
  - `nombre` (varchar).
  - `capacidad` (int).
  - `id_estado_embarcacion` (UUID): referencia a `EstadoEmbarcacion`.
  - `peso` (decimal).
  - `ubicacion_actual` (varchar, opcional).
- Relación:
  - ManyToOne con `EstadoEmbarcacion` (`estado_embarcacion`).
- Es utilizado por:
  - `gestion_maritima` (asignación de buques a operaciones marítimas).
  - `gestion_reserva` (asociar reservas a buques específicos).
  - `monitoreo` (visualizar buques en operaciones activas y recursos disponibles).

### 3.4. `Ruta`

Archivo: `entities/ruta.entity.ts`

- Esquema: `shared`, tabla `ruta`.
- Representa una ruta básica entre un origen y un destino.
- Campos claves:
  - `id_ruta` (PK, UUID).
  - `codigo` (varchar).
  - `origen` (varchar).
  - `destino` (varchar).
  - `duracion` (int).
  - `tarifa` (decimal).
- Relaciones:
  - OneToMany con `RutaMaritima` (`rutas_maritimas`), que específica los detalles marítimos de la ruta.
- Es utilizada por:
  - `gestion_maritima` (rutas marítimas).
  - `gestion_reserva` (asociar reservas a rutas).

### 3.5. `Contenedor`

Archivo: `entities/contenedor.entity.ts`

- Esquema: `shared`, tabla `contenedor`.
- Representa un contenedor de carga.
- Campos claves:
  - `id_contenedor` (PK, UUID).
  - `codigo` (varchar, único).
  - `peso` (decimal).
  - `capacidad` (decimal).
  - `dimensiones` (varchar).
  - `id_estado_contenedor` (UUID): referencia a `EstadoContenedor`.
  - `id_tipo_contenedor` (UUID): referencia a `TipoContenedor`.
- Relaciones:
  - ManyToOne con `EstadoContenedor` (`estado_contenedor`).
  - ManyToOne con `TipoContenedor` (`tipo_contenedor`).
- Es utilizada por:
  - `gestion_maritima` (asignación de contenedores a operaciones marítimas).
  - `gestion_reserva` (contenedores reservados).
  - `monitoreo` (estado de contenedores, posición, notificaciones de sensores).

### 3.6. `Usuario`

Archivo: `entities/usuario.entity.ts`

- Esquema: `shared`, tabla `usuario`.
- Representa un usuario del sistema.
- Campos claves:
  - `id_usuario` (PK, UUID).
  - `correo_electronico` (varchar, único).
  - `contrasena` (varchar).
  - `id_rol_usuario` (UUID): referencia a `RolUsuario`.
  - `id_empleado` (UUID): referencia a `Empleado`.
- Relaciones:
  - ManyToOne con `RolUsuario` (`rol_usuario`).
  - ManyToOne con `Empleado` (`empleado`).
- Es utilizado por:
  - `auth` y `AuthReservasService` (login y autorización por rol).
  - `monitoreo` e `incidencias` (para registrar qué usuario crea una incidencia).

### 3.7. `Empleado`

Archivo: `entities/empleado.entity.ts`

- Esquema: `shared`, tabla `empleado`.
- Representa a un empleado de la empresa.
- Campos claves:
  - `id_empleado` (PK, UUID).
  - `codigo` (varchar, único).
  - `dni` (char, único).
  - `nombre`, `apellido` (varchar).
  - `direccion` (varchar, opcional).
  - `id_especialidad_empleado` (UUID).
  - `id_contrato` (UUID, único).
- Es utilizado por:
  - `gestion_reserva` (como base de `AgenteReservas`).
  - `monitoreo` (como base para `Operador`).
  - `personal_tripulacion` y otros módulos que referencian roles operativos.

> **Nota:** El módulo shared incluye otras entidades complementarias (estados, tipos, prioridades, documentos, etc.) que siguen el mismo patrón: se definen aquí para ser reutilizadas en varios módulos.

---

## 4. Uso del módulo Shared en otros módulos

El módulo Shared no suele exponer controladores propios de negocio; su rol principal es ser una **capa de dominio común**. Algunos ejemplos de uso:

- **Gestión Marítima (`gestion_maritima`)**
  - Usa `Operacion`, `OperacionMaritima`, `Ruta`, `Buque`, `EstadoOperacion`, `Contenedor`, `EstatusNavegacion`, `Tripulante`, etc., para construir las operaciones marítimas y sus relaciones.

- **Gestión de Reserva (`gestion_reserva`)**
  - Usa `Buque`, `Ruta`, `EstadoReserva`, `Empleado`, `Usuario`, etc., para vincular reservas a recursos.

- **Monitoreo (`monitoreo`)**
  - Usa `Operacion`, `Contenedor`, `Vehiculo`, `Buque`, `EstadoOperacion`, `EstadoContenedor`, `EstatusNavegacion`, `EstadoEntrega`, `EstadoLectura`, etc., para enriquecer la vista consolidada de operaciones e incidencias.

- **Operaciones Terrestres (`operaciones_terrestres`)**
  - Usa `Vehiculo` y `Empleado` combinado con `Conductor` y `OperacionTerrestre`.

- **Personal y Tripulación (`personal_tripulacion`)**
  - Usa `Buque` y `Tripulante` para las asignaciones de tripulación.

- **Auth (`auth`)**
  - Usa `Usuario`, `RolUsuario` y `Empleado` para autenticación y autorización.

---

## 5. Notas de implementación

- Las entidades de `shared` se anotan con `@Entity({ schema: 'shared', name: '...' })` (o el esquema correspondiente) y se registran en los módulos que las necesitan mediante `TypeOrmModule.forFeature`.
- El diseño favorece la **reutilización** y evita duplicar definiciones de tablas y reglas básicas en cada módulo.
- Las relaciones entre estas entidades y las de otros módulos se manejan mediante `ManyToOne`, `OneToMany` y `OneToOne`, asegurando la integridad referencial en la base de datos.
