import { asc, desc } from "drizzle-orm";
import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { AdminHeader, Panel } from "@/components/admin/bits";
import { Badge } from "@/components/ui";
import { toggleContact } from "../../actions";
import { formatDateTime } from "@/lib/utils";

export default async function ContactsAdmin() {
  const db = await adminDb();
  const rows = await db.select().from(schema.contacts).orderBy(asc(schema.contacts.handled), desc(schema.contacts.createdAt)).limit(300);
  return (
    <>
      <AdminHeader title="Tin nhắn liên hệ" desc="Tin nhắn gửi từ trang Liên hệ." />
      <ul className="space-y-3">
        {rows.map((c) => (
          <li key={c.id}>
            <Panel className={`p-5 ${c.handled ? "opacity-70" : ""}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink">{c.fullName}</span>
                <a href={`tel:${c.phone}`} className="font-semibold text-primary-700">{c.phone}</a>
                {c.email ? <a href={`mailto:${c.email}`} className="text-primary-700">{c.email}</a> : null}
                <span className="text-sm text-muted">{formatDateTime(c.createdAt)}</span>
                {c.handled ? <Badge>Đã xử lý</Badge> : <Badge tone="amber">Mới</Badge>}
              </div>
              <p className="mt-2 whitespace-pre-line text-ink-soft">{c.message}</p>
              <form action={toggleContact} className="mt-3">
                <input type="hidden" name="id" value={c.id} />
                {!c.handled ? <input type="hidden" name="handled" value="on" /> : null}
                <button className="min-h-10 cursor-pointer rounded-lg px-4 font-semibold text-primary-800 ring-1 ring-primary-200 hover:bg-primary-50">
                  {c.handled ? "Đánh dấu chưa xử lý" : "Đánh dấu đã xử lý"}
                </button>
              </form>
            </Panel>
          </li>
        ))}
        {rows.length === 0 ? <Panel className="p-10 text-center text-muted">Chưa có tin nhắn.</Panel> : null}
      </ul>
    </>
  );
}
