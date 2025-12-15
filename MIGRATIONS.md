# 📦 Database Migrations

Este documento explica cómo manejar las migraciones de base de datos usando Knex.js.

## 🛠 Configuración

Las migraciones están configuradas en `knexfile.ts` y se ubican en el directorio `migrations/`.

## 📝 Comandos de Migración

### Crear nueva migración

```bash
npx knex migrate:make nombre_de_migracion --knexfile knexfile.ts
```

Ejemplo:

```bash
npx knex migrate:make add_users_table --knexfile knexfile.ts
```

Esto crea un archivo en `migrations/` con el formato:

```
YYYYMMDDHHMMSS_nombre_de_migracion.ts
```

### Ejecutar migraciones pendientes

```bash
npx knex migrate:latest --knexfile knexfile.ts
```

### Revertir última migración

```bash
npx knex migrate:rollback --knexfile knexfile.ts
```

### Ver estado de migraciones

```bash
npx knex migrate:status --knexfile knexfile.ts
```

## 📄 Estructura de una Migración

```typescript
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Cambios a aplicar
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable().unique();
    table.string("email").notNullable().unique();
    table.string("password_hash").notNullable();
    table.datetime("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  // Revertir cambios
  await knex.schema.dropTableIfExists("users");
}
```

## 🗂 Migraciones Existentes

| Archivo                                             | Descripción            |
| --------------------------------------------------- | ---------------------- |
| `20231207000000_create_authors_and_posts_tables.ts` | Tablas authors y posts |

## ⚠️ Consideraciones

1. **Siempre crea una función `down()`** que revierta los cambios de `up()`.

2. **Usa nombres descriptivos** para las migraciones que indiquen qué hacen.

3. **No modifiques migraciones ya aplicadas** en producción - crea una nueva migración en su lugar.

4. **Prueba las migraciones** en un ambiente de desarrollo antes de aplicarlas en producción.

## 🐳 Migraciones con Docker

El proyecto usa archivos `.mjs` (JavaScript ESM) para migraciones en Docker para evitar problemas con TypeScript.

### Archivos de migración

| Archivo | Uso               |
| ------- | ----------------- |
| `*.ts`  | Desarrollo local  |
| `*.mjs` | Docker/Producción |

### Ejecutar en Docker

```bash
# Ver estado de migraciones
docker-compose exec app npx knex migrate:status --knexfile knexfile.mjs

# Ejecutar migración específica
docker-compose exec app npx knex migrate:up 20231208000000_create_users_table.mjs --knexfile knexfile.mjs

# Rollback última migración
docker-compose exec app npx knex migrate:down --knexfile knexfile.mjs
```

## 🎯 Crear Tabla de Usuarios (para Auth)

La migración ya existe. Para ejecutarla:

```bash
# Desarrollo local
npx knex migrate:latest --knexfile knexfile.ts

# Docker
docker-compose exec app npx knex migrate:up 20231208000000_create_users_table.mjs --knexfile knexfile.mjs
```

Y agrega:

```typescript
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username", 50).notNullable().unique();
    table.string("email", 255).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.datetime("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
```
