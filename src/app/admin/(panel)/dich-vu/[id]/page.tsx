import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { AdminHeader, DeleteButton, Panel } from "@/components/admin/bits";
import { EditForm, MarkdownEditor, Toggle } from "@/components/admin/editor";
import { SERVICE_ICONS } from "@/components/service-icon";
import { Field, inputClass } from "@/components/ui";
import { deleteService, saveService } from "../../../actions";

const ICON_LABELS: Record<string, string> = {
  eye: "Mắt",
  "scan-eye": "Quét mắt (khúc xạ)",
  sparkles: "Lấp lánh (Phaco)",
  activity: "Nhịp (Glôcôm)",
  baby: "Trẻ em",
  aperture: "Võng mạc",
  "shield-plus": "Chấn thương",
  stethoscope: "Ống nghe",
};

export default async function EditService({ params }: PageProps<"/admin/dich-vu/[id]">) {
  const { id } = await params;
  const isNew = id === "moi";
  const db = await adminDb();
  const [sv] = isNew ? [] : await db.select().from(schema.services).where(eq(schema.services.id, Number(id)));
  if (!isNew && !sv) notFound();

  return (
    <>
      <Link href="/admin/dich-vu" className="mb-4 inline-flex items-center gap-1.5 text-muted hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Danh sách dịch vụ
      </Link>
      <AdminHeader title={isNew ? "Thêm dịch vụ" : `Sửa: ${sv!.title}`} />
      <EditForm action={saveService}>
        <input type="hidden" name="id" value={sv?.id ?? ""} />
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <Panel className="space-y-5 p-5 sm:p-6">
            <Field label="Tên dịch vụ" htmlFor="title" required>
              <input id="title" name="title" defaultValue={sv?.title} required className={inputClass} />
            </Field>
            <Field label="Mô tả ngắn" htmlFor="shortDesc" hint="Hiển thị trên thẻ dịch vụ ở trang chủ.">
              <textarea id="shortDesc" name="shortDesc" rows={2} defaultValue={sv?.shortDesc} className={inputClass} />
            </Field>
            <MarkdownEditor name="content" label="Nội dung chi tiết" defaultValue={sv?.content ?? ""} />
          </Panel>
          <div className="space-y-6">
            <Panel className="space-y-5 p-5">
              <Toggle name="published" label="Hiển thị trên website" defaultChecked={sv?.published ?? true} />
              <Field label="Biểu tượng" htmlFor="icon">
                <select id="icon" name="icon" defaultValue={sv?.icon ?? "eye"} className={inputClass}>
                  {Object.keys(SERVICE_ICONS).map((k) => (
                    <option key={k} value={k}>
                      {ICON_LABELS[k] ?? k}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Thứ tự hiển thị" htmlFor="sortOrder">
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={sv?.sortOrder ?? 0} className={inputClass} />
              </Field>
              <Field label="Đường dẫn (slug)" htmlFor="slug">
                <input id="slug" name="slug" defaultValue={sv?.slug} className={inputClass} />
              </Field>
            </Panel>
            <Panel className="space-y-5 p-5">
              <p className="font-semibold text-ink">SEO</p>
              <Field label="Tiêu đề SEO" htmlFor="seoTitle">
                <input id="seoTitle" name="seoTitle" defaultValue={sv?.seoTitle ?? ""} className={inputClass} />
              </Field>
              <Field label="Mô tả SEO" htmlFor="seoDesc">
                <textarea id="seoDesc" name="seoDesc" rows={3} defaultValue={sv?.seoDesc ?? ""} className={inputClass} />
              </Field>
            </Panel>
          </div>
        </div>
      </EditForm>
      {sv ? <DeleteButton id={sv.id} action={deleteService} label="Xóa dịch vụ" /> : null}
    </>
  );
}
