# Módulo de Autenticación (Auth)

## 1. Descripción general

El módulo de **Autenticación (Auth)** se encarga de gestionar el inicio de sesión, registro básico de usuarios, verificación de tokens JWT y operaciones relacionadas con el perfil y la contraseña de los usuarios.

Provee servicios de autenticación que son utilizados por otros módulos (por ejemplo, Monitoreo, Gestión de Reserva) para proteger endpoints y obtener información del usuario autenticado.

---

## 2. Ubicación en el código

- Carpeta principal del módulo:
  - `backend/src/auth/`

Archivos principales:

- `auth.module.ts`: define el `AuthModule`, registra repositorios (`Usuario`, `RolUsuario`, `Empleado`, `Operador`), configura `JwtModule` y `PassportModule`, y expone `AuthService`.
- `auth.controller.ts`: expone los endpoints HTTP (`/auth/...`).
- `auth.service.ts`: contiene la lógica de autenticación, registro, perfil y cambio de contraseña.
- `strategies/jwt.strategy.ts`: estrategia Passport para validar tokens JWT.
- `guards/jwt-auth.guard.ts`: guard que protege rutas usando la estrategia JWT.
- `dto/*.dto.ts`: DTOs para login, registro, actualización de perfil y cambio de contraseña.

---

## 3. DTOs principales

- **`LoginDto`** (`dto/login.dto.ts`)
  - Campos:
    - `correo_electronico` (email, requerido).
    - `contrasena` (string, requerida).

- **`RegisterDto`** (`dto/register.dto.ts`)
  - Campos:
    - `correo_electronico` (email, requerido).
    - `contrasena` (string, min 6 caracteres, requerida).
    - `id_rol_usuario` (UUID, requerido).
    - `id_empleado` (UUID, requerido).

- **`UpdateProfileDto`** (`dto/update-profile.dto.ts`)
  - Campos opcionales:
    - `nombre`, `apellido`, `direccion`.

- **`ChangePasswordDto`** (`dto/change-password.dto.ts`)
  - Campos:
    - `contrasenaActual` (string, requerida).
    - `contrasenaNueva` (string, min 6 caracteres, requerida).

---

## 4. Funcionalidades principales (descripción narrativa)

- **Inicio de sesión (login)**
  - Permite que un usuario del sistema (en esta versión, orientado a operadores de monitoreo) ingrese con su correo y contraseña.
  - Verifica las credenciales contra la tabla `Usuario` y valida que el empleado asociado sea un `Operador` válido.
  - Genera un **token JWT** que incluye datos del usuario y del operador (turno, zona de monitoreo).

- **Registro de usuarios**
  - Permite registrar un nuevo usuario con un rol y un empleado asociados.
  - Verifica que el correo no esté ya registrado y que el rol exista.

- **Gestión de roles**
  - Permite listar los roles definidos en `RolUsuario` para integrarlos en formularios del frontend.

- **Verificación de token**
  - Dado un token JWT, permite verificar su validez y obtener su payload.

- **Perfil de usuario**
  - Permite obtener y actualizar datos de perfil del empleado asociado al usuario (nombre, apellido, dirección).

- **Cambio de contraseña**
  - Permite cambiar la contraseña del usuario validando primero la contraseña actual.

---

## 5. Flujos principales

### 5.1. Flujo: Inicio de sesión (`login`)

1. El usuario ingresa su **correo electrónico** y **contraseña** en el frontend.
2. El frontend envía una petición `POST /auth/login` con un cuerpo que cumple con `LoginDto`.
3. `AuthService.login`:
   - Busca al `Usuario` por `correo_electronico` (incluyendo su `Empleado`).
   - Verifica la contraseña (en esta versión en texto plano; se deja comentado el uso de `bcrypt` para producción).
   - Verifica que el `Empleado` esté registrado como `Operador` (módulo Monitoreo).
   - Genera un **JWT** con información del usuario y del operador.
4. El backend responde con:
   - `access_token`: token JWT.
   - `usuario`: datos básicos del usuario, empleado y operador.
5. El frontend guarda el token (por ejemplo, en memoria o almacenamiento seguro) y lo envía en el header `Authorization: Bearer <token>` en las siguientes peticiones.

### 5.2. Flujo: Registro de usuario (`register`)

1. Un usuario autorizado (por ejemplo, un administrador) registra un nuevo usuario desde el frontend.
2. El frontend envía `POST /auth/register` con un cuerpo `RegisterDto`.
3. `AuthService.register`:
   - Verifica que no exista ya un usuario con ese correo.
   - Verifica que el rol (`id_rol_usuario`) exista.
   - Crea el usuario con contraseña (actualmente sin hash, dejando comentado el uso de `bcrypt` para producción).
4. Devuelve un mensaje de éxito y los datos básicos del usuario creado.

### 5.3. Flujo: Obtener y actualizar perfil (`profile`)

- **Obtener perfil**
  1. El frontend envía `GET /auth/profile` con el JWT en el header.
  2. `JwtAuthGuard` valida el token usando `JwtStrategy`.
  3. `AuthService.getProfile` consulta al `Usuario` y su `Empleado` y, opcionalmente, el `Operador` asociado.
  4. Devuelve datos completos de perfil (nombre, apellido, código, dni, etc.).

- **Actualizar perfil**
  1. El frontend envía `PUT /auth/profile` con campos opcionales (`UpdateProfileDto`).
  2. Se valida el JWT con `JwtAuthGuard`.
  3. `AuthService.updateProfile` actualiza los datos del `Empleado` vinculado al usuario.

### 5.4. Flujo: Cambio de contraseña (`change-password`)

1. El usuario autenticado completa un formulario con su contraseña actual y la nueva.
2. El frontend envía `POST /auth/change-password` con `ChangePasswordDto` y el JWT.
3. `AuthService.changePassword`:
   - Verifica que el usuario exista.
   - Verifica que la contraseña actual coincida (texto plano; se deja previsto uso de `bcrypt`).
   - Actualiza la contraseña en la base de datos.
4. Devuelve un mensaje de confirmación.

---

## 6. Endpoints del módulo (API)

Controlador: `AuthController` (`auth.controller.ts`).

- `POST /auth/login`
  - Inicia sesión con `LoginDto`.
- `POST /auth/register`
  - Registra un nuevo usuario con `RegisterDto`.
- `GET /auth/roles`
  - Devuelve la lista de roles disponibles (`RolUsuario`).
- `POST /auth/verify`
  - Verifica un token JWT arbitrario y devuelve su payload si es válido.
- `GET /auth/profile` (protegido con `JwtAuthGuard`)
  - Devuelve el perfil completo del usuario autenticado.
- `PUT /auth/profile` (protegido)
  - Actualiza información de perfil del empleado asociado al usuario autenticado.
- `POST /auth/change-password` (protegido)
  - Cambia la contraseña del usuario autenticado.

Además, otros módulos definen endpoints propios que reutilizan el mecanismo de autenticación, por ejemplo:

- `POST /gestion-reservas/auth/login` (módulo de reservas).
- Endpoints de incidencias de Monitoreo que usan `JwtAuthGuard` para asociar acciones al usuario.

---

## 7. Estrategia JWT y guardias

- **`JwtStrategy`** (`strategies/jwt.strategy.ts`)
  - Extrae el token desde el encabezado `Authorization: Bearer <token>`.
  - Valida el token usando la clave `JWT_SECRET` y tiempo de expiración.
  - Carga al `Usuario` desde base de datos y, si existe, expone en `req.user`:
    - `id_usuario`, `correo`, `id_empleado`.

- **`JwtAuthGuard`** (`guards/jwt-auth.guard.ts`)
  - Hereda de `AuthGuard('jwt')` (Passport).
  - Se utiliza en controladores para proteger rutas que requieren autenticación.

---

## 8. Uso del módulo Auth en otros módulos

- **Monitoreo (`monitoreo`)**
  - Las operaciones de incidencias (`IncidenciasController`) usan `JwtAuthGuard` para asegurar que solo usuarios autenticados puedan crear, actualizar o eliminar incidencias.
  - El `id_usuario` se obtiene desde `req.user` y se utiliza para registrar quién creó la incidencia.

- **Gestión de Reserva (`gestion_reserva`)**
  - Tiene un servicio adicional `AuthReservasService` y un controlador `AuthReservasController` (`/gestion-reservas/auth/login`) para autenticación específica del módulo de reservas, reutilizando el mismo enfoque de usuarios y roles.

- **Resto de módulos**
  - Pueden usar el JWT emitido por Auth para identificar al usuario, su empleado y rol, y aplicar reglas de autorización a nivel de negocio.

---

## 9. Notas de implementación

- Framework: NestJS con `@nestjs/passport` y `@nestjs/jwt`.
- La clave `JWT_SECRET` se toma de la variable de entorno o usa un valor por defecto (debe cambiarse en producción).
- Actualmente las contraseñas se manejan en **texto plano** por simplicidad del entorno académico, pero se incluye código comentado para uso de `bcrypt` en producción.
- El diseño está orientado a una integración sencilla con el módulo de Monitoreo (operadores) y extensible a otros módulos.
