import Image from "next/image";
import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { Pencil, UserRound } from "lucide-react";
import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { AdminHeader, NewButton, Panel, SavedNotice } from "@/components/admin/bits";
import { Badge } from "@/components/ui";

export default async function DoctorsAdmin({ searchParams }: PageProps<"/admin/bac-si">) {
  const sp = await searchParams;
  const db = await adminDb();
  const rows = await db.select().from(schema.doctors).orderBy(desc(schema.doctors.isDoctor), asc(schema.doctors.sortOrder), asc(schema.doctors.id));
  return (
    <>
      <AdminHeader title="Bác sĩ & nhân sự" desc={`${rows.filter((r) => r.isDoctor).length} bác sĩ · ${rows.filter((r) => !r.isDoctor).length} nhân sự khác. Bác sĩ hiện ở trang Đội ngũ và form đặt lịch.`} action={<NewButton href="/admin/bac-si/moi">Thêm nhân sự</NewButton>} />
      <SavedNotice show={sp.saved === "1"} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((d) => (
          <li key={d.id}>
            <Panel className="flex items-center gap-4 p-4">
              <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-100 text-primary-700">
                {d.photo ? <Image src={d.photo} alt="" fill className="object-cover" sizes="64px" /> : <UserRound className="h-8 w-8" aria-hidden />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary-700">{d.isDoctor ? d.degree || "Bác sĩ" : d.specialty}</p>
                <p className="font-semibold text-ink">{d.name}</p>
                <p className="truncate text-sm text-muted">
                  {d.isDoctor ? d.position || d.specialty : d.license ? `CCHN ${d.license}` : "Nhân viên"} {!d.published ? <Badge tone="gray">Ẩn</Badge> : null}
                </p>
              </div>
              <Link href={`/admin/bac-si/${d.id}`} className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-primary-50" aria-label={`Sửa ${d.name}`}>
                <Pencil className="h-4 w-4 text-primary-700" aria-hidden />
              </Link>
            </Panel>
          </li>
        ))}
      </ul>
    </>
  );
}
