import "server-only";
import * as schema from "./schema";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

/**
 * Production (Vercel): Neon serverless Postgres via DATABASE_URL.
 * Local development without DATABASE_URL: embedded PGlite stored in ./.data/pglite,
 * so the site runs with zero setup. Both expose the same Drizzle query API.
 */
type DB = NeonHttpDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { __db?: Promise<DB> };

async function createDb(): Promise<DB> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    return drizzle(neon(url), { schema });
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  let dir = process.env.PGLITE_DIR ?? "./.data/pglite";
  if (process.env.NEXT_PHASE === "phase-production-build") {
    // Local `next build` prerenders in several worker processes; PGlite is single-process,
    // so each worker reads its own snapshot copy of the local database.
    const fs = await import("node:fs");
    const os = await import("node:os");
    const path = await import("node:path");
    const copy = fs.mkdtempSync(path.join(os.tmpdir(), "bvm-pglite-"));
    fs.cpSync(dir, copy, { recursive: true });
    dir = copy;
  }
  const client = new PGlite(dir);
  // Same query builder surface; cast keeps one type across drivers.
  return drizzle(client, { schema }) as unknown as DB;
}

export function getDb(): Promise<DB> {
  globalForDb.__db ??= createDb();
  return globalForDb.__db;
}

export { schema };
