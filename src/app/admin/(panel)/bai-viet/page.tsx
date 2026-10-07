import Link from "next/link";
import { desc } from "drizzle-orm";
import { Pencil } from "lucide-react";
import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { AdminHeader, NewButton, Panel, SavedNotice, tdClass, thClass } from "@/components/admin/bits";
import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default async function PostsAdmin({ searchParams }: PageProps<"/admin/bai-viet">) {
  const sp = await searchParams;
  const db = await adminDb();
  const rows = await db
    .select({
      id: schema.posts.id,
      title: schema.posts.title,
      slug: schema.posts.slug,
      category: schema.posts.category,
      published: schema.posts.published,
      publishedAt: schema.posts.publishedAt,
    })
    .from(schema.posts)
    .orderBy(desc(schema.posts.publishedAt));

  return (
    <>
      <AdminHeader title="Bài viết" desc="Tin tức, kiến thức y khoa chuẩn SEO." action={<NewButton href="/admin/bai-viet/moi">Viết bài mới</NewButton>} />
      <SavedNotice show={sp.saved === "1"} />
      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[40rem]">
          <thead className="border-b border-line bg-slate-50">
            <tr>
              <th className={thClass}>Tiêu đề</th>
              <th className={thClass}>Chuyên mục</th>
              <th className={thClass}>Ngày đăng</th>
              <th className={thClass}>Trạng thái</th>
              <th className={thClass}><span className="sr-only">Sửa</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className={tdClass}>
                  <Link href={`/admin/bai-viet/${r.id}`} className="font-semibold text-ink hover:text-primary-700">
                    {r.title}
                  </Link>
                  <p className="text-sm text-muted">/tin-tuc/{r.slug}</p>
                </td>
                <td className={tdClass}>{r.category}</td>
                <td className={`${tdClass} whitespace-nowrap`}>{formatDate(r.publishedAt)}</td>
                <td className={tdClass}>{r.published ? <Badge>Đã đăng</Badge> : <Badge tone="gray">Nháp</Badge>}</td>
                <td className={tdClass}>
                  <Link href={`/admin/bai-viet/${r.id}`} className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-primary-50" aria-label={`Sửa ${r.title}`}>
                    <Pencil className="h-4 w-4 text-primary-700" aria-hidden />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
