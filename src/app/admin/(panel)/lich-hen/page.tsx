import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { Download, Phone, Search, Trash2 } from "lucide-react";
import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { AdminHeader, Panel, smallInput } from "@/components/admin/bits";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteAppointment, updateAppointment } from "../../actions";
import { APPOINTMENT_STATUSES } from "@/lib/db/schema";
import { STATUS_LABEL, formatDateTime, formatYmd } from "@/lib/utils";

export default async function AppointmentsPage({ searchParams }: PageProps<"/admin/lich-hen">) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "";
  const date = typeof sp.date === "string" ? sp.date : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const a = schema.appointments;
  const where: SQL[] = [];
  if (status) where.push(eq(a.status, status as (typeof APPOINTMENT_STATUSES)[number]));
  if (date) where.push(eq(a.preferredDate, date));
  if (q) where.push(or(ilike(a.fullName, `%${q}%`), ilike(a.phone, `%${q}%`), ilike(a.code, `%${q}%`))!);

  const db = await adminDb();
  const rows = await db
    .select({ a, service: schema.services.title, doctor: schema.doctors.name })
    .from(a)
    .leftJoin(schema.services, eq(a.serviceId, schema.services.id))
    .leftJoin(schema.doctors, eq(a.doctorId, schema.doctors.id))
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(a.preferredDate), desc(a.id))
    .limit(200);

  const exportQs = new URLSearchParams({ status, date, q }).toString();

  return (
    <>
      <AdminHeader
        title="Lịch hẹn"
        desc="Gọi điện xác nhận với người bệnh rồi cập nhật trạng thái. Người bệnh tra cứu được trạng thái bằng mã đặt lịch."
        action={
          <a href={`/admin/lich-hen/export?${exportQs}`} className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 font-semibold text-primary-800 ring-1 ring-primary-200 hover:bg-primary-50">
            <Download className="h-5 w-5" aria-hidden /> Xuất Excel (CSV)
          </a>
        }
      />

      <form className="mb-6 grid gap-3 rounded-2xl border border-line bg-white p-4 sm:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative">
          <span className="sr-only">Tìm kiếm</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input name="q" defaultValue={q} placeholder="Tên, SĐT hoặc mã đặt lịch" className={`${smallInput} pl-9`} />
        </label>
        <label>
          <span className="sr-only">Trạng thái</span>
          <select name="status" defaultValue={status} className={smallInput}>
            <option value="">Tất cả trạng thái</option>
            {APPOINTMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Ngày khám</span>
          <input type="date" name="date" defaultValue={date} className={smallInput} />
        </label>
        <button className="min-h-10 cursor-pointer rounded-lg bg-primary-700 px-5 font-semibold text-white hover:bg-primary-800">Lọc</button>
      </form>

      <p className="mb-3 text-sm text-muted">{rows.length} lịch hẹn</p>

      <ul className="space-y-3">
        {rows.length === 0 ? (
          <Panel className="px-5 py-12 text-center text-muted">Không có lịch hẹn phù hợp.</Panel>
        ) : null}
        {rows.map(({ a: r, service, doctor }) => (
          <li key={r.id}>
            <Panel className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink">{r.fullName}</span>
                    {r.birthYear ? <span className="text-sm text-muted">({r.birthYear})</span> : null}
                    <StatusBadge status={r.status} />
                  </p>
                  <p className="mt-1 text-[0.95rem] text-ink-soft">
                    <strong>{formatYmd(r.preferredDate)}</strong> · {r.preferredTime} · {service ?? "Chưa chọn dịch vụ"}
                    {doctor ? ` · BS ${doctor}` : ""}
                  </p>
                  <p className="mt-1 flex flex-wrap gap-x-4 text-sm text-muted">
                    <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1 font-semibold text-primary-700">
                      <Phone className="h-3.5 w-3.5" aria-hidden /> {r.phone}
                    </a>
                    {r.email ? <span>{r.email}</span> : null}
                    <span className="font-mono">{r.code}</span>
                    <span>Đặt lúc {formatDateTime(r.createdAt)}</span>
                  </p>
                  {r.note ? <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-[0.95rem] text-ink-soft">“{r.note}”</p> : null}
                </div>
              </div>
              <form action={updateAppointment} className="mt-4 grid gap-2 border-t border-line pt-4 sm:grid-cols-[12rem_1fr_auto]">
                <input type="hidden" name="id" value={r.id} />
                <select name="status" defaultValue={r.status} aria-label="Trạng thái" className={smallInput}>
                  {APPOINTMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <input name="adminNote" defaultValue={r.adminNote ?? ""} placeholder="Ghi chú nội bộ (VD: đã gọi lúc 9h)" aria-label="Ghi chú nội bộ" className={smallInput} />
                <div className="flex gap-2">
                  <button className="min-h-10 flex-1 cursor-pointer rounded-lg bg-primary-700 px-4 font-semibold text-white hover:bg-primary-800">Lưu</button>
                  <button
                    formAction={deleteAppointment}
                    className="flex min-h-10 cursor-pointer items-center justify-center rounded-lg px-3 text-accent-700 ring-1 ring-accent-100 hover:bg-accent-100"
                    aria-label="Xóa lịch hẹn"
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </form>
            </Panel>
          </li>
        ))}
      </ul>
    </>
  );
}
