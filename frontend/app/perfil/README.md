# Frontend - Módulo Perfil de Usuario

## 1. Descripción general

La sección de **Perfil** permite al operador autenticado:

- Ver sus datos personales obtenidos desde el backend (`auth/profile`).
- Actualizar información básica (nombre, apellido, dirección).
- Consultar información operativa (código de empleado, turno, zona de monitoreo).
- Cambiar su contraseña de acceso de forma segura.

Esta pantalla está pensada principalmente para el **operador de monitoreo**, pero la lógica se puede extender a otros roles que utilicen el módulo `auth`.

---

## 2. Ubicación en el código

Carpeta del módulo de perfil en el frontend:

- `frontend/app/perfil/`

Archivos principales:

- `layout.tsx`: layout que protege la ruta y verifica que el usuario esté autenticado.
- `page.tsx`: implementación de la pantalla de perfil y cambio de contraseña.

El módulo utiliza además:

- `useAuth` desde `context/AuthContext` para obtener el usuario y el estado de autenticación.
- `MapHeader` desde `components/monitoreo/MapHeader` para mostrar una cabecera consistente con el módulo de monitoreo.

---

## 3. Protección de ruta (`layout.tsx`)

Archivo: `layout.tsx`

Responsabilidades:

- Usa `useAuth()` para leer `isAuthenticated` y `loading`.
- Usa `useRouter()` para redirigir a `/login` si el usuario **no está autenticado**.
- Mientras se verifica la sesión, muestra una pantalla de **cargando / verificando sesión**.

Flujo:

1. Cuando el usuario intenta acceder a `/perfil`, `PerfilLayout` se monta.
2. Si `loading` es `true`, se muestra un indicador de carga.
3. Si `loading` es `false` y `isAuthenticated` es `false` → se hace `router.replace("/login")`.
4. Solo si `isAuthenticated` es `true`, se renderiza el contenido (`children`).

---

## 4. Pantalla de perfil (`/perfil`)

Archivo: `page.tsx`

### 4.1. Datos y contexto

- Usa `useAuth()` para obtener:
  - `usuario`: objeto con datos del usuario autenticado (empleado, operador, etc.).
  - `isAuthenticated`, `loading`.
  - `reloadUser()`: función que recarga los datos del usuario desde el backend tras una actualización.

- Mantiene estados locales para:
  - `editMode`: si el formulario de perfil está en modo edición o solo lectura.
  - `showPasswordModal`: si está abierto el modal de cambio de contraseña.
  - `formData`: datos del empleado a editar (`nombre`, `apellido`, `direccion`).
  - `passwordData`: datos del formulario de cambio de contraseña (`contrasenaActual`, `contrasenaNueva`, `confirmarContrasena`).

### 4.2. Carga inicial de datos

- En un `useEffect`:
  - Si no está cargando y el usuario **no está autenticado**, redirige a `/login`.
- En otro `useEffect`:
  - Cuando `usuario` está disponible, inicializa `formData` con
    - `nombre`: `usuario.empleado.nombre`.
    - `apellido`: `usuario.empleado.apellido`.
    - `direccion`: se deja inicialmente vacío (puede venir de BD si se completa).

### 4.3. Actualizar perfil (`handleSaveProfile`)

Flujo al guardar cambios de perfil:

1. Obtiene el `token` desde `localStorage`.
2. Envía un `PUT` a `${API_URL}/auth/profile` con:
   - Headers: `Content-Type: application/json` y `Authorization: Bearer <token>`.
   - Body: `formData` (`nombre`, `apellido`, `direccion`).
3. Si la respuesta no es `ok`, lanza un error.
4. Si es exitosa:
   - Muestra un `alert` con el mensaje devuelto (`data.message`).
   - Llama a `reloadUser()` para recargar los datos desde el backend.
   - Sale del modo edición (`setEditMode(false)`).

Validaciones visibles:

- No hay validaciones complejas en frontend más allá de permitir editar libremente los campos.
- Cualquier validación adicional (longitudes, formatos) queda delegada al backend.

### 4.4. Cambio de contraseña (`handleChangePassword`)

Flujo al cambiar contraseña:

1. Verifica en frontend que:
   - `contrasenaNueva === confirmarContrasena`, si no, muestra `"Las contraseñas no coinciden"`.
   - Longitud de `contrasenaNueva >= 6` caracteres.
2. Obtiene el `token` desde `localStorage`.
3. Envía un `POST` a `${API_URL}/auth/change-password` con:
   - Headers: `Content-Type: application/json` y `Authorization: Bearer <token>`.
   - Body: `{ contrasenaActual, contrasenaNueva }`.
4. Si la respuesta no es `ok`:
   - Lee el cuerpo de error (`error.message`) y lo muestra con `alert`.
5. Si es exitosa:
   - Muestra un `alert` con el mensaje de éxito.
   - Cierra el modal (`setShowPasswordModal(false)`).
   - Limpia el formulario de contraseña.

### 4.5. Diseño de la pantalla

La UI se divide en varias secciones:

- **Header de Perfil**:
  - Muestra iniciales del usuario en un avatar (primeras letras de nombre y apellido).
  - Muestra nombre completo, rol ("Operador de Monitoreo") y código de empleado.
  - Botón para activar/desactivar modo edición (`Editar Perfil` / `Cancelar`).

- **Información Personal** (formulario):
  - Campos editables de nombre, apellido y dirección.
  - Botón para guardar cambios que dispara `handleSaveProfile`.

- **Información Operativa**:
  - Turno asignado (`usuario.operador?.turno` o "Sin turno asignado").
  - Zona de monitoreo (`usuario.operador?.zona_monitoreo` o "Sin zona asignada").

- **Seguridad de la Cuenta**:
  - Tarjeta con sección de contraseña y botón "Cambiar Contraseña".
  - Al pulsar, se abre un **modal** con formulario para contraseña actual, nueva y confirmación.

---

## 5. Relación con el backend `auth`

La pantalla de perfil se apoya directamente en el módulo de autenticación del backend:

- `GET /auth/profile` (no se llama directamente aquí, pero se utiliza en `AuthContext` para cargar `usuario`).
- `PUT /auth/profile` para actualizar nombre, apellido y dirección del empleado asociado.
- `POST /auth/change-password` para cambiar la contraseña validando la actual.

El contexto `AuthContext` es responsable de:

- Guardar el `token` JWT.
- Cargar el perfil inicial desde el backend.
- Exponer `reloadUser()` para refrescar los datos tras una actualización.

Para más detalles de estos endpoints, ver:

- `backend/src/auth/README.md`.
- `backend/src/shared/README.md` (entidades `Usuario`, `Empleado`, `Operador`).
