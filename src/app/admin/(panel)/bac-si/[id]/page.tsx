import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { AdminHeader, DeleteButton, Panel } from "@/components/admin/bits";
import { EditForm, ImageField, Toggle } from "@/components/admin/editor";
import { Field, inputClass } from "@/components/ui";
import { deleteDoctor, saveDoctor } from "../../../actions";

export default async function EditDoctor({ params }: PageProps<"/admin/bac-si/[id]">) {
  const { id } = await params;
  const isNew = id === "moi";
  const db = await adminDb();
  const [d] = isNew ? [] : await db.select().from(schema.doctors).where(eq(schema.doctors.id, Number(id)));
  if (!isNew && !d) notFound();

  return (
    <>
      <Link href="/admin/bac-si" className="mb-4 inline-flex items-center gap-1.5 text-muted hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Bác sĩ & nhân sự
      </Link>
      <AdminHeader title={isNew ? "Thêm nhân sự" : `Sửa: ${d!.name}`} />
      <EditForm action={saveDoctor}>
        <input type="hidden" name="id" value={d?.id ?? ""} />
        <Panel className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <Field label="Họ và tên" htmlFor="name" required>
            <input id="name" name="name" defaultValue={d?.name} required className={inputClass} />
          </Field>
          <Field label="Học hàm / học vị" htmlFor="degree" hint="VD: BS.CKII, ThS.BS, TTND – BS.CKII">
            <input id="degree" name="degree" defaultValue={d?.degree} className={inputClass} />
          </Field>
          <Field label="Chức vụ" htmlFor="position" hint="VD: Trưởng khoa Khúc xạ">
            <input id="position" name="position" defaultValue={d?.position} className={inputClass} />
          </Field>
          <Field label="Khoa / phòng hoặc chuyên môn" htmlFor="specialty">
            <input id="specialty" name="specialty" defaultValue={d?.specialty} className={inputClass} />
          </Field>
          <Field label="Giới thiệu ngắn" htmlFor="bio" className="sm:col-span-2">
            <textarea id="bio" name="bio" rows={4} defaultValue={d?.bio} className={inputClass} />
          </Field>
          <Field label="Số chứng chỉ hành nghề (CCHN)" htmlFor="license" hint="VD: 000568/BRVT-CCHN">
            <input id="license" name="license" defaultValue={d?.license ?? ""} className={inputClass} />
          </Field>
          <div className="flex items-end pb-3">
            <Toggle name="isDoctor" label="Là bác sĩ (hiện ở danh sách bác sĩ & form đặt lịch)" defaultChecked={d?.isDoctor ?? true} />
          </div>
          <Field label="Thứ tự hiển thị" htmlFor="sortOrder">
            <input id="sortOrder" name="sortOrder" type="number" defaultValue={d?.sortOrder ?? 0} className={inputClass} />
          </Field>
          <div className="flex items-end pb-3">
            <Toggle name="published" label="Hiển thị trên website" defaultChecked={d?.published ?? true} />
          </div>
          <div className="sm:col-span-2">
            <ImageField name="photo" label="Ảnh chân dung (nên dùng ảnh dọc 4:5)" current={d?.photo ?? null} />
          </div>
        </Panel>
      </EditForm>
      {d ? <DeleteButton id={d.id} action={deleteDoctor} label="Xóa bác sĩ" /> : null}
    </>
  );
}
