import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { FileDown, Pencil } from "lucide-react";
import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { AdminHeader, NewButton, Panel, SavedNotice, smallInput } from "@/components/admin/bits";
import { Badge } from "@/components/ui";
import { updateApplication } from "../../actions";
import { formatDateTime, formatYmd } from "@/lib/utils";

const APP_STATUS: Record<string, string> = { new: "Mới", reviewing: "Đang xem xét", interview: "Mời phỏng vấn", rejected: "Không phù hợp", hired: "Đã tuyển" };

export default async function JobsAdmin({ searchParams }: PageProps<"/admin/tuyen-dung">) {
  const sp = await searchParams;
  const db = await adminDb();
  const [jobs, apps] = await Promise.all([
    db.select().from(schema.jobs).orderBy(desc(schema.jobs.createdAt)),
    db
      .select({ a: schema.applications, job: schema.jobs.title })
      .from(schema.applications)
      .leftJoin(schema.jobs, eq(schema.applications.jobId, schema.jobs.id))
      .orderBy(desc(schema.applications.createdAt))
      .limit(200),
  ]);

  return (
    <>
      <AdminHeader title="Tuyển dụng" desc="Tin tuyển dụng và hồ sơ ứng viên." action={<NewButton href="/admin/tuyen-dung/moi">Đăng tin mới</NewButton>} />
      <SavedNotice show={sp.saved === "1"} />

      <h2 className="mb-3 font-display text-xl font-bold text-ink">Tin tuyển dụng</h2>
      <ul className="grid gap-3">
        {jobs.map((j) => (
          <li key={j.id}>
            <Panel className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">
                  {j.title} {j.published ? <Badge>Đang đăng</Badge> : <Badge tone="gray">Nháp</Badge>}
                </p>
                <p className="text-sm text-muted">
                  {j.department} · SL {j.quantity}
                  {j.deadline ? ` · Hạn ${formatYmd(j.deadline)}` : ""}
                </p>
              </div>
              <Link href={`/admin/tuyen-dung/${j.id}`} className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-primary-50" aria-label={`Sửa ${j.title}`}>
                <Pencil className="h-4 w-4 text-primary-700" aria-hidden />
              </Link>
            </Panel>
          </li>
        ))}
        {jobs.length === 0 ? <Panel className="p-8 text-center text-muted">Chưa có tin tuyển dụng.</Panel> : null}
      </ul>

      <h2 id="ho-so" className="mb-3 mt-10 scroll-mt-8 font-display text-xl font-bold text-ink">
        Hồ sơ ứng viên ({apps.length})
      </h2>
      <ul className="space-y-3">
        {apps.map(({ a, job }) => (
          <li key={a.id}>
            <Panel className="flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{a.fullName}</p>
                <p className="text-sm text-muted">
                  {job ?? "Ứng tuyển tự do"} · {a.phone} · {a.email} · {formatDateTime(a.createdAt)}
                </p>
                {a.coverLetter ? <p className="mt-1 line-clamp-2 text-[0.95rem] text-ink-soft">{a.coverLetter}</p> : null}
              </div>
              {a.cvUrl ? (
                <a href={a.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 font-semibold text-primary-800 ring-1 ring-primary-200 hover:bg-primary-50">
                  <FileDown className="h-4 w-4" aria-hidden /> CV
                </a>
              ) : null}
              <form action={updateApplication} className="flex gap-2">
                <input type="hidden" name="id" value={a.id} />
                <label>
                  <span className="sr-only">Trạng thái hồ sơ</span>
                  <select name="status" defaultValue={a.status} className={smallInput}>
                    {Object.entries(APP_STATUS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="min-h-10 cursor-pointer rounded-lg bg-primary-700 px-4 font-semibold text-white hover:bg-primary-800">Lưu</button>
              </form>
            </Panel>
          </li>
        ))}
        {apps.length === 0 ? <Panel className="p-8 text-center text-muted">Chưa có hồ sơ.</Panel> : null}
      </ul>
    </>
  );
}
