import Link from "next/link";
import { asc } from "drizzle-orm";
import { Pencil } from "lucide-react";
import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { AdminHeader, NewButton, Panel, SavedNotice } from "@/components/admin/bits";
import { ServiceIcon } from "@/components/service-icon";
import { Badge } from "@/components/ui";

export default async function ServicesAdmin({ searchParams }: PageProps<"/admin/dich-vu">) {
  const sp = await searchParams;
  const db = await adminDb();
  const rows = await db.select().from(schema.services).orderBy(asc(schema.services.sortOrder), asc(schema.services.id));
  return (
    <>
      <AdminHeader title="Dịch vụ" desc="Các dịch vụ hiển thị ở trang chủ, menu và form đặt lịch." action={<NewButton href="/admin/dich-vu/moi">Thêm dịch vụ</NewButton>} />
      <SavedNotice show={sp.saved === "1"} />
      <ul className="grid gap-3">
        {rows.map((r) => (
          <li key={r.id}>
            <Panel className="flex items-center gap-4 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                <ServiceIcon name={r.icon} className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">
                  {r.title} {!r.published ? <Badge tone="gray">Ẩn</Badge> : null}
                </p>
                <p className="truncate text-sm text-muted">{r.shortDesc}</p>
              </div>
              <span className="text-sm text-muted">Thứ tự {r.sortOrder}</span>
              <Link href={`/admin/dich-vu/${r.id}`} className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-primary-50" aria-label={`Sửa ${r.title}`}>
                <Pencil className="h-4 w-4 text-primary-700" aria-hidden />
              </Link>
            </Panel>
          </li>
        ))}
      </ul>
    </>
  );
}
