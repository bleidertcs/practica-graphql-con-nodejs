# 🏛 Arquitectura del Código

Explicación detallada de la implementación de **Clean Architecture** en este proyecto.

---

## 📐 Principios

Clean Architecture organiza el código en capas concéntricas donde las dependencias **siempre apuntan hacia adentro**:

```
┌─────────────────────────────────────────────────────┐
│                  Infrastructure                      │
│    (Express, Knex, GraphQL, HTTP Controllers)       │
│  ┌───────────────────────────────────────────────┐  │
│  │              Application                       │  │
│  │        (Use Cases, Validators, Mappers)       │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │              Domain                      │  │  │
│  │  │    (Entities, Repository Interfaces)    │  │  │
│  │  │                                         │  │  │
│  │  │       ❌ SIN DEPENDENCIAS EXTERNAS      │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Regla de Oro**: Las capas internas NO conocen a las externas.

---

## 🗂 Las 4 Capas

### 1. Domain Layer (`src/domain/`)

Contiene las **reglas de negocio puras** sin dependencias externas.

| Directorio      | Contenido                                            |
| --------------- | ---------------------------------------------------- |
| `entities/`     | Author, Post, User                                   |
| `repositories/` | IAuthorRepository, IPostRepository, IUserRepository  |
| `errors/`       | DomainError, EntityNotFoundError, InvalidEntityError |

```typescript
// entities/author.entity.ts
export interface Author {
  id: number;
  firstName: string; // camelCase en dominio
  lastName: string;
  email: string;
  birthdate: Date;
}

// repositories/author.repository.interface.ts
export interface IAuthorRepository {
  findAll(options: ListAuthorsOptions): Promise<Author[]>;
  findById(id: number): Promise<Author | null>;
  create(input: CreateAuthorInput): Promise<Author>;
  update(id: number, input: UpdateAuthorInput): Promise<Author>;
  delete(id: number): Promise<void>;
}
```

---

### 2. Application Layer (`src/application/`)

Orquesta las reglas de negocio. Contiene **casos de uso** y **validación**.

| Directorio           | Contenido                                                       |
| -------------------- | --------------------------------------------------------------- |
| `use-cases/authors/` | ListAuthors, GetById, Create, Update, Delete, Count             |
| `use-cases/posts/`   | ListPosts, GetById, ListByAuthor, Create, Update, Delete, Count |
| `use-cases/auth/`    | Register, Login                                                 |
| `validators/`        | Zod schemas para Author, Post, Query                            |
| `services/`          | AuthService (JWT + bcrypt)                                      |
| `dto/`               | AuthorDto, PostDto, QueryArgs                                   |
| `mappers/`           | toAuthorDto, toPostDto                                          |

```typescript
// use-cases/authors/create-author.use-case.ts
export class CreateAuthorUseCase {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async execute(input: CreateAuthorInput): Promise<AuthorDto> {
    const author = await this.authorRepository.create({
      firstName: input.first_name,
      lastName: input.last_name,
      email: input.email,
      birthdate: new Date(input.birthdate),
    });
    return toAuthorDto(author);
  }
}
```

---

### 3. Infrastructure Layer (`src/infrastructure/`)

Implementa los detalles técnicos: base de datos, HTTP, GraphQL.

| Directorio               | Contenido                                  |
| ------------------------ | ------------------------------------------ |
| `database/repositories/` | KnexAuthorRepository, KnexPostRepository   |
| `http/graphql/`          | Schema, Resolvers, DataLoaders             |
| `http/rest/`             | Controllers, Routes                        |
| `http/middleware/`       | AsyncHandler, ErrorHandler, AuthMiddleware |

```typescript
// database/repositories/knex-author.repository.ts
export class KnexAuthorRepository implements IAuthorRepository {
  constructor(private readonly db: Knex) {}

  async create(input: CreateAuthorInput): Promise<Author> {
    const [id] = await this.db("authors").insert({
      first_name: input.firstName, // camelCase → snake_case
      last_name: input.lastName,
      email: input.email,
      birthdate: input.birthdate,
    });
    return this.findById(id);
  }
}
```

---

### 4. Container (`src/container/`)

Inyección de dependencias usando un **Singleton**.

```typescript
// container/container.ts
export class Container {
  private static instance: Container;

  // Database
  public readonly db: Knex;

  // Repositories
  public readonly authorRepository: KnexAuthorRepository;

  // Use Cases
  public readonly createAuthorUseCase: CreateAuthorUseCase;
  public readonly loginUseCase: LoginUseCase;

  private constructor() {
    this.db = createKnexClient();
    this.authorRepository = new KnexAuthorRepository(this.db);
    this.createAuthorUseCase = new CreateAuthorUseCase(this.authorRepository);
  }
}
```

---

## 🔄 Flujo de una Mutation

### `createAuthor(input: {...})`

```
1. Apollo recibe mutation
   │
2. Resolver llama context.useCases.createAuthor.execute(input)
   │
3. Use Case valida y transforma input (snake_case → camelCase)
   │
4. Use Case llama repository.create(repoInput)
   │
5. Repository inserta en BD (camelCase → snake_case)
   │
6. Repository retorna Author entity
   │
7. Use Case mapea entity → AuthorDto (camelCase → snake_case)
   │
8. Apollo retorna JSON al cliente
```

---

## 🔐 Autenticación JWT

### Flujo de Login

```
1. Resolver llama loginUseCase.execute({ email, password })
   │
2. Use Case busca user por email
   │
3. Use Case compara password con bcrypt
   │
4. Si válido → genera JWT con generateToken(user)
   │
5. Retorna { user, tokens: { accessToken } }
```

### Flujo de Request Autenticada

```
1. Request con header: Authorization: Bearer <token>
   │
2. authMiddleware extrae y verifica token
   │
3. Si válido → req.user = { userId, email }
   │
4. Continúa al handler
```

---

## ✅ Validación con Zod

```typescript
// validators/author.validator.ts
export const createAuthorSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email("Invalid email format"),
  birthdate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
});

// Uso en resolver
const validInput = createAuthorSchema.parse(input);
```

---

## 🧪 Testing

Los use cases son fácilmente testeables con **mocks**:

```typescript
function createMockAuthorRepository(): IAuthorRepository {
  return {
    findAll: jest.fn().mockResolvedValue([mockAuthor]),
    create: jest.fn().mockResolvedValue(mockAuthor),
    // ...
  };
}

it("should create author", async () => {
  const mockRepo = createMockAuthorRepository();
  const useCase = new CreateAuthorUseCase(mockRepo);

  const result = await useCase.execute(input);

  expect(mockRepo.create).toHaveBeenCalled();
  expect(result.first_name).toBe("John");
});
```

---

## 📝 Glosario

| Término              | Definición                                          |
| -------------------- | --------------------------------------------------- |
| **Entity**           | Objeto de negocio del dominio                       |
| **Use Case**         | Acción del sistema (interactor)                     |
| **Repository**       | Abstracción de acceso a datos                       |
| **DTO**              | Data Transfer Object para la API                    |
| **Mapper**           | Convierte entre Entity y DTO                        |
| **Container**        | Inyector de dependencias                            |
| **Composition Root** | Donde se conectan todas las dependencias (index.ts) |
