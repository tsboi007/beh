import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import { getDb, schema } from "./db";
import { DEFAULT_SETTINGS, type SiteSettings } from "./site";

/**
 * Public, cached reads. Every mutation in Admin calls updateTag(<tag>) so
 * changes show up immediately while visitors get prerendered pages.
 */
export const TAGS = {
  settings: "settings",
  services: "services",
  prices: "prices",
  doctors: "doctors",
  posts: "posts",
  questions: "questions",
  jobs: "jobs",
} as const;

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("days");
  const db = await getDb();
  const rows = await db.select().from(schema.settings);
  const merged = { ...DEFAULT_SETTINGS };
  for (const r of rows) {
    if (r.key in merged) (merged as Record<string, string>)[r.key] = r.value;
  }
  return merged;
}

export async function getServices() {
  "use cache";
  cacheTag(TAGS.services);
  cacheLife("days");
  const db = await getDb();
  return db
    .select()
    .from(schema.services)
    .where(eq(schema.services.published, true))
    .orderBy(asc(schema.services.sortOrder), asc(schema.services.id));
}

export async function getService(slug: string) {
  "use cache";
  cacheTag(TAGS.services);
  cacheLife("days");
  const db = await getDb();
  const [row] = await db
    .select()
    .from(schema.services)
    .where(and(eq(schema.services.slug, slug), eq(schema.services.published, true)))
    .limit(1);
  return row ?? null;
}

export async function getPriceItems() {
  "use cache";
  cacheTag(TAGS.prices);
  cacheLife("days");
  const db = await getDb();
  return db.select().from(schema.priceItems).orderBy(asc(schema.priceItems.sortOrder), asc(schema.priceItems.id));
}

export async function getDoctors() {
  "use cache";
  cacheTag(TAGS.doctors);
  cacheLife("days");
  const db = await getDb();
  return db
    .select()
    .from(schema.doctors)
    .where(and(eq(schema.doctors.published, true), eq(schema.doctors.isDoctor, true)))
    .orderBy(asc(schema.doctors.sortOrder), asc(schema.doctors.id));
}

/** Everyone else on the team page (nurses, technicians, pharmacists, administrative staff). */
export async function getStaff() {
  "use cache";
  cacheTag(TAGS.doctors);
  cacheLife("days");
  const db = await getDb();
  return db
    .select({
      id: schema.doctors.id,
      name: schema.doctors.name,
      department: schema.doctors.specialty,
      position: schema.doctors.position,
      license: schema.doctors.license,
    })
    .from(schema.doctors)
    .where(and(eq(schema.doctors.published, true), eq(schema.doctors.isDoctor, false)))
    .orderBy(asc(schema.doctors.specialty), asc(schema.doctors.sortOrder), asc(schema.doctors.id));
}

export async function getPosts(limit = 100) {
  "use cache";
  cacheTag(TAGS.posts);
  cacheLife("hours");
  const db = await getDb();
  return db
    .select({
      id: schema.posts.id,
      slug: schema.posts.slug,
      title: schema.posts.title,
      excerpt: schema.posts.excerpt,
      coverImage: schema.posts.coverImage,
      category: schema.posts.category,
      publishedAt: schema.posts.publishedAt,
    })
    .from(schema.posts)
    .where(eq(schema.posts.published, true))
    .orderBy(desc(schema.posts.publishedAt))
    .limit(limit);
}

export async function getPost(slug: string) {
  "use cache";
  cacheTag(TAGS.posts);
  cacheLife("hours");
  const db = await getDb();
  const [row] = await db
    .select()
    .from(schema.posts)
    .where(and(eq(schema.posts.slug, slug), eq(schema.posts.published, true)))
    .limit(1);
  return row ?? null;
}

export async function getRelatedPosts(slug: string, category: string) {
  "use cache";
  cacheTag(TAGS.posts);
  cacheLife("hours");
  const db = await getDb();
  return db
    .select({
      slug: schema.posts.slug,
      title: schema.posts.title,
      category: schema.posts.category,
      publishedAt: schema.posts.publishedAt,
      coverImage: schema.posts.coverImage,
      excerpt: schema.posts.excerpt,
    })
    .from(schema.posts)
    .where(and(eq(schema.posts.published, true), ne(schema.posts.slug, slug), eq(schema.posts.category, category)))
    .orderBy(desc(schema.posts.publishedAt))
    .limit(3);
}

export async function getPublishedQuestions() {
  "use cache";
  cacheTag(TAGS.questions);
  cacheLife("hours");
  const db = await getDb();
  return db
    .select({
      id: schema.questions.id,
      fullName: schema.questions.fullName,
      topic: schema.questions.topic,
      question: schema.questions.question,
      answer: schema.questions.answer,
      answeredBy: schema.questions.answeredBy,
      answeredAt: schema.questions.answeredAt,
    })
    .from(schema.questions)
    .where(eq(schema.questions.published, true))
    .orderBy(desc(schema.questions.answeredAt), desc(schema.questions.id));
}

export async function getJobs() {
  "use cache";
  cacheTag(TAGS.jobs);
  cacheLife("hours");
  const db = await getDb();
  return db
    .select()
    .from(schema.jobs)
    .where(eq(schema.jobs.published, true))
    .orderBy(desc(schema.jobs.createdAt));
}

export async function getJob(slug: string) {
  "use cache";
  cacheTag(TAGS.jobs);
  cacheLife("hours");
  const db = await getDb();
  const [row] = await db
    .select()
    .from(schema.jobs)
    .where(and(eq(schema.jobs.slug, slug), eq(schema.jobs.published, true)))
    .limit(1);
  return row ?? null;
}
