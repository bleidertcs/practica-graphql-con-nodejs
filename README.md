# GraphQL and REST API with Node.js

This project provides a demonstration of a GraphQL and REST API built with Node.js, Express, Knex.js, and Apollo Server. It includes examples of data loading with DataLoader to solve the N+1 problem.

## Setup

### Prerequisites

*   Node.js (LTS recommended)
*   npm (comes with Node.js)
*   MySQL Server

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd demostracion-charla-graphql-nodejs
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Database Configuration:**
    Create a `.env` file in the project root with your MySQL connection details:
    ```
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASS=your_mysql_password
    DB_NAME=your_database_name
    ```

4.  **Run Migrations:**
    ```bash
    npx knex migrate:latest --knexfile src/knexfile.ts
    ```

5.  **Seed the Database:**
    ```bash
    npm run seed
    ```

## Running the Application

### Development Mode

To start the application in development mode with hot-reloading:
```bash
npm run dev
```
The server will be running at `http://localhost:3001`.

### Production Mode

To build and start the application in production mode:
```bash
npm run build
npm start
```
The server will be running at `http://localhost:3001`.

## Running Tests

To run the test suite:
```bash
npm test
```

## API Endpoints

The application exposes both GraphQL and REST API endpoints.

### GraphQL API

The GraphQL endpoint is available at `http://localhost:3001/graphql`.

#### Example Queries with `curl`

**1. Fetch a list of authors:**
```bash
curl -X POST \
  http://localhost:3001/graphql \
  -H 'Content-Type: application/json' \
  -d 
    "query": "{ authors(limit: 2) { list { id first_name last_name } count } }"
```

**2. Fetch a specific author by ID:**
```bash
curl -X POST \
  http://localhost:3001/graphql \
  -H 'Content-Type: application/json' \
  -d 
    "query": "{ authors(id: 1) { list { id first_name last_name } } }"
```

**3. Fetch authors with their posts (demonstrates DataLoader):**
```bash
curl -X POST \
  http://localhost:3001/graphql \
  -H 'Content-Type: application/json' \
  -d 
    "query": "{ authors(limit: 2) { list { id first_name last_name posts { id title } } } }"
```

**4. Fetch a list of posts:**
```bash
curl -X POST \
  http://localhost:3001/graphql \
  -H 'Content-Type: application/json' \
  -d 
    "query": "{ posts(limit: 2) { list { id title } count } }"
```

**5. Fetch a specific post by ID:**
```bash
curl -X POST \
  http://localhost:3001/graphql \
  -H 'Content-Type: application/json' \
  -d 
    "query": "{ posts(id: 1) { list { id title } } }"
```

**6. Fetch posts with their author (demonstrates DataLoader):**
```bash
curl -X POST \
  http://localhost:3001/graphql \
  -H 'Content-Type: application/json' \
  -d 
    "query": "{ posts(limit: 2) { list { id title author { id first_name last_name } } } }"
```

### REST API

The REST API base URL is `http://localhost:3001/rest`.

#### Example Queries with `curl`

---

### GraphQL Playground / Apollo Studio
GraphQL APIs are self-documenting through introspection. You can explore the API schema and execute queries using tools like GraphQL Playground or Apollo Studio, which are accessible at the GraphQL endpoint:
`http://localhost:3001/graphql`

#### Example Queries with `curl`

**1. Get all authors:**
```bash
curl http://localhost:3001/rest/authors
```

**2. Get author by ID:**
```bash
curl http://localhost:3001/rest/authors/1
```

**3. Get authors count:**
```bash
curl http://localhost:3001/rest/authors-count
```

**4. Get all posts:**
```bash
curl http://localhost:3001/rest/posts
```

**5. Get post by ID:**
```bash
curl http://localhost:3001/rest/posts/1
```

**6. Get posts count:**
```bash
curl http://localhost:3001/rest/posts-count
```

**7. Get posts by author ID:**
```bash
curl http://localhost:3001/rest/posts-by-author/1
```

**8. Get posts by author ID (list only):**
```bash
curl http://localhost:3001/rest/posts-by-author-list/1
```

**9. Get posts by author ID (count):**
```bash
curl http://localhost:3001/rest/posts-by-author-count/1
```
