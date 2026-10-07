import Link from "next/link";
import { and, count, desc, eq, gte, isNull } from "drizzle-orm";
import { ArrowRight, Briefcase, CalendarCheck, Clock, Mail, MessagesSquare } from "lucide-react";
import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { getAdmin } from "@/lib/auth";
import { AdminHeader, Panel } from "@/components/admin/bits";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatYmd } from "@/lib/utils";

export default async function Dashboard() {
  const admin = await getAdmin();
  const db = await adminDb();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  const a = schema.appointments;

  const [[pending], [todayCount], [openQ], [openC], [newApps], upcoming] = await Promise.all([
    db.select({ n: count() }).from(a).where(eq(a.status, "pending")),
    db.select({ n: count() }).from(a).where(eq(a.preferredDate, today)),
    db.select({ n: count() }).from(schema.questions).where(isNull(schema.questions.answer)),
    db.select({ n: count() }).from(schema.contacts).where(eq(schema.contacts.handled, false)),
    db.select({ n: count() }).from(schema.applications).where(eq(schema.applications.status, "new")),
    db
      .select({ a, service: schema.services.title })
      .from(a)
      .leftJoin(schema.services, eq(a.serviceId, schema.services.id))
      .where(and(gte(a.preferredDate, today)))
      .orderBy(a.preferredDate, a.preferredTime, desc(a.id))
      .limit(8),
  ]);

  const stats = [
    { label: "Lịch hẹn chờ xác nhận", value: pending.n, href: "/admin/lich-hen?status=pending", icon: Clock, tone: "bg-amber-100 text-amber-800" },
    { label: "Lịch hẹn hôm nay", value: todayCount.n, href: `/admin/lich-hen?date=${today}`, icon: CalendarCheck, tone: "bg-primary-100 text-primary-800" },
    { label: "Câu hỏi chưa trả lời", value: openQ.n, href: "/admin/hoi-dap", icon: MessagesSquare, tone: "bg-secondary-100 text-secondary-700" },
    { label: "Liên hệ chưa xử lý", value: openC.n, href: "/admin/lien-he", icon: Mail, tone: "bg-slate-100 text-slate-700" },
    { label: "Hồ sơ ứng tuyển mới", value: newApps.n, href: "/admin/tuyen-dung#ho-so", icon: Briefcase, tone: "bg-accent-100 text-accent-700" },
  ];

  return (
    <>
      <AdminHeader title={`Xin chào, ${admin?.name ?? "Quản trị viên"}`} desc="Tổng quan hoạt động của website hôm nay." />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(({ label, value, href, icon: Icon, tone }) => (
          <li key={label}>
            <Link href={href} className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="mt-4 font-display text-3xl font-bold text-ink">{value}</span>
              <span className="mt-1 text-sm text-muted">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Panel className="mt-8">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl font-bold text-ink">Lịch hẹn sắp tới</h2>
          <Link href="/admin/lich-hen" className="inline-flex items-center gap-1 font-semibold text-primary-700">
            Tất cả <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="px-5 py-10 text-center text-muted">Chưa có lịch hẹn sắp tới.</p>
        ) : (
          <ul className="divide-y divide-line">
            {upcoming.map(({ a: r, service }) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-semibold text-ink">
                    {r.fullName} <span className="font-normal text-muted">· {r.phone}</span>
                  </p>
                  <p className="text-sm text-muted">
                    {formatYmd(r.preferredDate)} · {r.preferredTime} · {service ?? "Chưa chọn dịch vụ"}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
