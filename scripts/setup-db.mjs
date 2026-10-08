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

/* ---------- One-time data imports (recorded in settings so they never overwrite later Admin edits) ---------- */

async function once(key, label, fn) {
  const done = await db.execute(sql`select 1 from settings where key = ${key}`);
  if (done.rows?.length) return;
  await fn();
  await db.execute(sql`insert into settings (key, value) values (${key}, ${new Date().toISOString()})`);
  console.log(`✓ ${label}`);
}

const readJson = async (p) => JSON.parse(await (await import("node:fs/promises")).readFile(new URL(p, import.meta.url), "utf8"));

async function insertBatched(table, rows, size = 50) {
  for (let i = 0; i < rows.length; i += size) {
    const chunk = rows.slice(i, i + size);
    const cols = Object.keys(chunk[0]);
    const values = chunk.map((r) => `(${cols.map((c) => lit(r[c])).join(",")})`).join(",");
    await db.execute(sql.raw(`insert into ${table} (${cols.map((c) => `"${c}"`).join(",")}) values ${values}`));
  }
}

// Official price list (Nghị quyết 399/NQ-HĐND, 28/08/2025) replaces the placeholder rows.
await once("import:price-list-2025", "Imported official price list 2025", async () => {
  const { items } = await readJson("./data/price-list-2025.json");
  await db.execute(sql`delete from price_items`);
  await insertBatched(
    "price_items",
    items.map((i) =>
      snake({
        category: i.category,
        name: i.name,
        price: i.price,
        insurancePrice: i.insurancePrice,
        insured: i.insurancePrice !== null,
        unit: "lần",
        note: i.note,
        sortOrder: i.sortOrder,
      }),
    ),
  );
});

// Staff list from the HIS user export (names, department, practising certificate only).
await once("import:staff-2025", "Imported hospital staff list", async () => {
  const staff = await readJson("./data/staff.json");
  let order = 10;
  for (const s of staff.sort((a, b) => Number(b.isDoctor) - Number(a.isDoctor))) {
    const existing = await db.execute(sql`select id from doctors where slug = ${s.slug}`);
    if (existing.rows?.length) {
      await db.execute(sql`update doctors set license = ${s.license}, is_doctor = ${s.isDoctor} where slug = ${s.slug}`);
    } else {
      await insertBatched("doctors", [
        snake({
          slug: s.slug,
          name: s.name,
          degree: s.isDoctor ? "Bác sĩ" : "",
          position: "",
          specialty: s.department,
          bio: "",
          license: s.license,
          isDoctor: s.isDoctor,
          sortOrder: order++,
        }),
      ]);
    }
  }
});

// Official working hours (10/2026).
await once("import:hours-2026-10", "Updated working hours", async () => {
  for (const [key, value] of [
    ["workingHours", "Thứ 2 – Thứ 6: 7:15 – 11:30 và 13:30 – 16:45"],
    ["emergencyNote", "Thứ 7, Chủ nhật: chỉ tiếp nhận các trường hợp cấp cứu"],
  ]) {
    await db.execute(sql`insert into settings (key, value) values (${key}, ${value}) on conflict (key) do update set value = excluded.value`);
  }
});

// Admin account: created once from ADMIN_EMAIL / ADMIN_PASSWORD. After that the password is
// managed in Admin → Đổi mật khẩu; set ADMIN_RESET_PASSWORD=1 for one deploy to force-reset it.
const email = process.env.ADMIN_EMAIL?.toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (email && password) {
  const hash = await bcrypt.hash(password, 12);
  const reset = process.env.ADMIN_RESET_PASSWORD === "1";
  const res = await db.execute(
    reset
      ? sql`insert into admins (email, name, password_hash) values (${email}, ${"Quản trị viên"}, ${hash})
            on conflict (email) do update set password_hash = excluded.password_hash returning id`
      : sql`insert into admins (email, name, password_hash) values (${email}, ${"Quản trị viên"}, ${hash})
            on conflict (email) do nothing returning id`,
  );
  console.log(res.rows?.length ? `✓ Admin account ${reset ? "password reset" : "created"}: ${email}` : `✓ Admin account exists: ${email}`);
} else if ((await count("admins")) === 0) {
  console.warn("! No admin account. Set ADMIN_EMAIL and ADMIN_PASSWORD then run again.");
}

await close();
console.log("Done.");
