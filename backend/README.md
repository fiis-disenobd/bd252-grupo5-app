# Backend - Documentación general

Este directorio contiene el backend de la aplicación del grupo, desarrollado con el framework NestJS sobre Node.js y TypeScript. Su objetivo es exponer una API REST para soportar los módulos funcionales definidos en el curso.

El backend se organiza por **módulos de dominio**, alineados con los procesos del sistema (gestión marítima, reservas, monitoreo, operaciones terrestres, personal de tripulación, etc.).

---

## Arquitectura general

- **Framework:** NestJS (Node.js + TypeScript).
- **Patrón:** arquitectura modular, basada en controladores, servicios y entidades.
- **Comunicación con frontend:** mediante API REST (JSON) sobre HTTP.
- **Organización principal del código:** dentro de `src/`:
  - `auth/`: autenticación/autorización de usuarios.
  - `gestion_maritima/`: lógica de gestión de operaciones marítimas.
  - `gestion_reserva/`: manejo de reservas y su ciclo de vida.
  - `monitoreo/`: monitoreo y seguimiento de operaciones.
  - `operaciones_terrestres/`: procesos asociados a operaciones en tierra.
  - `personal_tripulacion/`: gestión del personal y tripulaciones.
  - `shared/`: entidades y componentes compartidos entre módulos.

Cada carpeta de módulo cuenta (o contará) con su propio `README.md` describiendo funcionalidades, flujos y archivos de implementación.

---

## Módulos y documentación

- **Autenticación** (`src/auth/`)
  - [Documentación auth](./src/auth/README.md)

- **Gestión Marítima** (`src/gestion_maritima/`)
  - [Documentación gestion maritima](./src/gestion_maritima/README.md)

- **Gestión de Reserva** (`src/gestion_reserva/`)
  - [Documentación gestion reserva](./src/gestion_reserva/README.md)

- **Monitoreo** (`src/monitoreo/`)
  - [Documentación monitoreo](./src/monitoreo/README.md)

- **Operaciones Terrestres** (`src/operaciones_terrestres/`)
  - [Documentación operaciones terrestres](./src/operaciones_terrestres/README.md)

- **Personal de Tripulación** (`src/personal_tripulacion/`)
  - [Documentación personal tripulacion](./src/personal_tripulacion/README.md)

- **Shared / Entidades compartidas** (`src/shared/`)
  - [Documentación shared](./src/shared/README.md)

---

## Instalación y ejecución del backend

1. **Instalar dependencias**

```bash
npm install
```

2. **Variables de entorno**

Configurar las variables necesarias (por ejemplo, conexión a base de datos, puertos, etc.) en el archivo de configuración correspondiente (por ejemplo `.env` o `config` propio del proyecto). Ajustar esta sección con los datos reales del proyecto.

3. **Ejecutar el servidor**

```bash
# modo desarrollo
npm run start:dev

# modo producción (compilado)
npm run start:prod
```

Por defecto, la API suele exponerse en un puerto como `http://localhost:3000` (ajustar según configuración real).

---

## Relación con el frontend

- El frontend consume esta API mediante peticiones HTTP (REST).
- Cada módulo del backend soporta uno o más casos de uso que se reflejan en las pantallas del frontend.
- En la documentación de frontend se referencian las pantallas asociadas a cada módulo de backend.

---