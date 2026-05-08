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

## Project Setup

### 1) Clone and install dependencies

```bash
git clone <repo-url>
cd sopk-app
npm install
```

### 2) Configure environment

Create `.env.local` in project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=require"
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
npm run dev    # start local dev server
npm run lint   # run ESLint
npm run build  # production build check
```

## Current Status

- `/` -> homepage with upcoming quizzes
- `/quiz` -> quiz list from PostgreSQL
- `/quiz/[id]` -> quiz detail header from PostgreSQL
- `/categories` -> categories list from PostgreSQL

## Notes for Team

- Use feature branches (`feature/...`) and open PRs to `main`.
- Do not commit `.env.local` or secrets.
- If DB schema changes, update SQL scripts in `Documentation/` so everyone stays in sync.
