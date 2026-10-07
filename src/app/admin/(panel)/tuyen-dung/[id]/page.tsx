import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { AdminHeader, DeleteButton, Panel } from "@/components/admin/bits";
import { EditForm, MarkdownEditor, Toggle } from "@/components/admin/editor";
import { Field, inputClass } from "@/components/ui";
import { deleteJob, saveJob } from "../../../actions";

export default async function EditJob({ params }: PageProps<"/admin/tuyen-dung/[id]">) {
  const { id } = await params;
  const isNew = id === "moi";
  const db = await adminDb();
  const [j] = isNew ? [] : await db.select().from(schema.jobs).where(eq(schema.jobs.id, Number(id)));
  if (!isNew && !j) notFound();

  return (
    <>
      <Link href="/admin/tuyen-dung" className="mb-4 inline-flex items-center gap-1.5 text-muted hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Tuyển dụng
      </Link>
      <AdminHeader title={isNew ? "Đăng tin tuyển dụng" : `Sửa: ${j!.title}`} />
      <EditForm action={saveJob}>
        <input type="hidden" name="id" value={j?.id ?? ""} />
        <Panel className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <Field label="Vị trí tuyển dụng" htmlFor="title" required className="sm:col-span-2">
            <input id="title" name="title" defaultValue={j?.title} required className={inputClass} />
          </Field>
          <Field label="Khoa / phòng" htmlFor="department">
            <input id="department" name="department" defaultValue={j?.department} className={inputClass} />
          </Field>
          <Field label="Hình thức" htmlFor="employmentType">
            <input id="employmentType" name="employmentType" defaultValue={j?.employmentType ?? "Toàn thời gian"} className={inputClass} />
          </Field>
          <Field label="Số lượng" htmlFor="quantity">
            <input id="quantity" name="quantity" type="number" min={1} defaultValue={j?.quantity ?? 1} className={inputClass} />
          </Field>
          <Field label="Mức lương" htmlFor="salary">
            <input id="salary" name="salary" defaultValue={j?.salary ?? "Theo quy định"} className={inputClass} />
          </Field>
          <Field label="Hạn nộp hồ sơ" htmlFor="deadline">
            <input id="deadline" name="deadline" type="date" defaultValue={j?.deadline ?? ""} className={inputClass} />
          </Field>
          <div className="flex items-end pb-3">
            <Toggle name="published" label="Đăng trên website" defaultChecked={j?.published ?? true} />
          </div>
          <div className="sm:col-span-2">
            <MarkdownEditor name="description" label="Mô tả công việc, yêu cầu, quyền lợi" defaultValue={j?.description ?? ""} />
          </div>
        </Panel>
      </EditForm>
      {j ? <DeleteButton id={j.id} action={deleteJob} label="Xóa tin" /> : null}
    </>
  );
}
