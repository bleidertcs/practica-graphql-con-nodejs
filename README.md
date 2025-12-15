# 🚀 GraphQL + Express + Clean Architecture

API GraphQL y REST con Node.js, Express, Apollo Server, MariaDB y Docker, implementando **Clean Architecture**.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-16.x-E10098)](https://graphql.org/)
[![Tests](https://img.shields.io/badge/Tests-27%20passing-success)](./jest.config.mjs)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [API Reference](#-api-reference)
- [Autenticación](#-autenticación)
- [Validación](#-validación)
- [Tests](#-tests)
- [Docker](#-docker)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación Adicional](#-documentación-adicional)

---

## ✨ Características

| Feature                  | Descripción                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| **GraphQL**              | Apollo Server 5 con queries y mutations CRUD                       |
| **REST API**             | Endpoints paralelos para authors y posts                           |
| **Clean Architecture**   | 4 capas separadas (Domain, Application, Infrastructure, Container) |
| **TypeScript**           | Tipado estático completo                                           |
| **Dependency Injection** | Container propio sin librerías externas                            |
| **DataLoaders**          | Optimización de N+1 queries                                        |
| **JWT Auth**             | Autenticación con jsonwebtoken y bcrypt                            |
| **Zod Validation**       | Validación de inputs                                               |
| **Docker**               | Multi-stage build con healthchecks                                 |
| **Tests**                | 27+ tests unitarios y de integración                               |

---

## 🏗 Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   GraphQL   │  │    REST     │  │     Database        │  │
│  │  Resolvers  │  │ Controllers │  │   Repositories      │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
┌─────────┴────────────────┴────────────────────┘─────────────┐
│                    Application Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Use Cases  │  │  Validators │  │   DTOs + Mappers    │  │
│  └──────┬──────┘  └─────────────┘  └─────────────────────┘  │
└─────────┼───────────────────────────────────────────────────┘
          │
┌─────────┴───────────────────────────────────────────────────┐
│                      Domain Layer                            │
│  ┌─────────────┐  ┌─────────────────────┐  ┌─────────────┐  │
│  │  Entities   │  │ Repository Interfaces│  │   Errors    │  │
│  └─────────────┘  └─────────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠 Requisitos

- **Node.js** 18+ (recomendado 20)
- **pnpm** (gestor de paquetes)
- **Docker** y **Docker Compose**

---

## ⚡ Instalación

```bash
# Clonar
git clone https://github.com/tu-usuario/practica-graphql-con-nodejs.git
cd practica-graphql-con-nodejs

# Dependencias
pnpm install

# Variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar con Docker
docker-compose up --build -d
```

El servidor estará en `http://localhost:3001`

---

## 📖 API Reference

### GraphQL Endpoint

**URL**: `POST http://localhost:3001/graphql`

#### Queries

```graphql
# Listar autores
query {
  authors(limit: 10, offset: 0) {
    list {
      id
      first_name
      last_name
      email
      posts {
        title
      }
    }
    count
  }
}

# Listar posts
query {
  posts(limit: 5) {
    list {
      id
      title
      description
      author {
        first_name
      }
    }
    count
  }
}
```

#### Mutations

```graphql
# Crear autor
mutation {
  createAuthor(
    input: {
      first_name: "John"
      last_name: "Doe"
      email: "john@example.com"
      birthdate: "1990-01-15"
    }
  ) {
    id
    first_name
    email
  }
}

# Actualizar autor
mutation {
  updateAuthor(id: 1, input: { first_name: "Jane" }) {
    id
    first_name
  }
}

# Eliminar autor
mutation {
  deleteAuthor(id: 1)
}

# Crear post
mutation {
  createPost(
    input: {
      title: "Mi Post"
      author_id: 1
      description: "Descripción"
      content: "Contenido completo"
    }
  ) {
    id
    title
  }
}

# Actualizar post
mutation {
  updatePost(id: 1, input: { title: "Nuevo Título" }) {
    id
    title
  }
}

# Eliminar post
mutation {
  deletePost(id: 1)
}
```

### REST Endpoints

| Método | Endpoint                    | Descripción             |
| ------ | --------------------------- | ----------------------- |
| GET    | `/rest/authors`             | Lista autores con count |
| GET    | `/rest/authors/:id`         | Autor por ID            |
| GET    | `/rest/posts`               | Lista posts con count   |
| GET    | `/rest/posts/:id`           | Post por ID             |
| GET    | `/rest/posts-by-author/:id` | Posts de un autor       |

**Parámetros query**: `limit` (default: 20), `offset` (default: 0)

---

## 🔐 Autenticación

El proyecto incluye autenticación JWT completa.

### Configuración

```env
JWT_SECRET=tu-secreto-super-seguro
JWT_EXPIRES_IN=24h
```

### Crear tabla de usuarios

```bash
# Desarrollo local
npx knex migrate:latest --knexfile knexfile.ts

# Docker (usa archivos .mjs)
docker-compose exec app npx knex migrate:up 20231208000000_create_users_table.mjs --knexfile knexfile.mjs
```

### Mutations GraphQL

```graphql
# Registrar usuario
mutation {
  register(
    input: {
      username: "john_doe"
      email: "john@example.com"
      password: "mySecurePassword123"
    }
  ) {
    user {
      id
      username
      email
    }
    accessToken
  }
}

# Iniciar sesión
mutation {
  login(input: { email: "john@example.com", password: "mySecurePassword123" }) {
    user {
      id
      username
      email
    }
    accessToken
  }
}
```

### Uso del Token

```bash
# En las siguientes requests, usar el header:
Authorization: Bearer <accessToken>
```

### Middleware para proteger rutas

```typescript
import { authMiddleware } from "./infrastructure/http/middleware/index.js";

// Proteger ruta REST
app.use("/api/protected", authMiddleware, protectedRouter);
```

Ver [MIGRATIONS.md](./MIGRATIONS.md) para más detalles.

---

## ✅ Validación

Validación de inputs con Zod.

### Schemas disponibles

| Schema               | Ubicación                                    |
| -------------------- | -------------------------------------------- |
| `createAuthorSchema` | `application/validators/author.validator.ts` |
| `updateAuthorSchema` | `application/validators/author.validator.ts` |
| `createPostSchema`   | `application/validators/post.validator.ts`   |
| `updatePostSchema`   | `application/validators/post.validator.ts`   |
| `queryArgsSchema`    | `application/validators/query.validator.ts`  |

### Ejemplo

```typescript
import { createAuthorSchema } from "./application/validators/index.js";

const input = createAuthorSchema.parse(data);
// Lanza ZodError si es inválido
```

---

## 🧪 Tests

```bash
pnpm test
```

| Suite                      | Tests | Descripción             |
| -------------------------- | ----- | ----------------------- |
| `graphql.test.ts`          | 4     | Integración GraphQL     |
| `authors.use-case.test.ts` | 5     | Use cases de autores    |
| `posts.use-case.test.ts`   | 6     | Use cases de posts      |
| `mappers.test.ts`          | 7     | Conversión Entity → DTO |
| `domain-errors.test.ts`    | 4     | Errores de dominio      |

**Total: 27 tests**

---

## 🐳 Docker

```bash
# Iniciar
docker-compose up -d --build

# Ver logs
docker-compose logs -f app

# Reset BD (elimina datos)
docker-compose down -v && docker-compose up --build -d

# Ejecutar migraciones
docker-compose exec app npx knex migrate:latest --knexfile knexfile.ts
```

| Servicio | Puerto | Descripción        |
| -------- | ------ | ------------------ |
| `app`    | 3001   | API GraphQL + REST |
| `db`     | 3306   | MariaDB            |

---

## 📁 Estructura del Proyecto

```
src/
├── domain/                    # Capa de Dominio (sin dependencias)
│   ├── entities/              # Author, Post, User
│   ├── repositories/          # Interfaces de repositorios
│   └── errors/                # DomainError, EntityNotFoundError
│
├── application/               # Capa de Aplicación
│   ├── dto/                   # Data Transfer Objects
│   ├── mappers/               # Entity → DTO
│   ├── validators/            # Zod schemas
│   ├── services/              # Auth service (JWT, bcrypt)
│   └── use-cases/
│       ├── authors/           # CRUD Authors (6 use cases)
│       ├── posts/             # CRUD Posts (7 use cases)
│       └── auth/              # Register, Login
│
├── infrastructure/            # Capa de Infraestructura
│   ├── database/
│   │   ├── knex-client.ts     # Configuración Knex
│   │   └── repositories/      # Implementaciones Knex
│   └── http/
│       ├── graphql/           # Schema, Resolvers, DataLoaders
│       ├── rest/              # Controllers, Routes
│       └── middleware/        # AsyncHandler, ErrorHandler, Auth
│
├── container/                 # Dependency Injection
└── index.ts                   # Entry point
```

---

## 📚 Documentación Adicional

- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Explicación detallada de Clean Architecture
- [**MIGRATIONS.md**](./MIGRATIONS.md) - Guía de migraciones con Knex

---

## 🔧 Scripts

| Script       | Descripción               |
| ------------ | ------------------------- |
| `pnpm dev`   | Desarrollo con hot reload |
| `pnpm build` | Compilar TypeScript       |
| `pnpm start` | Iniciar producción        |
| `pnpm test`  | Ejecutar tests            |

---

## 📄 Licencia

ISC
