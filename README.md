# Node.js Challenge API

Small Fastify + TypeScript API used for the Rocketseat challenge. Implements basic CRUD-like endpoints for "courses" using Drizzle ORM and Postgres. Includes OpenAPI docs served via a nicer UI at `/docs` in development.

## Tech stack

- Node.js (ESM)
- TypeScript
- Fastify
- Drizzle ORM (Postgres)
- Zod for request/response schemas
- @scalar/fastify-api-reference (API docs)

## Requirements

- Node.js (v18+ recommended)
- PostgreSQL database
- A `.env` file with `DATABASE_URL` pointing to your Postgres instance

## Quickstart

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root with at least:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
NODE_ENV=development
```

3. Run database migrations (Drizzle)

```bash
npm run db:migrate
```

4. Start the server in development

```bash
npm run dev
```

The server listens on port `3333` by default. When `NODE_ENV=development` the OpenAPI docs are available at `/docs` and the OpenAPI JSON is exposed by Fastify Swagger.

## Available npm scripts

- `npm run dev` — start server in dev mode (uses `node --experimental-strip-types --watch src/server.ts` with `.env`).
- `npm run db:generate` — run `drizzle-kit generate` to regenerate schema/migrations outputs.
- `npm run db:migrate` — run `drizzle-kit migrate` to apply pending migrations.
- `npm run db:studio` — open Drizzle Studio (UI) if configured.

## Project layout (important files)

- `src/server.ts` — Fastify server setup and route registration
- `src/http/routes/` — route definitions:
  - `create-courses.ts` — POST `/courses`
  - `get-courses.ts` — GET `/courses`
  - `get-course-by-id.ts` — GET `/courses/:id`
- `src/db/schema.ts` — Drizzle schema for the `courses` table
- `src/db/client.ts` — Drizzle client configuration
- `drizzle.config.ts` — Drizzle kit configuration (reads `DATABASE_URL`)
- `drizzle/` — generated migrations and SQL files

## API Endpoints

All endpoints are JSON-based and validated using Zod. The server uses Fastify's type provider for Zod, so request bodies/params and responses follow the schemas defined in the route files.

- GET /courses
  - Description: Returns a list of courses
  - Response 200:
    ```json
    { "courses": [{ "id": "uuid", "title": "string" }, ...] }
    ```
  - Example:
    ```bash
    curl http://localhost:3333/courses
    ```

- GET /courses/:id
  - Description: Returns a single course by its UUID
  - URL param: `id` (UUID)
  - Response 200:
    ```json
    { "course": { "id": "uuid", "title": "string", "description": "string|null" } }
    ```
  - Response 404: empty body (course not found)
  - Example:
    ```bash
    curl http://localhost:3333/courses/00000000-0000-0000-0000-000000000000
    ```

- POST /courses
  - Description: Create a new course
  - Body:
    ```json
    { "title": "A course title (min 5 chars)" }
    ```
  - Response 201:
    ```json
    { "courseId": "uuid" }
    ```
  - Example:
    ```bash
    curl -X POST http://localhost:3333/courses \
      -H "Content-Type: application/json" \
      -d '{"title":"My new course"}'
    ```

## Database & migrations

- The project uses Drizzle (drizzle-kit) for migrations and schema generation. The config is in `drizzle.config.ts` and requires `DATABASE_URL` to be set.
- Migrations (SQL) and snapshots are stored in the `drizzle/` folder.

Useful commands:

```bash
npm run db:generate   # regenerate outputs/snapshots
npm run db:migrate    # apply migrations
npm run db:studio     # open drizzle studio (if applicable)
```

## Development notes

- The server uses a custom `dev` script that runs Node with `--experimental-strip-types` to execute TypeScript directly. If you run into issues with the experimental flag or prefer to compile first, use TypeScript compiler:

```bash
npx tsc
node dist/server.js
```

- Alternatively install `ts-node` for a more standard TypeScript runtime during development.

## Troubleshooting

- Error: "ERR_UNKNOWN_FILE_EXTENSION" — Node tried to run `.ts` directly without the experimental flag or a loader. Use `npm run dev`, compile with `tsc`, or run with `ts-node`.
- If migrations fail, confirm `DATABASE_URL` is correct and the database server is reachable.

## Architecture

```mermaid
sequenceDiagram
  participant C as Client
  participant S as Fastify Server
  participant V as Zod Validator
  participant DB as Drizzle + PostgreSQL

  C->>S: POST /courses {title}
  S->>V: Validate body
  V-->>S: OK or Error 400
  alt valid
    S->>DB: INSERT INTO courses (title)
    DB-->>S: {id}
    S-->>C: 201 {courseId}
  else invalid
    S-->>C: 400
  end

  C->>S: GET /courses
  S->>DB: SELECT id,title FROM courses
  DB-->>S: list
  S-->>C: 200 {courses: [...]} 

  C->>S: GET /courses/:id
  S->>V: Validate param id (uuid)
  V-->>S: OK or Error 400
  alt found
    S->>DB: SELECT * FROM courses WHERE id=...
    DB-->>S: course
    S-->>C: 200 {course}
  else not found
    S-->>C: 404
  end
```

Note: GitHub and many Markdown renderers support Mermaid diagrams — if the diagram doesn't render in your viewer, open the file in VS Code with the "Markdown Preview Mermaid Support" extension or view it on GitHub.

## License

This project uses the `ISC` license (see `package.json`).
