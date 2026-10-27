
import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}
if (databaseUrl) {
  const url = new URL(databaseUrl);

  console.log("[VETOR DATABASE]", {
    host: url.hostname,
    database: url.pathname.replace("/", ""),
    environment: process.env.VERCEL_ENV ?? "local",
  });
}
const globalForDb = globalThis as typeof globalThis & {
  __vetorPool?: Pool;
};

export const pool =
  globalForDb.__vetorPool ??
  new Pool({
    connectionString: databaseUrl,
    max: 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__vetorPool = pool;
}

export const db = drizzle(pool);
