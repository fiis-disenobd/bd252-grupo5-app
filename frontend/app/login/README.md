# Frontend - Pantallas de Login

## 1. Descripción general

El frontend incluye varias pantallas de **login** para controlar el acceso a los diferentes módulos de la aplicación:

- Login **unificado** (`/login`) para el operador de monitoreo y otros perfiles que usan el módulo `auth` principal.
- Login específico de **Gestión de Reservas** (`/login-gestion-reservas`).
- Login específico de **Operaciones Marítimas** (`/login-operaciones-maritimas`).
- Login específico de **Operaciones Portuarias** (`/login-operaciones-portuarias`).

Cada login adapta el branding y el endpoint de autenticación al módulo correspondiente, pero todos siguen el mismo patrón:

- Formulario de correo y contraseña.
- Llamada HTTP `POST` al endpoint de login del backend.
- Manejo de errores y estados de carga.
- Almacenamiento del `token` y datos de usuario en `AuthContext` (cuando aplica).

---

## 2. Login unificado (`/login`)

Archivo: `frontend/app/login/page.tsx`

### 2.1. Contexto y objetivo

- Usa `useAuth()` para acceder a la función `login(correo, contrasena)` del contexto.
- Su objetivo es ser un **punto de entrada unificado** a la plataforma, especialmente pensado para el operador de monitoreo.

### 2.2. Flujo general

1. El usuario ingresa **correo** y **contraseña** en el formulario.
2. Al enviar el formulario:
   - Se limpia cualquier error previo.
   - Se setea `loading` a `true`.
   - Se llama `await login(formData.correo, formData.contrasena)`.
3. Si `login` falla, se captura el error y se muestra el mensaje en pantalla.

> La implementación exacta de `login` en `AuthContext` se encarga de:
> - Llamar a `POST /auth/login`.
> - Guardar el `access_token` en almacenamiento (por ejemplo `localStorage`).
> - Guardar los datos del usuario (`usuario`) en contexto.
> - Redirigir a la sección correspondiente (por ejemplo, `/monitoreo`).

### 2.3. Diseño de la pantalla

- Layout de **dos columnas**:
  - Panel izquierdo (solo en desktop): branding general de Hapag-Lloyd, descripción de la plataforma unificada y ventajas.
  - Panel derecho: formulario de login con campos de correo y contraseña.
- Muestra mensajes de error bajo el formulario cuando las credenciales son inválidas.
- Botón de "Iniciar Sesión" que muestra un spinner y texto `"Iniciando sesión..."` mientras `loading` es `true`.

---

## 3. Login Gestión de Reservas (`/login-gestion-reservas`)

Archivo: `frontend/app/login-gestion-reservas/page.tsx`

### 3.1. Contexto y objetivo

- Login especializado para el **módulo de Gestión de Reservas**.
- Usa `useAuth()` para acceder a `setAuthData(token, usuario)` y `useRouter()` para redirigir a `/gestion-reservas` tras el login.

### 3.2. Llamada al backend

- Endpoint consumido:
  - `POST {API_URL}/gestion-reservas/auth/login`
    - Body: `{ correo_electronico, contrasena }`.
- Si la respuesta es exitosa:
  - Se parsea el JSON (`data`) y se llama `setAuthData(data.access_token, data.usuario)`.
  - Se redirige a `/gestion-reservas`.
- Si ocurre un error:
  - Se lee el cuerpo de error y se muestra el mensaje en la UI.

### 3.3. UI y mensajes

- Panel izquierdo:
  - Branding específico del módulo de **Gestión de Reservas**.
  - Mensajes sobre control de reservas, asignación de contenedores y atención al cliente.
- Panel derecho:
  - Formulario de correo/contraseña.
  - Mensaje de error en una tarjeta roja si las credenciales son invalidas.
  - Botón de login con estado de cargando.
  - Notas informativas para usuarios y una nota para el equipo de desarrollo (sobre configurar endpoints y usuarios de prueba).

---

## 4. Login Operaciones Marítimas (`/login-operaciones-maritimas`)

Archivo: `frontend/app/login-operaciones-maritimas/page.tsx`

### 4.1. Contexto y objetivo

- Pantalla de login específica para **Operaciones Marítimas**.
- Usa `useAuth()` (`setAuthData`) y `useRouter()` para redirigir a `/operaciones-maritimas`.

### 4.2. Llamada al backend

- Endpoint consumido:
  - `POST {API_URL}/gestion-maritima/auth/login`
    - Body: `{ correo_electronico, contrasena }`.
- Si la autenticación es exitosa:
  - Se guarda el token y usuario con `setAuthData(data.access_token, data.usuario)`.
  - Se redirige al menú principal de operaciones marítimas (`/operaciones-maritimas`).
- En caso de error:
  - Se muestra el mensaje devuelto por el backend.

### 4.3. UI y reglas visibles

- Panel izquierdo:
  - Branding de **Operaciones Marítimas** (control de buques, incidencias, estado de navegación).
- Panel derecho:
  - Formulario estándar de correo/contraseña.
  - Manejo de errores equivalente al de reservas.
  - Nota informativa que aclara que el acceso está restringido y que ciertos roles (Agente de Reservas, Cliente, Trabajador Portuario, etc.) no tienen acceso.

---

## 5. Login Operaciones Portuarias (`/login-operaciones-portuarias`)

Archivo: `frontend/app/login-operaciones-portuarias/page.tsx`

### 5.1. Contexto y objetivo

- Pantalla específica de login para el módulo de **Operaciones Portuarias**.
- Usa `useAuth()` (`setAuthData`) y `useRouter()` para redirigir a `/operaciones-portuarias`.

### 5.2. Llamada al backend

- Endpoint consumido:
  - `POST {API_URL}/operaciones-portuarias/auth/login`
    - Body: `{ correo_electronico, contrasena }`.
- Tras éxito:
  - Se guarda el token y usuario con `setAuthData(...)`.
  - Se redirige a `/operaciones-portuarias`.
- Si hay error:
  - Muestra el mensaje del backend en pantalla.

### 5.3. UI y mensajes

- Panel izquierdo:
  - Branding de **Operaciones Portuarias** (control de contenedores, logística en terminal, monitoreo de actividades portuarias).
- Panel derecho:
  - Formulario de correo/contraseña con validaciones mínimas (tipo email, requerido, etc.).
  - Mensajes de error y estado de cargando.
  - Nota informativa sobre la restricción de acceso a roles específicos (Trabajador Portuario, Supervisor Portuario, etc.).

---

## 6. Relación con el backend `auth` y módulos específicos

- El login unificado (`/login`) se apoya en el módulo **Auth**:
  - `POST /auth/login`.
  - Luego, `AuthContext` consumirá `GET /auth/profile` y otros endpoints para mantener el estado de usuario.

- Los logins modulares se integran con módulos específicos:
  - `/login-gestion-reservas` → `POST /gestion-reservas/auth/login`.
  - `/login-operaciones-maritimas` → `POST /gestion-maritima/auth/login`.
  - `/login-operaciones-portuarias` → `POST /operaciones-portuarias/auth/login`.

En todos los casos, los tokens y datos de usuario quedan centralizados en `AuthContext`, lo que permite:

- Proteger rutas (por ejemplo, `/perfil`, `/monitoreo`, `/gestion-reservas/*`).
- Mostrar información contextual del usuario (nombre, rol, zona, etc.).

Para más detalles sobre autenticación y estructura de usuarios/roles, revisar:

- `backend/src/auth/README.md`.
- `backend/src/shared/README.md` (`Usuario`, `Empleado`, `RolUsuario`).
