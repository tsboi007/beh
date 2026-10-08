"use server";

import bcrypt from "bcryptjs";
import { eq, like, or } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getDb, schema } from "@/lib/db";
import { createSession, destroySession, getAdmin, requireAdmin } from "@/lib/auth";
import { TAGS } from "@/lib/data";
import { saveUpload } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { APPOINTMENT_STATUSES, type AppointmentStatus } from "@/lib/db/schema";
import { DEFAULT_SETTINGS } from "@/lib/site";

export type AdminState = { ok?: boolean; error?: string };

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const opt = (fd: FormData, k: string) => str(fd, k) || null;
const num = (fd: FormData, k: string, d = 0) => {
  const n = Number(str(fd, k));
  return Number.isFinite(n) ? n : d;
};
const bool = (fd: FormData, k: string) => fd.get(k) === "on";

async function imageFrom(fd: FormData, field: string, current: string | null) {
  if (fd.get(`${field}__remove`) === "on") return null;
  const f = fd.get(field);
  if (f instanceof File && f.size > 0) return saveUpload(f, "image");
  return current;
}

/* ---------------- Auth ---------------- */

const attempts = new Map<string, { n: number; at: number }>();

export async function login(_: AdminState, fd: FormData): Promise<AdminState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0] ?? "local";
  const a = attempts.get(ip);
  if (a && a.n >= 8 && Date.now() - a.at < 15 * 60 * 1000) {
    return { error: "Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút." };
  }
  // Accept the full email or just its username part ("admin" for admin@beh.vn).
  const login = str(fd, "email").toLowerCase();
  const username = login.replace(/[^a-z0-9._-]/g, "");
  const password = String(fd.get("password") ?? "");
  if (!login || !password) return { error: "Vui lòng nhập tên đăng nhập và mật khẩu." };
  const db = await getDb();
  const [admin] = await db
    .select()
    .from(schema.admins)
    .where(login.includes("@") ? eq(schema.admins.email, login) : or(eq(schema.admins.email, login), like(schema.admins.email, `${username}@%`)))
    .limit(1);
  const ok = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
  if (!admin || !ok) {
    attempts.set(ip, { n: (a?.n ?? 0) + 1, at: Date.now() });
    return { error: "Tên đăng nhập hoặc mật khẩu không đúng." };
  }
  attempts.delete(ip);
  await createSession({ id: admin.id, email: admin.email, name: admin.name });
  redirect("/admin");
}

export async function changePassword(_: AdminState, fd: FormData): Promise<AdminState> {
  const session = await getAdmin();
  if (!session) redirect("/admin/login");
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  const db = await getDb();
  const [admin] = await db.select().from(schema.admins).where(eq(schema.admins.id, session.id)).limit(1);
  if (!admin || !(await bcrypt.compare(current, admin.passwordHash))) return { error: "Mật khẩu hiện tại không đúng." };
  if (next.length < 8) return { error: "Mật khẩu mới cần tối thiểu 8 ký tự." };
  if (next === current) return { error: "Mật khẩu mới phải khác mật khẩu hiện tại." };
  if (next !== confirm) return { error: "Nhập lại mật khẩu mới chưa khớp." };
  if (next.toLowerCase().includes(admin.email.split("@")[0])) return { error: "Mật khẩu không được chứa tên đăng nhập." };
  await db.update(schema.admins).set({ passwordHash: await bcrypt.hash(next, 12) }).where(eq(schema.admins.id, admin.id));
  return { ok: true };
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------------- Appointments ---------------- */

export async function updateAppointment(fd: FormData) {
  await requireAdmin();
  const id = num(fd, "id");
  const status = str(fd, "status") as AppointmentStatus;
  if (!APPOINTMENT_STATUSES.includes(status)) return;
  const db = await getDb();
  await db
    .update(schema.appointments)
    .set({ status, adminNote: opt(fd, "adminNote") })
    .where(eq(schema.appointments.id, id));  refresh();
}

export async function deleteAppointment(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.appointments).where(eq(schema.appointments.id, num(fd, "id")));  refresh();
}

/* ---------------- Posts ---------------- */

export async function savePost(_: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const id = num(fd, "id");
  const title = str(fd, "title");
  if (!title) return { error: "Vui lòng nhập tiêu đề." };
  const db = await getDb();
  const [current] = id ? await db.select().from(schema.posts).where(eq(schema.posts.id, id)) : [];
  let coverImage: string | null;
  try {
    coverImage = await imageFrom(fd, "coverImage", current?.coverImage ?? null);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const publishedAt = str(fd, "publishedAt");
  const values = {
    title,
    slug: slugify(str(fd, "slug") || title),
    excerpt: str(fd, "excerpt"),
    content: str(fd, "content"),
    category: str(fd, "category") || "Kiến thức về mắt",
    published: bool(fd, "published"),
    publishedAt: publishedAt ? new Date(`${publishedAt}:00+07:00`) : new Date(),
    seoTitle: opt(fd, "seoTitle"),
    seoDesc: opt(fd, "seoDesc"),
    coverImage,
    updatedAt: new Date(),
  };
  try {
    if (id) await db.update(schema.posts).set(values).where(eq(schema.posts.id, id));
    else await db.insert(schema.posts).values(values);
  } catch {
    return { error: "Đường dẫn (slug) đã tồn tại, vui lòng đổi tiêu đề hoặc slug." };
  }
  updateTag(TAGS.posts);
  redirect("/admin/bai-viet?saved=1");
}

export async function deletePost(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.posts).where(eq(schema.posts.id, num(fd, "id")));
  updateTag(TAGS.posts);
  redirect("/admin/bai-viet");
}

/* ---------------- Services ---------------- */

export async function saveService(_: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const id = num(fd, "id");
  const title = str(fd, "title");
  if (!title) return { error: "Vui lòng nhập tên dịch vụ." };
  const db = await getDb();
  const [current] = id ? await db.select().from(schema.services).where(eq(schema.services.id, id)) : [];
  let image: string | null;
  try {
    image = await imageFrom(fd, "image", current?.image ?? null);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const values = {
    title,
    slug: slugify(str(fd, "slug") || title),
    shortDesc: str(fd, "shortDesc"),
    content: str(fd, "content"),
    icon: str(fd, "icon") || "eye",
    sortOrder: num(fd, "sortOrder"),
    published: bool(fd, "published"),
    seoTitle: opt(fd, "seoTitle"),
    seoDesc: opt(fd, "seoDesc"),
    image,
    updatedAt: new Date(),
  };
  try {
    if (id) await db.update(schema.services).set(values).where(eq(schema.services.id, id));
    else await db.insert(schema.services).values(values);
  } catch {
    return { error: "Đường dẫn (slug) đã tồn tại." };
  }
  updateTag(TAGS.services);
  redirect("/admin/dich-vu?saved=1");
}

export async function deleteService(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.services).where(eq(schema.services.id, num(fd, "id")));
  updateTag(TAGS.services);
  redirect("/admin/dich-vu");
}

/* ---------------- Doctors ---------------- */

export async function saveDoctor(_: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const id = num(fd, "id");
  const name = str(fd, "name");
  if (!name) return { error: "Vui lòng nhập họ tên bác sĩ." };
  const db = await getDb();
  const [current] = id ? await db.select().from(schema.doctors).where(eq(schema.doctors.id, id)) : [];
  let photo: string | null;
  try {
    photo = await imageFrom(fd, "photo", current?.photo ?? null);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const values = {
    name,
    slug: slugify(str(fd, "slug") || name),
    degree: str(fd, "degree"),
    position: str(fd, "position"),
    specialty: str(fd, "specialty"),
    bio: str(fd, "bio"),
    license: opt(fd, "license"),
    isDoctor: bool(fd, "isDoctor"),
    sortOrder: num(fd, "sortOrder"),
    published: bool(fd, "published"),
    photo,
  };
  try {
    if (id) await db.update(schema.doctors).set(values).where(eq(schema.doctors.id, id));
    else await db.insert(schema.doctors).values(values);
  } catch {
    return { error: "Bác sĩ này đã tồn tại (trùng slug)." };
  }
  updateTag(TAGS.doctors);
  redirect("/admin/bac-si?saved=1");
}

export async function deleteDoctor(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.doctors).where(eq(schema.doctors.id, num(fd, "id")));
  updateTag(TAGS.doctors);
  redirect("/admin/bac-si");
}

/* ---------------- Prices ---------------- */

export async function savePriceItem(fd: FormData) {
  await requireAdmin();
  const id = num(fd, "id");
  const values = {
    category: str(fd, "category") || "Khác",
    name: str(fd, "name"),
    price: str(fd, "price") || "Liên hệ",
    insurancePrice: opt(fd, "insurancePrice"),
    unit: str(fd, "unit") || "lần",
    note: opt(fd, "note"),
    insured: !!opt(fd, "insurancePrice") || bool(fd, "insured"),
    sortOrder: num(fd, "sortOrder"),
  };
  if (!values.name) return;
  const db = await getDb();
  if (id) await db.update(schema.priceItems).set(values).where(eq(schema.priceItems.id, id));
  else await db.insert(schema.priceItems).values(values);
  updateTag(TAGS.prices);  refresh();
}

export async function deletePriceItem(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.priceItems).where(eq(schema.priceItems.id, num(fd, "id")));
  updateTag(TAGS.prices);  refresh();
}

/* ---------------- Q&A ---------------- */

export async function answerQuestion(fd: FormData) {
  const admin = await requireAdmin();
  const id = num(fd, "id");
  const answer = opt(fd, "answer");
  const db = await getDb();
  await db
    .update(schema.questions)
    .set({
      question: str(fd, "question"),
      fullName: str(fd, "fullName"),
      topic: str(fd, "topic"),
      answer,
      answeredBy: str(fd, "answeredBy") || admin.name,
      published: bool(fd, "published") && !!answer,
      answeredAt: answer ? new Date() : null,
    })
    .where(eq(schema.questions.id, id));
  updateTag(TAGS.questions);  refresh();
}

export async function deleteQuestion(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.questions).where(eq(schema.questions.id, num(fd, "id")));
  updateTag(TAGS.questions);  refresh();
}

/* ---------------- Jobs & applications ---------------- */

export async function saveJob(_: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const id = num(fd, "id");
  const title = str(fd, "title");
  if (!title) return { error: "Vui lòng nhập vị trí tuyển dụng." };
  const values = {
    title,
    slug: slugify(str(fd, "slug") || title),
    department: str(fd, "department"),
    employmentType: str(fd, "employmentType") || "Toàn thời gian",
    quantity: num(fd, "quantity", 1),
    salary: str(fd, "salary") || "Theo quy định",
    deadline: opt(fd, "deadline"),
    description: str(fd, "description"),
    published: bool(fd, "published"),
  };
  const db = await getDb();
  try {
    if (id) await db.update(schema.jobs).set(values).where(eq(schema.jobs.id, id));
    else await db.insert(schema.jobs).values(values);
  } catch {
    return { error: "Đường dẫn (slug) đã tồn tại." };
  }
  updateTag(TAGS.jobs);
  redirect("/admin/tuyen-dung?saved=1");
}

export async function deleteJob(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.jobs).where(eq(schema.jobs.id, num(fd, "id")));
  updateTag(TAGS.jobs);
  redirect("/admin/tuyen-dung");
}

export async function updateApplication(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.update(schema.applications).set({ status: str(fd, "status") }).where(eq(schema.applications.id, num(fd, "id")));  refresh();
}

/* ---------------- Contacts ---------------- */

export async function toggleContact(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.update(schema.contacts).set({ handled: bool(fd, "handled") }).where(eq(schema.contacts.id, num(fd, "id")));  refresh();
}

/* ---------------- Settings ---------------- */

export async function saveSettings(_: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const db = await getDb();
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    const value = str(fd, key);
    await db
      .insert(schema.settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: schema.settings.key, set: { value } });
  }
  updateTag(TAGS.settings);
  return { ok: true };
}
