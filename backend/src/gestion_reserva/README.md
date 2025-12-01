# Módulo de Gestión de Reserva

## 1. Descripción general

El módulo **Gestión de Reserva** se encarga de administrar las reservas de servicios de transporte y logística dentro del sistema. Abarca el registro, consulta, actualización y eliminación de reservas, así como la gestión de clientes, agentes de reservas, estados de la reserva y tarifas asociadas a rutas marítimas.

Esta documentación describe:

- El propósito del módulo dentro de la aplicación.
- Sus principales funcionalidades y flujos.
- Los archivos de código que lo implementan.
- Los endpoints expuestos por su API.
- Su relación con otros módulos del backend y con el frontend.

---

## 2. Ubicación en el código

- Carpeta principal del módulo:
  - `backend/src/gestion_reserva/`

Dentro de esta carpeta se encuentran:

- **Módulo principal**
  - `gestion_reserva.module.ts`: declara el `GestionReservaModule`, registra controladores, servicios y entidades propias y compartidas.

- **Controladores** (manejan las peticiones HTTP):
  - `controllers/reservas.controller.ts`
  - `controllers/clientes.controller.ts`
  - `controllers/agentes.controller.ts`
  - `controllers/tarifas.controller.ts`
  - `controllers/estados-reserva.controller.ts`
  - `controllers/auth-reservas.controller.ts`

- **Servicios** (contienen la lógica de negocio principal):
  - `services/reservas.service.ts`
  - `services/clientes.service.ts`
  - `services/agentes.service.ts`
  - `services/tarifas.service.ts`
  - `services/estados-reserva.service.ts`
  - `services/auth-reservas.service.ts`

- **Entidades / Modelos** (tablas de la base de datos):
  - `entities/reserva.entity.ts`
  - `entities/reserva-contenedor.entity.ts`
  - `entities/cliente.entity.ts`
  - `entities/agente-reservas.entity.ts`
  - *(además de otras entidades relacionadas como teléfonos de cliente, atenciones, etc.).*

- **DTOs** (Data Transfer Objects, definen la forma de los datos de entrada/salida):
  - `dto/create-reserva.dto.ts`: campos necesarios para crear una reserva (código, estado, cliente, agente, buque, ruta, contenedores, etc.).
  - `dto/update-reserva.dto.ts`: actualización parcial de reservas, extendiendo `CreateReservaDto`.

Esta sección cumple con el requisito de **"Código por Módulo"**, listando los archivos más relevantes de la implementación.

---

## 3. Funcionalidades principales (descripción narrativa)

Desde el punto de vista funcional, el módulo de **Gestión de Reserva** soporta los procesos de negocio relacionados con la creación y administración de reservas de transporte. Entre las funcionalidades más importantes se encuentran:

- **Gestión de reservas**
  - Registrar nuevas reservas asociadas a un cliente, buque, ruta y agente de reservas.
  - Asociar contenedores a una reserva, indicando cantidades.
  - Consultar el listado de reservas con información detallada del cliente, agente, buque, ruta y estado.
  - Consultar el detalle de una reserva específica, incluyendo sus contenedores asociados.
  - Actualizar información clave de una reserva (código, estado, pago total, buque, ruta).
  - Eliminar una reserva y sus contenedores asociados.

- **Gestión de clientes**
  - Consultar la lista de clientes.
  - Buscar un cliente por RUC para verificar su existencia y recuperar sus datos básicos.

- **Gestión de agentes de reservas**
  - Consultar todos los agentes de reservas.
  - Consultar un agente específico y las reservas que ha gestionado.
  - Buscar agente por empleado asociado.

- **Gestión de estados de reserva**
  - Consultar los estados disponibles para las reservas (por ejemplo: Registrada, Confirmada, Cancelada, etc.).

- **Gestión de tarifas y rutas**
  - Consultar tarifas asociadas a rutas marítimas, incluyendo información de puertos de origen, destino e intermedios.

- **Autenticación para el módulo de reservas**
  - Permitir que usuarios autorizados inicien sesión para operar en el módulo de gestión de reservas.

---

## 4. Flujos principales del módulo

### 4.1. Flujo: Registrar una nueva reserva

1. El usuario (agente de reservas u operador) accede a la pantalla de **"Registro de reserva"** en el frontend.
2. Completa el formulario con la siguiente información:
   - Código de la reserva (`codigo`).
   - Estado inicial de la reserva (`id_estado_reserva`).
   - Cliente asociado (`ruc_cliente`).
   - Agente de reservas (`id_agente_reservas`).
   - Buque seleccionado (`id_buque`).
   - Ruta seleccionada (`id_ruta`).
   - Monto de pago total (`pago_total`, opcional).
   - Lista de contenedores con su cantidad (`contenedores`).
3. El frontend envía una petición `POST /gestion-reserva/reservas` con un cuerpo que cumple con `CreateReservaDto`.
4. El **controlador** `ReservasController` delega la operación al **servicio** `ReservasService.create`.
5. El servicio verifica que **no exista otra reserva con el mismo código**.
6. Verifica que el **cliente** y el **agente de reservas** existan en las tablas correspondientes.
7. Inserta la reserva en la tabla `gestion_reserva.reserva`.
8. Si se proporcionan contenedores, inserta registros en `gestion_reserva.reservacontenedor` asociando cada contenedor a la nueva reserva.
9. Finalmente, devuelve el detalle completo de la reserva utilizando `findOne`, incluyendo datos de cliente, agente, buque, ruta, estado y contenedores.

### 4.2. Flujo: Consultar reservas registradas

1. El usuario accede a la pantalla de **"Listado de reservas"**.
2. El frontend hace una petición `GET /gestion-reserva/reservas`.
3. El servicio `ReservasService.findAll` ejecuta una consulta que une reservas con cliente, agente, buque, ruta y estado de la reserva.
4. La respuesta incluye datos listos para mostrarse en la UI (razón social del cliente, nombre del agente, buque, ruta, estado, etc.).
5. La lista se ordena típicamente por fecha de registro descendente.

### 4.3. Flujo: Consultar reservas de un cliente específico

1. Desde la ficha de un cliente o un buscador, el usuario ingresa un RUC.
2. El frontend llama a `GET /gestion-reserva/reservas?ruc_cliente={ruc}`.
3. El controlador `ReservasController` detecta el parámetro `ruc_cliente` y delega en `ReservasService.findByCliente`.
4. El servicio devuelve solo las reservas asociadas a ese RUC, con información resumida del agente, buque, ruta y estado.

### 4.4. Flujo: Ver detalle de una reserva

1. Desde el listado de reservas, el usuario selecciona una reserva específica.
2. El frontend llama a `GET /gestion-reserva/reservas/:id`.
3. El servicio `ReservasService.findOne` obtiene la información detallada de la reserva y sus relaciones (cliente, agente, buque, ruta, estado) mediante una consulta SQL.
4. Obtiene además los contenedores asociados a la reserva desde `gestion_reserva.reservacontenedor`.
5. El backend devuelve un objeto completo listo para ser mostrado en una vista de detalle.

### 4.5. Flujo: Actualizar y eliminar una reserva

- **Actualizar:**
  1. El usuario modifica datos de una reserva en la pantalla de edición.
  2. El frontend envía `PATCH /gestion-reserva/reservas/:id` con los campos a actualizar (`UpdateReservaDto`).
  3. El servicio valida que la reserva exista y que, si se actualiza el código, este siga siendo único.
  4. Ejecuta una actualización dinámica de solo los campos enviados.

- **Eliminar:**
  1. El usuario solicita eliminar una reserva.
  2. El frontend envía `DELETE /gestion-reserva/reservas/:id`.
  3. El servicio primero elimina los contenedores asociados en `reservacontenedor` y luego elimina la reserva.

### 4.6. Flujo: Estadísticas de reservas

1. Desde una pantalla de reportes, el frontend llama a `GET /gestion-reserva/reservas/estadisticas`.
2. El servicio `ReservasService.getEstadisticas` obtiene:
   - Total de reservas.
   - Cantidad de reservas por estado.
   - Ingreso total sumando `pago_total`.
3. El backend devuelve un objeto de estadísticas para alimentar dashboards.

### 4.7. Flujos auxiliares (clientes, agentes, estados, tarifas)

- **Clientes:**
  - `GET /gestion-reserva/clientes` devuelve todos los clientes.
  - `GET /gestion-reserva/clientes/ruc/:ruc` permite buscar un cliente por RUC.

- **Agentes:**
  - `GET /gestion-reserva/agentes` devuelve todos los agentes de reservas.
  - `GET /gestion-reserva/agentes/:id` devuelve el detalle de un agente y sus reservas.
  - `GET /gestion-reserva/agentes/empleado/:idEmpleado` busca al agente asociado a un empleado.

- **Estados de reserva:**
  - `GET /gestion-reserva/estados-reserva` devuelve todos los estados de reserva disponibles.

- **Tarifas y rutas marítimas:**
  - `GET /gestion-reserva/tarifas` devuelve información de tarifas por ruta marítima (distancia, duración, tarifa, puertos).
  - `GET /gestion-reserva/rutas-maritimas` devuelve rutas marítimas con puertos origen, destino e intermedios, reutilizando información de `gestion_maritima`.

---

## 5. Pantallas relacionadas (frontend)

Aunque el detalle de las pantallas se documenta en el frontend, este módulo está asociado, al menos, a las siguientes vistas típicas:

- Pantalla **"Listado de reservas"**.
- Pantalla **"Registro/edición de reserva"**.
- Pantalla **"Detalle de reserva"** (incluye cliente, agente, buque, ruta, contenedores, estado, pago total).
- Pantalla **"Gestión de clientes"** (búsqueda por RUC, alta de clientes en el contexto del proyecto).
- Pantalla **"Gestión de agentes de reservas"**.
- Pantalla o sección de **"Estadísticas de reservas"** (total, por estado, ingreso total).

---

## 6. Endpoints del módulo (API)

A continuación se listan los endpoints principales expuestos por el módulo de Gestión de Reserva (no exhaustivo):

- **Reservas** (`ReservasController`)
  - `POST /gestion-reserva/reservas`
    - Crea una nueva reserva.
  - `GET /gestion-reserva/reservas`
    - Lista reservas; si se envía `ruc_cliente` como query param, filtra por cliente.
  - `GET /gestion-reserva/reservas/estadisticas`
    - Devuelve estadísticas agregadas de reservas.
  - `GET /gestion-reserva/reservas/codigo/:codigo`
    - Busca una reserva por su código único.
  - `GET /gestion-reserva/reservas/:id`
    - Devuelve el detalle completo de una reserva.
  - `PATCH /gestion-reserva/reservas/:id`
    - Actualiza campos específicos de una reserva.
  - `DELETE /gestion-reserva/reservas/:id`
    - Elimina una reserva y sus contenedores asociados.

- **Clientes** (`ClientesController`)
  - `GET /gestion-reserva/clientes`
    - Lista todos los clientes.
  - `GET /gestion-reserva/clientes/ruc/:ruc`
    - Devuelve los datos de un cliente según su RUC.

- **Agentes de reservas** (`AgentesController`)
  - `GET /gestion-reserva/agentes`
    - Lista todos los agentes de reservas.
  - `GET /gestion-reserva/agentes/:id`
    - Detalle de un agente y sus reservas.
  - `GET /gestion-reserva/agentes/empleado/:idEmpleado`
    - Busca el agente asociado a un empleado específico.

- **Estados de reserva** (`EstadosReservaController`)
  - `GET /gestion-reserva/estados-reserva`
    - Devuelve la lista de estados de reserva disponibles.

- **Tarifas y rutas marítimas** (`TarifasController`)
  - `GET /gestion-reserva/tarifas`
    - Lista tarifas y características de rutas marítimas.
  - `GET /gestion-reserva/rutas-maritimas`
    - Lista rutas marítimas disponibles para reservas, incluyendo puertos intermedios.

- **Autenticación del módulo de reservas** (`AuthReservasController`)
  - `POST /gestion-reservas/auth/login`
    - Permite el inicio de sesión de usuarios autorizados para operar en el módulo de reservas.

---

## 7. Reglas de negocio y validaciones

Algunas de las reglas de negocio y validaciones aplicadas en el módulo son:

- **Código único de reserva**
  - Antes de crear o actualizar una reserva, se verifica que no exista otra reserva con el mismo `codigo`.

- **Existencia de cliente y agente de reservas**
  - Para crear una reserva se valida que el RUC del cliente exista en `gestion_reserva.cliente`.
  - Se verifica que el `id_agente_reservas` corresponda a un agente registrado y asociado a un empleado válido.

- **Estados de reserva**
  - El campo `id_estado_reserva` hace referencia a la entidad `EstadoReserva` del esquema compartido (`shared.estadoreserva`).
  - Se utilizan consultas a `EstadosReservaService` para obtener y validar estados válidos.

- **Integridad referencial con buques y rutas**
  - Las reservas se asocian a `Buque` y `Ruta` a través de sus respectivos IDs.

- **Manejo de errores**
  - Se utilizan excepciones específicas (`NotFoundException`, `ConflictException`) para indicar situaciones como cliente no encontrado, agente no encontrado o código de reserva duplicado.

---

## 8. Relación con otros módulos del backend

El módulo de Gestión de Reserva se relaciona con varios módulos del backend:

- **Módulo `shared`**
  - Utiliza entidades compartidas como `Buque`, `Ruta`, `EstadoReserva`, `Usuario`, `RolUsuario` y `Empleado`.
  - Estas relaciones permiten integrar las reservas con la información global de recursos y usuarios del sistema.

- **Módulo de Gestión Marítima (`gestion_maritima`)**
  - Reutiliza la entidad `RutaMaritima` para obtener rutas y tarifas asociadas.
  - Las reservas pueden vincularse posteriormente con operaciones marítimas a través de entidades como `OperacionMaritima` y tablas de relación (por ejemplo, `ReservaOperacionMaritima`).

- **Módulo de Autenticación (`auth`)**
  - A través de `AuthModule` y el servicio `AuthReservasService`, se asegura que solo usuarios con roles válidos (por ejemplo, Administrador, Supervisor, Operador, etc.) accedan al módulo.

---

## 9. Notas de implementación

- Framework: NestJS sobre Node.js y TypeScript.
- Patrón utilizado: módulos con controladores, servicios, entidades y DTOs.
- Uso extensivo de consultas SQL a través de `Repository.query` para obtener vistas agregadas de la información.
- Validaciones de entrada implementadas con `class-validator` en los DTOs.