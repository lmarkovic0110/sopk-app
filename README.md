# SOPK Quiz App

Next.js + PostgreSQL web app for pub quiz management.

## Requirements

- Node.js `>= 20.9.0` (recommended: Node 20 LTS)
- npm (comes with Node.js)
- PostgreSQL client tools (`psql`) if you want to import DB scripts manually

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- PostgreSQL (`pg` driver)
- Auth0 (`@auth0/nextjs-auth0`) for sign-in and role-based UI (Admin / Organizator)

## Project Setup

### 1) Clone and install dependencies

```bash
git clone <repo-url>
cd sopk-app
npm install
```

### 2) Configure environment

Create `.env.local` in project root (values come from your Postgres host and Auth0 application):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=require"

# Auth0 (see @auth0/nextjs-auth0 setup — typical names)
AUTH0_SECRET="use-a-long-random-string"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://YOUR_TENANT.auth0.com"
AUTH0_CLIENT_ID="..."
AUTH0_CLIENT_SECRET="..."
```

For Render DB, keep `?sslmode=require` in the URL.

### 3) Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Initialization (if needed)

SQL scripts are in `Documentation/`:

- `Documentation/baza.sql` -> schema (tables/types)
- `Documentation/podaci.sql` -> seed/test data

Run in this order:

```bash
psql "<DATABASE_URL>" -f "./Documentation/baza.sql"
psql "<DATABASE_URL>" -f "./Documentation/podaci.sql"
```

PowerShell tip (quoted identifiers):

```powershell
psql "<DATABASE_URL>" -c 'SELECT COUNT(*) FROM "KvizEvent";'
```

## Useful Commands

```bash
npm run dev     # start local dev server
npm run lint    # run ESLint
npm run build   # production build check
npm run test    # Jest tests (integration tests may skip if DATABASE_URL is unset)
npm run start   # run production server (after build)
```

## Routes (overview)

- `/` — homepage with upcoming quizzes
- `/quiz` — quiz list (search / filters), links to detail and create (for Admin / Organizator)
- `/quiz/create` — create quiz (category & location selects, validation vs venue capacity)
- `/quiz/[id]` — **master–detail**: quiz header (Admin/Organizator can update category & location via selects), team signup form (players from DB as selects), signups table with search, summary sidebar
- `/quiz/[id]/edit` — full quiz edit form
- `/categories` — category **šifrarnik**: list, search, create / update / delete (managed roles)
- `/locations/create` — add a new venue (linked to signed-in host user flow)

Auth routes are under `/api/auth/[auth0]` (login, logout, callback).

## Notes for Team

- Use feature branches (`feature/...`) and open PRs to `main`.
- Do not commit `.env.local` or secrets.
- If DB schema changes, update SQL scripts in `Documentation/` so everyone stays in sync.
