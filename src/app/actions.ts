"use server";

import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb, schema } from "@/lib/db";
import { getSettings } from "@/lib/data";
import { notifyStaff } from "@/lib/notify";
import { saveUpload } from "@/lib/storage";
import { PHONE_RE, STATUS_LABEL, appointmentCode, formatYmd, normalizePhone } from "@/lib/utils";

export type FormState<T = undefined> = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
  data?: T;
  values?: Record<string, string>;
};

const phone = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập số điện thoại.")
  .regex(PHONE_RE, "Số điện thoại chưa đúng định dạng (VD: 0912 345 678).");
const optionalEmail = z
  .string()
  .trim()
  .max(120)
  .refine((v) => v === "" || z.email().safeParse(v).success, "Email chưa đúng định dạng.")
  .transform((v) => v || null);

function fieldErrors(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const k = String(issue.path[0] ?? "form");
    out[k] ??= issue.message;
  }
  return out;
}

function formValues(fd: FormData) {
  const v: Record<string, string> = {};
  fd.forEach((val, key) => {
    if (typeof val === "string" && !key.startsWith("$")) v[key] = val;
  });
  return v;
}

/* --- very small per-instance rate limit + honeypot against bots --- */
const hits = new Map<string, number[]>();
async function rateLimited(bucket: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "local";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  return list.length > limit;
}
const isBot = (fd: FormData) => String(fd.get("website") ?? "") !== "";

const TOO_MANY = "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút hoặc gọi hotline.";

/* ---------------- Đặt lịch khám ---------------- */

const bookingSchema = z.object({
  fullName: z.string().trim().min(2, "Vui lòng nhập họ và tên.").max(100),
  phone,
  email: optionalEmail,
  birthYear: z
    .string()
    .trim()
    .transform((v) => (v ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 1900 && v <= 2026), "Năm sinh không hợp lệ."),
  serviceId: z
    .string()
    .transform((v) => (v ? Number(v) : null)),
  doctorId: z
    .string()
    .transform((v) => (v ? Number(v) : null)),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Vui lòng chọn ngày khám."),
  preferredTime: z.string().min(1, "Vui lòng chọn khung giờ."),
  note: z.string().trim().max(1000).transform((v) => v || null),
  consent: z.literal("on", { error: "Vui lòng đồng ý để bệnh viện liên hệ xác nhận." }),
});

export async function bookAppointment(_: FormState<{ code: string }>, fd: FormData): Promise<FormState<{ code: string }>> {
  const values = formValues(fd);
  if (isBot(fd)) return { ok: true, data: { code: "BVM-XXXXXX" } };
  if (await rateLimited("booking")) return { ok: false, message: TOO_MANY, values };

  const parsed = bookingSchema.safeParse({
    fullName: fd.get("fullName") ?? "",
    phone: fd.get("phone") ?? "",
    email: fd.get("email") ?? "",
    birthYear: fd.get("birthYear") ?? "",
    serviceId: fd.get("serviceId") ?? "",
    doctorId: fd.get("doctorId") ?? "",
    preferredDate: fd.get("preferredDate") ?? "",
    preferredTime: fd.get("preferredTime") ?? "",
    note: fd.get("note") ?? "",
    consent: fd.get("consent") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error), message: "Vui lòng kiểm tra lại các thông tin được đánh dấu.", values };
  }

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  if (parsed.data.preferredDate < today) {
    return { ok: false, errors: { preferredDate: "Ngày khám phải từ hôm nay trở đi." }, values };
  }

  const db = await getDb();
  const d = parsed.data;
  let code = appointmentCode();
  for (let i = 0; i < 3; i++) {
    try {
      await db.insert(schema.appointments).values({
        code,
        fullName: d.fullName,
        phone: normalizePhone(d.phone),
        email: d.email,
        birthYear: d.birthYear,
        serviceId: d.serviceId,
        doctorId: d.doctorId,
        preferredDate: d.preferredDate,
        preferredTime: d.preferredTime,
        note: d.note,
      });
      break;
    } catch (e) {
      if (i === 2) throw e;
      code = appointmentCode();
    }
  }

  const s = await getSettings();
  const [svc] = d.serviceId
    ? await db.select({ title: schema.services.title }).from(schema.services).where(eq(schema.services.id, d.serviceId))
    : [];
  await notifyStaff(
    `[Đặt lịch] ${d.fullName} – ${formatYmd(d.preferredDate)} ${d.preferredTime}`,
    [
      `Mã: ${code}`,
      `Họ tên: ${d.fullName}`,
      `SĐT: ${d.phone}`,
      d.email ? `Email: ${d.email}` : "",
      `Dịch vụ: ${svc?.title ?? "Chưa chọn"}`,
      `Ngày giờ mong muốn: ${formatYmd(d.preferredDate)} ${d.preferredTime}`,
      d.note ? `Ghi chú: ${d.note}` : "",
    ].filter(Boolean),
    s.notifyEmail,
  );

  return { ok: true, data: { code } };
}

/* ---------------- Tra cứu lịch hẹn ---------------- */

export type LookupResult = {
  code: string;
  name: string;
  date: string;
  time: string;
  service: string | null;
  status: string;
  statusKey: string;
  createdAt: string;
};

export async function lookupAppointment(_: FormState<LookupResult>, fd: FormData): Promise<FormState<LookupResult>> {
  const values = formValues(fd);
  if (await rateLimited("lookup", 15)) return { ok: false, message: TOO_MANY, values };
  const code = String(fd.get("code") ?? "").trim().toUpperCase();
  const ph = String(fd.get("phone") ?? "").trim();
  const errors: Record<string, string> = {};
  if (!/^BVM-[A-Z0-9]{6}$/.test(code)) errors.code = "Mã đặt lịch có dạng BVM-XXXXXX.";
  if (!PHONE_RE.test(ph)) errors.phone = "Vui lòng nhập đúng số điện thoại đã đăng ký.";
  if (Object.keys(errors).length) return { ok: false, errors, values };

  const db = await getDb();
  const [row] = await db
    .select({
      a: schema.appointments,
      service: schema.services.title,
    })
    .from(schema.appointments)
    .leftJoin(schema.services, eq(schema.appointments.serviceId, schema.services.id))
    .where(and(eq(schema.appointments.code, code), eq(schema.appointments.phone, normalizePhone(ph))))
    .limit(1);

  if (!row) {
    return { ok: false, message: "Không tìm thấy lịch hẹn khớp với mã và số điện thoại này.", values };
  }
  // Mask the name: "Nguyễn Văn An" -> "Nguyễn V. A."
  const parts = row.a.fullName.split(/\s+/);
  const masked = [parts[0], ...parts.slice(1).map((p) => p[0] + ".")].join(" ");
  return {
    ok: true,
    values,
    data: {
      code: row.a.code,
      name: masked,
      date: formatYmd(row.a.preferredDate),
      time: row.a.preferredTime,
      service: row.service,
      status: STATUS_LABEL[row.a.status] ?? row.a.status,
      statusKey: row.a.status,
      createdAt: row.a.createdAt.toISOString(),
    },
  };
}

/* ---------------- Hỏi đáp bác sĩ ---------------- */

const questionSchema = z.object({
  fullName: z.string().trim().min(2, "Vui lòng nhập tên hiển thị.").max(80),
  phone: z.string().trim().refine((v) => v === "" || PHONE_RE.test(v), "Số điện thoại chưa đúng định dạng."),
  email: optionalEmail,
  topic: z.string().min(1),
  question: z.string().trim().min(15, "Câu hỏi cần tối thiểu 15 ký tự để bác sĩ hiểu rõ.").max(2000),
});

export async function askQuestion(_: FormState, fd: FormData): Promise<FormState> {
  const values = formValues(fd);
  if (isBot(fd)) return { ok: true };
  if (await rateLimited("question", 3)) return { ok: false, message: TOO_MANY, values };
  const parsed = questionSchema.safeParse(Object.fromEntries(["fullName", "phone", "email", "topic", "question"].map((k) => [k, fd.get(k) ?? ""])));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), values };
  const db = await getDb();
  await db.insert(schema.questions).values({ ...parsed.data, phone: parsed.data.phone || null });
  const s = await getSettings();
  await notifyStaff(`[Hỏi đáp] Câu hỏi mới – ${parsed.data.topic}`, [parsed.data.fullName, parsed.data.question], s.notifyEmail);
  return { ok: true, message: "Cảm ơn bạn! Câu hỏi đã được gửi tới bác sĩ. Câu trả lời sẽ được đăng trên trang này sau khi duyệt." };
}

/* ---------------- Liên hệ ---------------- */

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Vui lòng nhập họ và tên.").max(100),
  phone,
  email: optionalEmail,
  message: z.string().trim().min(5, "Vui lòng nhập nội dung.").max(3000),
});

export async function sendContact(_: FormState, fd: FormData): Promise<FormState> {
  const values = formValues(fd);
  if (isBot(fd)) return { ok: true };
  if (await rateLimited("contact", 3)) return { ok: false, message: TOO_MANY, values };
  const parsed = contactSchema.safeParse(Object.fromEntries(["fullName", "phone", "email", "message"].map((k) => [k, fd.get(k) ?? ""])));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), values };
  const db = await getDb();
  await db.insert(schema.contacts).values({ ...parsed.data, phone: normalizePhone(parsed.data.phone) });
  const s = await getSettings();
  await notifyStaff(`[Liên hệ] ${parsed.data.fullName}`, [parsed.data.phone, parsed.data.message], s.notifyEmail);
  return { ok: true, message: "Đã gửi thành công! Bệnh viện sẽ liên hệ lại với bạn trong giờ hành chính." };
}

/* ---------------- Ứng tuyển ---------------- */

const applySchema = z.object({
  jobId: z.string().transform((v) => (v ? Number(v) : null)),
  fullName: z.string().trim().min(2, "Vui lòng nhập họ và tên.").max(100),
  phone,
  email: z.email("Email chưa đúng định dạng."),
  coverLetter: z.string().trim().max(3000).transform((v) => v || null),
});

export async function applyJob(_: FormState, fd: FormData): Promise<FormState> {
  const values = formValues(fd);
  if (isBot(fd)) return { ok: true };
  if (await rateLimited("apply", 3)) return { ok: false, message: TOO_MANY, values };
  const parsed = applySchema.safeParse(Object.fromEntries(["jobId", "fullName", "phone", "email", "coverLetter"].map((k) => [k, fd.get(k) ?? ""])));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), values };

  const cv = fd.get("cv");
  if (!(cv instanceof File) || cv.size === 0) return { ok: false, errors: { cv: "Vui lòng đính kèm CV (PDF hoặc Word)." }, values };
  let cvUrl: string;
  try {
    cvUrl = await saveUpload(cv, "cv");
  } catch (e) {
    return { ok: false, errors: { cv: (e as Error).message }, values };
  }

  const db = await getDb();
  await db.insert(schema.applications).values({ ...parsed.data, phone: normalizePhone(parsed.data.phone), cvUrl });
  const s = await getSettings();
  await notifyStaff(`[Tuyển dụng] Hồ sơ mới – ${parsed.data.fullName}`, [parsed.data.email, parsed.data.phone], s.notifyEmail);
  return { ok: true, message: "Hồ sơ đã được gửi! Phòng Tổ chức – Hành chính sẽ liên hệ nếu hồ sơ phù hợp." };
}
