# GraphQL con Node.js

Repositorio de ejemplo y práctica para una charla de GraphQL con Node.js.

Este proyecto incluye:

- Un servidor Express + Apollo Server (GraphQL).
- Endpoints REST de ejemplo.
- Ejemplos de mappers, DTOs, servicios y validación con `zod`.
- Docker Compose para levantar la base de datos (MariaDB) durante la práctica.

## Requisitos

- Docker y Docker Compose (para la base de datos y/o pruebas locales en contenedores).
- Node.js 18+ (el proyecto fue probado con Node 20).

## Preparación rápida (modo desarrollo)

1. Instalar dependencias (desde la carpeta del repo):

# 🌐 GraphQL con Node.js

Repositorio de ejemplo y práctica para una charla de GraphQL con Node.js — arquitectura por capas, TypeScript y pruebas.

---

## ✨ Resumen rápido

- 🚀 Propósito: aprender a construir una API con Express + Apollo Server (GraphQL) en TypeScript.
- 🎯 Enfoque: separación de responsabilidades (controllers → services → mappers/DTOs → data access), validación con `zod` y manejo centralizado de errores.

---

## 🧭 Contenido (TOC)

- [GraphQL con Node.js](#graphql-con-nodejs)
  - [Requisitos](#requisitos)
  - [Preparación rápida (modo desarrollo)](#preparación-rápida-modo-desarrollo)
- [🌐 GraphQL con Node.js](#-graphql-con-nodejs)
  - [✨ Resumen rápido](#-resumen-rápido)
  - [🧭 Contenido (TOC)](#-contenido-toc)
  - [🛠️ Requisitos](#️-requisitos)
  - [⚡ Instalación rápida](#-instalación-rápida)
  - [📁 Estructura del proyecto (resumen)](#-estructura-del-proyecto-resumen)
  - [🔎 Explicación de archivos clave (más detalle)](#-explicación-de-archivos-clave-más-detalle)
  - [🧪 Tests](#-tests)
  - [🐳 Docker \& Base de datos](#-docker--base-de-datos)

---

## 🛠️ Requisitos

- Docker & Docker Compose (para la BD si quieres correrla en contenedor).
- Node.js 18+ (probado en Node 20).

---

## ⚡ Instalación rápida

1. Instalar dependencias:

```pwsh
npm install
```

2. Crear `.env` con credenciales de BD (ejemplo):

```ini
DB_USER=usuario
DB_PASS=secr3t
DB_NAME=graphql_nodejs
DB_HOST=mariadb-graphql-nodejs
DB_PORT=3306
```

3. (Opcional) Levantar la base de datos con Docker Compose:

```pwsh
docker compose up -d --build
```

4. Ejecutar en modo desarrollo:

```pwsh
npm run dev
```

El servidor arranca en `http://localhost:3001` por defecto.

---

## 📁 Estructura del proyecto (resumen)

- `source/` — código TypeScript principal.
  - `index.ts` — bootstrap (Express + Apollo + pool BD + middlewares).
  - `schema.ts` — typeDefs GraphQL.
  - `resolvers.ts` — resolvers GraphQL (delegan a services).
  - `common.ts` — consultas SQL (acceso a BD).
  - `controllers/` — endpoints REST.
  - `services/` — lógica de negocio y composición de resultados.
  - `mappers/` — transformaciones fila BD → DTO.
  - `dto/` — interfaces/Tipos (Author, Post, QueryArgs, etc.).
  - `middleware/` — validaciones y error handler.
  - `validators/` — esquemas `zod` reutilizables.
  - `errors/` — errores HTTP y utilidades.
  - `plugins/` — plugins de Apollo (p. ej. para mapear HttpError a extensions.httpStatus).

---

## 🔎 Explicación de archivos clave (más detalle)

- `index.ts`:

  - Inicializa la pool de BD (`promise-mysql`) y el servidor Express.
  - Registra `express.json()` y CORS.
  - Monta Apollo Server y las rutas REST.
  - Registra `errorHandler` global para respuestas uniformes.

- `common.ts`:

  - Contiene las consultas SQL parametrizadas (filtrado, orden, paginación).
  - Devuelve filas que luego se pasan a los mappers.

- `services/*.service.ts`:

  - Interfazan con `common.ts` y aplican reglas de negocio.
  - Ejemplo: `getPosts({ limit, offset })` devuelve `PostDto[]` y metadata (count).

- `controllers/*.controller.ts`:

  - Traducen `req` a llamadas a `services` y devuelven `res.status().json()`.

- `mappers/*.mapper.ts`:

  - Convierten columnas SQL (snake_case) a propiedades camelCase y formatean fechas.

- `validators/query-validator.ts` (zod):

  - Define `QueryArgs` y exporta validadores para REST y GraphQL.

- `middleware/error-handler.ts`:

  - Intercepta errores, detecta `HttpError` y responde con JSON uniforme: `{ status, message, details? }`.

- `plugins/apollo-error-plugin.ts`:
  - Añade `extensions.httpStatus` a errores GraphQL que nacen de `HttpError` para facilitar integración con clientes.

---

## 🧪 Tests

- Ejecutar pruebas unitarias:

```pwsh
npm test
```

- Notas importantes:
  - Para mantener estabilidad con Jest, `tsconfig.test.json` usa `module: CommonJS` (ts-jest limita soporte ESM).
  - Estrategia práctica: código fuente en ESM/NodeNext, tests en CommonJS.

---

## 🐳 Docker & Base de datos

- `docker-compose.yml` levanta MariaDB y mapea `base-datos/db-data`.
- `base-datos/` contiene datos y scripts de ejemplo para inicializar la BD.

Ejemplo para levantar la BD:

```pwsh
docker compose up -d
```
