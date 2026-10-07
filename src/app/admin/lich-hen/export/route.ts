import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { type NextRequest } from "next/server";
import { getDb, schema } from "@/lib/db";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import { STATUS_LABEL, formatDateTime, formatYmd } from "@/lib/utils";
import type { AppointmentStatus } from "@/lib/db/schema";

const csv = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;

export async function GET(req: NextRequest) {
  const admin = await verifyToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!admin) return new Response("Unauthorized", { status: 401 });

  const sp = req.nextUrl.searchParams;
  const a = schema.appointments;
  const where: SQL[] = [];
  if (sp.get("status")) where.push(eq(a.status, sp.get("status") as AppointmentStatus));
  if (sp.get("date")) where.push(eq(a.preferredDate, sp.get("date")!));
  const q = sp.get("q")?.trim();
  if (q) where.push(or(ilike(a.fullName, `%${q}%`), ilike(a.phone, `%${q}%`), ilike(a.code, `%${q}%`))!);

  const db = await getDb();
  const rows = await db
    .select({ a, service: schema.services.title })
    .from(a)
    .leftJoin(schema.services, eq(a.serviceId, schema.services.id))
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(a.preferredDate), desc(a.id));

  const header = ["Mã", "Họ tên", "Năm sinh", "SĐT", "Email", "Dịch vụ", "Ngày khám", "Khung giờ", "Trạng thái", "Ghi chú BN", "Ghi chú nội bộ", "Thời điểm đặt"];
  const lines = rows.map(({ a: r, service }) =>
    [r.code, r.fullName, r.birthYear, r.phone, r.email, service, formatYmd(r.preferredDate), r.preferredTime, STATUS_LABEL[r.status], r.note, r.adminNote, formatDateTime(r.createdAt)]
      .map(csv)
      .join(","),
  );
  // BOM so Excel opens Vietnamese text correctly
  const body = "﻿" + [header.map(csv).join(","), ...lines].join("\r\n");
  return new Response(body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="lich-hen.csv"`,
      "cache-control": "no-store",
    },
  });
}
