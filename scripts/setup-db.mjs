// Runs migrations, seeds initial content (only into empty tables) and ensures the admin account.
// Local:  npm run db:setup   (uses embedded PGlite in ./.data/pglite when DATABASE_URL is unset)
// Vercel: runs automatically in "vercel-build" against Neon (DATABASE_URL).
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import * as seed from "./seed-data.mjs";

const url = process.env.DATABASE_URL;
let db, migrate, close;

if (url) {
  const { neon } = await import("@neondatabase/serverless");
  const { drizzle } = await import("drizzle-orm/neon-http");
  ({ migrate } = await import("drizzle-orm/neon-http/migrator"));
  db = drizzle(neon(url));
  close = async () => {};
  console.log("→ Database: Neon (DATABASE_URL)");
} else {
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  ({ migrate } = await import("drizzle-orm/pglite/migrator"));
  const dir = process.env.PGLITE_DIR ?? "./.data/pglite";
  (await import("node:fs")).mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  db = drizzle(client);
  close = () => client.close();
  console.log(`→ Database: PGlite (${dir})`);
}

await migrate(db, { migrationsFolder: "./drizzle" });
console.log("✓ Migrations applied");

const count = async (table) => Number((await db.execute(sql.raw(`select count(*)::int as n from ${table}`))).rows?.[0]?.n ?? 0);
const lit = (v) =>
  v === null || v === undefined
    ? "null"
    : typeof v === "boolean" || typeof v === "number"
      ? String(v)
      : `'${String(v).replaceAll("'", "''")}'`;

async function insertMany(table, rows) {
  for (const r of rows) {
    const cols = Object.keys(r);
    await db.execute(
      sql.raw(`insert into ${table} (${cols.map((c) => `"${c}"`).join(",")}) values (${cols.map((c) => lit(r[c])).join(",")})`),
    );
  }
}

const snake = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase()), v]));

if ((await count("services")) === 0) {
  await insertMany("services", seed.services.map((s, i) => snake({ ...s, sortOrder: i, seoTitle: null })));
  console.log(`✓ Seeded ${seed.services.length} services`);
}
if ((await count("doctors")) === 0) {
  await insertMany("doctors", seed.doctors.map(snake));
  console.log(`✓ Seeded ${seed.doctors.length} doctors`);
}
if ((await count("price_items")) === 0) {
  await insertMany("price_items", seed.priceItems.map(snake));
  console.log(`✓ Seeded ${seed.priceItems.length} price items`);
}
if ((await count("posts")) === 0) {
  const now = Date.now();
  await insertMany(
    "posts",
    seed.posts.map(({ daysAgo, ...p }) => snake({ ...p, publishedAt: new Date(now - daysAgo * 86400000).toISOString() })),
  );
  console.log(`✓ Seeded ${seed.posts.length} posts`);
}
if ((await count("questions")) === 0) {
  const now = new Date().toISOString();
  await insertMany(
    "questions",
    seed.questions.map((q) => snake({ ...q, answeredBy: "Bệnh viện Mắt BR-VT", published: true, answeredAt: now })),
  );
  console.log(`✓ Seeded ${seed.questions.length} questions`);
}
if ((await count("jobs")) === 0) {
  await insertMany("jobs", seed.jobs.map(snake));
  console.log(`✓ Seeded ${seed.jobs.length} jobs (draft)`);
}

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
if (email && password) {
  const hash = await bcrypt.hash(password, 12);
  await db.execute(
    sql`insert into admins (email, name, password_hash) values (${email.toLowerCase()}, ${"Quản trị viên"}, ${hash})
        on conflict (email) do update set password_hash = excluded.password_hash`,
  );
  console.log(`✓ Admin account ready: ${email}`);
} else if ((await count("admins")) === 0) {
  console.warn("! No admin account. Set ADMIN_EMAIL and ADMIN_PASSWORD then run again.");
}

await close();
console.log("Done.");
