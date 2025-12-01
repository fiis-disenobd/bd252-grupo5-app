# Frontend - Documentación general

Este directorio contiene el **frontend** de la aplicación, desarrollado con **Next.js (App Router) + TypeScript + TailwindCSS**. Su objetivo es proveer las pantallas de usuario que consumen los módulos del backend documentados en `../backend`.

El frontend se organiza principalmente por **rutas/páginas** dentro de `app/`, alineadas con los módulos de dominio:

- Gestión de Reservas.
- Operaciones Marítimas.
- Monitoreo.
- Autenticación (pantallas de login).
- Perfil de usuario.

---

## 1. Tecnologías y arquitectura

- **Framework:** Next.js (App Router) sobre React y TypeScript.
- **Estilos:** TailwindCSS (`tailwind.config.ts`, `app/globals.css`).
- **Gestión de estado/contexto:** hooks y contextos propios en `context/` (por ejemplo, para usuario autenticado o filtros de monitoreo).
- **Componentes reutilizables:** en `components/` (por ejemplo, `Header`, componentes de monitoreo, componentes de operaciones marítimas).
- **Acceso a API backend:** funciones auxiliares en `app/services/` y/o `lib/`, que consumen la API REST expuesta por el backend.

Estructura principal:

- `app/layout.tsx`: layout raíz (HTML `<body>`, estilos globales, tema, etc.).
- `app/page.tsx`: **home** principal con el menú de módulos.
- `app/monitoreo/*`: pantallas del módulo de monitoreo.
- `app/operaciones-maritimas/*`: pantallas del módulo de operaciones marítimas.
- `app/gestion-reservas/*`: pantallas del módulo de reservas.
- `app/login*`: pantallas de login para cada módulo.
- `app/perfil/*`: pantalla de perfil de usuario.

---

## 2. Mapa de pantallas y rutas principales

### 2.1. Home de módulos (`/`)

- Archivo: `app/page.tsx`.
- Funcionalidad:
  - Muestra una **tarjeta por módulo** con icono, título y descripción.
  - Permite navegar a:
    - `/login-gestion-reservas` (módulo Reservas).
    - `/login-operaciones-maritimas` (módulo Operaciones Marítimas).
    - `/monitoreo` (módulo Monitoreo; puede requerir login según implementación).
    - Otros módulos planeados (Personal, Operaciones Portuarias, Operaciones Terrestres, Mantenimiento) marcados con `href: "#"` o pendientes.
- Relación con backend:
  - Actúa como **índice visual** hacia las funcionalidades expuestas por los módulos backend.

### 2.2. Autenticación ([/login](./app/login/README.md))

Rutas de login principales:

- `app/login/page.tsx` (si se usa como login genérico).
- `app/login-gestion-reservas/page.tsx`.
- `app/login-operaciones-maritimas/page.tsx`.
- `app/login-operaciones-portuarias/page.tsx`.

Descripción general:

- Cada pantalla de login presenta un formulario de **correo** y **contraseña**, validaciones básicas y manejo de errores.
- Tras un login exitoso, normalmente se almacena el **token JWT** devuelto por el backend y se redirige a la sección correspondiente (por ejemplo, dashboard de reservas o de operaciones marítimas).

Relación con backend:

- Consume los endpoints del módulo **Auth** (por ejemplo, `POST /auth/login`) o el login específico de Gestión de Reservas (`/gestion-reservas/auth/login`) según el caso.
- El JWT se envía en el header `Authorization: Bearer <token>` a las siguientes llamadas a la API.

### 2.3. Módulo Monitoreo ([/monitoreo](./app/monitoreo/README.md))

- Carpeta: `app/monitoreo/`.
- Archivos/páginas relevantes (a alto nivel):
  - `page.tsx`: vista principal de monitoreo (dashboard, filtros, resumen de operaciones, widgets, etc.).
  - Subrutas como:
    - `operaciones/`: listado y detalle de operaciones monitoreadas.
    - `incidencias/`: gestión de incidencias (lista, filtros, creación/edición).
    - `contenedores/`: vista de contenedores y su estado.
    - `documentacion/`, `reportes/`, `entregas/`, `notificaciones/`, `mapa/`, `importadores/`, `vm-demo/`, etc.
- Relación con backend:
  - Consume endpoints del módulo `monitoreo` del backend (operaciones, incidencias, notificaciones, KPIs).
  - Puede consumir también datos de `gestion_maritima`, `operaciones_terrestres` y entidades `shared` para enriquecer las vistas.

### 2.4. Módulo Operaciones Marítimas ([/operaciones-maritimas](./app/operaciones-maritimas/README.md))

- Carpeta: `app/operaciones-maritimas/`.
- Estructura general:
  - `page.tsx`: entrada principal al módulo (resumen o dashboard).
  - Subrutas:
    - `nueva/`: flujo para crear una nueva operación marítima (selección de ruta, buque, contenedores, fechas, etc.).
    - `incidencias/`: incidencias asociadas a operaciones marítimas.
    - `dashboard/`, `hallazgos/`, etc.: vistas de análisis y seguimiento.
- Relación con backend:
  - Consume los endpoints del módulo `gestion_maritima` para crear y listar operaciones marítimas.
  - Usa entidades `Buque`, `Ruta`, `Contenedor` y `Operacion` desde el backend.

### 2.5. Módulo Gestión de Reservas ([/gestion-reservas](./app/gestion-reservas/README.md))

- Carpeta: `app/gestion-reservas/`.
- Estructura general:
  - `page.tsx`: ingreso al módulo / redirección al dashboard.
  - `layout.tsx`: layout específico del módulo (navegación lateral, encabezado del módulo, etc.).
  - Subrutas:
    - `dashboard/`: indicadores y accesos rápidos de reservas.
    - `nueva-reserva/`: formulario para crear una nueva reserva.
    - `reservas/`: listado, filtros y detalle de reservas.
    - `clientes/`: gestión de clientes.
    - `tarifas/`: visualización y gestión de tarifas aplicadas a rutas.
- Relación con backend:
  - Consume endpoints del módulo `gestion_reserva` (crear, listar, actualizar, eliminar reservas, obtener estadísticas, etc.).
  - Utiliza entidades compartidas (`Ruta`, `Contenedor`, `EstadoReserva`, `Cliente`, `Agente`) que provienen del backend.

### 2.6. Perfil de usuario ([/perfil](./app/perfil/README.md))

- Carpeta: `app/perfil/`.
- Archivos:
  - `layout.tsx`: layout específico para la sección de perfil.
  - `page.tsx`: pantalla con los datos del usuario (nombre, apellido, correo, código, etc.) y opciones para actualizar información.
- Relación con backend:
  - Consume endpoints del módulo `auth`:
    - `GET /auth/profile` para obtener el perfil del usuario autenticado.
    - `PUT /auth/profile` y/o `POST /auth/change-password` para actualizar datos y contraseña.

---

## 3. Componentes reutilizables (`components/`)

- `components/Header.tsx`:
  - Cabecera principal utilizada en varias pantallas (logo, navegación básica, etc.).
- `components/monitoreo/*`:
  - Componentes específicos de gráficas, tablas y tarjetas para el módulo de monitoreo.
- `components/operaciones-maritimas/*`:
  - Componentes de formularios y vistas para operaciones marítimas.

Estos componentes se combinan en las páginas de `app/` para construir las vistas completas.

---

## 4. Configuración y estilos

- **TailwindCSS**:
  - Configuración en `tailwind.config.ts`.
  - Estilos globales y utilidades en `app/globals.css`.
- **Next.js**:
  - Configuración adicional en `next.config.ts` / `next.config.mjs`.
  - Tipado específico de Next/TypeScript en `next-env.d.ts`.

---

## 5. Ejecución del frontend

Desde la carpeta `frontend/`:

```bash
npm install
npm run dev
```

Por defecto la aplicación se expone en `http://localhost:3000`.

---

## 6. Relación con el backend

- El frontend consume la API REST expuesta por el backend (módulos `auth`, `gestion_reserva`, `gestion_maritima`, `monitoreo`, etc.).
- Cada página del frontend se conecta conceptualmente con uno o más módulos de backend:
  - `/gestion-reservas/*` → módulo `gestion_reserva`.
  - `/operaciones-maritimas/*` → módulo `gestion_maritima`.
  - `/monitoreo/*` → módulo `monitoreo` (y entidades compartidas `shared`).
  - `/perfil` y logins → módulo `auth`.
- La documentación de backend describe en detalle los endpoints que cada pantalla utiliza.

