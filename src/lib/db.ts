import { Pool } from "pg";

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }

  return url;
}

const globalForDb = globalThis as unknown as {
  pgPool?: Pool;
};

export const db =
  globalForDb.pgPool ??
  new Pool({
    connectionString: getDatabaseUrl(),
    ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = db;
}
