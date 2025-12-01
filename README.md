# Sistema de Operaciones - Documentación de la aplicación

Este repositorio contiene la implementación completa (backend y frontend) del proyecto del **Grupo 5** del curso **BD252 - Diseño de Bases de Datos**.

La aplicación está orientada a la gestión y monitoreo de operaciones logísticas de contenedores para Hapag-Lloyd, incluyendo:

- Gestión de **reservas**.
- Gestión de **operaciones marítimas**.
- Módulo de **monitoreo** (operaciones, contenedores, incidencias, notificaciones, reportes, mapa).
- Gestión de **operaciones terrestres** y **personal/tripulación** (como soporte de datos).
- **Autenticación** y pantallas de login/perfil para usuarios internos.

Este README raíz funciona como **índice general** de la documentación.

---

## 1. Backend

Carpeta principal del backend:

- `backend/`

Documentación general del backend y módulos:

- **Backend - Documentación general** 
  * [Documentación backend](./backend/README.md)

Módulos principales (NestJS):

- **Autenticación** (`backend/src/auth/`)
  * [Documentación módulo auth](./backend/src/auth/README.md)

- **Gestión Marítima** (`backend/src/gestion_maritima/`)
  - [Documentación gestión marítima](./backend/src/gestion_maritima/README.md)

- **Gestión de Reserva** (`backend/src/gestion_reserva/`)
  - [Documentación gestión reserva](./backend/src/gestion_reserva/README.md)

- **Monitoreo** (`backend/src/monitoreo/`)
  - [Documentación monitoreo](./backend/src/monitoreo/README.md)

- **Operaciones Terrestres** (`backend/src/operaciones_terrestres/`)
  - [Documentación operaciones terrestres](./backend/src/operaciones_terrestres/README.md)

- **Personal de Tripulación** (`backend/src/personal_tripulacion/`)
  - [Documentación personal tripulación](./backend/src/personal_tripulacion/README.md)

- **Shared / Entidades compartidas** (`backend/src/shared/`)
  - [Documentación shared](./backend/src/shared/README.md)

En estos documentos se describen:

- Entidades y relaciones principales (TypeORM).
- Controladores y servicios (endpoints, reglas de negocio, validaciones).
- Flujos clave por módulo y cómo se integran entre sí.

---

## 2. Frontend

Carpeta principal del frontend:

- `frontend/`

Documentación general del frontend:

- **Frontend - Documentación general** 
  * [Documentación frontend](./frontend/README.md)

Módulos/pantallas principales (Next.js App Router):

- **Login y autenticación**
  * [Documentación pantallas de login](./frontend/app/login/README.md)

- **Gestión de Reservas** (`/gestion-reservas`)
  - [Documentación frontend gestión reservas](./frontend/app/gestion-reservas/README.md)

- **Monitoreo** (`/monitoreo`)
  - [Documentación frontend monitoreo](./frontend/app/monitoreo/README.md)

- **Operaciones Marítimas** (`/operaciones-maritimas`)
  - [Documentación frontend operaciones marítimas](./frontend/app/operaciones-maritimas/README.md)

- **Perfil de Usuario** (`/perfil`)
  - [Documentación frontend perfil](./frontend/app/perfil/README.md)

Cada README de frontend describe:

- Pantallas y componentes principales de cada sección.
- Flujos de usuario (qué hace cada pantalla, pasos típicos).
- Endpoints del backend que consume (por módulo).

---

## 3. Cómo navegar la documentación

1. **Entender la arquitectura general**:
   - Leer `backend/README.md` y `frontend/README.md`.

2. **Por módulo funcional**:
   - Backend: abrir el README del módulo correspondiente dentro de `backend/src/...`.
   - Frontend: abrir el README de la ruta/pantalla en `frontend/app/...`.

3. **Relación backend–frontend**:
   - Cada README de frontend indica explícitamente qué endpoints de backend utiliza.
   - Cada README de backend indica qué pantallas de frontend dependen de sus endpoints.

---

## 4. Cambios respecto al prototipo (para completar por el grupo)

En esta sección el grupo debe documentar **diferencias entre el prototipo inicial y la implementación final**, por ejemplo:

- Funcionalidades/pantallas que se consolidaron o simplificaron.
- Casos de uso que quedaron fuera de alcance de esta versión.
- Regla de negocio que se cambiaron respecto al diseño original.

Sugerencia de estructura:

- **Módulo Gestión de Reservas**
  - Cambios frente al prototipo...
- **Módulo Operaciones Marítimas**
  - Cambios frente al prototipo...
- **Módulo Monitoreo**
  - Cambios frente al prototipo...
- **Otros módulos**
  - Cambios frente al prototipo...

> Aquí el grupo debe completar el contenido concreto según su diseño inicial y la implementación final.

---

## 5. Datos del equipo

- Curso: Diseño de Bases de Datos
- Grupo: 5
- Integrantes:
  - Romel Rodrigo Chumpitaz Flores
  - Gonzalo Albornoz Azurza
  - Rafael Adriano Olivos Gallardo
  - David Luza Ccorimanya
  - Franz Joe Inga Champi

---

## 6. Ejecución básica del proyecto

### 6.1. Backend

Desde la carpeta `backend/`:

```bash
npm install
npm run start:dev
```

### 6.2. Frontend

Desde la carpeta `frontend/`:

```bash
npm install
npm run dev
```

Por defecto el frontend se expone en `http://localhost:3000` y el backend en `http://localhost:3001` (ajustar según configuración real).