import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { AdminHeader, DeleteButton, Panel } from "@/components/admin/bits";
import { EditForm, ImageField, MarkdownEditor, Toggle } from "@/components/admin/editor";
import { Field, inputClass } from "@/components/ui";
import { deletePost, savePost } from "../../../actions";

const CATEGORIES = ["Kiến thức về mắt", "Tin hoạt động", "Glôcôm", "Đục thủy tinh thể", "Tật khúc xạ", "Mắt trẻ em", "Bệnh võng mạc"];

export default async function EditPost({ params }: PageProps<"/admin/bai-viet/[id]">) {
  const { id } = await params;
  const isNew = id === "moi";
  const db = await adminDb();
  const [post] = isNew ? [] : await db.select().from(schema.posts).where(eq(schema.posts.id, Number(id)));
  if (!isNew && !post) notFound();
  const toLocal = (d: Date) => new Date(d.getTime() + 7 * 3600_000).toISOString().slice(0, 16);

  return (
    <>
      <Link href="/admin/bai-viet" className="mb-4 inline-flex items-center gap-1.5 text-muted hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Danh sách bài viết
      </Link>
      <AdminHeader
        title={isNew ? "Viết bài mới" : "Sửa bài viết"}
        action={
          post ? (
            <a href={`/tin-tuc/${post.slug}`} target="_blank" className="font-semibold text-primary-700 underline">
              Xem trên website
            </a>
          ) : null
        }
      />
      <EditForm action={savePost}>
        <input type="hidden" name="id" value={post?.id ?? ""} />
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <Panel className="space-y-5 p-5 sm:p-6">
            <Field label="Tiêu đề" htmlFor="title" required>
              <input id="title" name="title" defaultValue={post?.title} required className={inputClass} />
            </Field>
            <Field label="Mô tả ngắn (hiển thị ở danh sách & Google)" htmlFor="excerpt" hint="Khoảng 140–160 ký tự.">
              <textarea id="excerpt" name="excerpt" rows={3} defaultValue={post?.excerpt} className={inputClass} />
            </Field>
            <MarkdownEditor name="content" label="Nội dung" defaultValue={post?.content ?? ""} />
          </Panel>
          <div className="space-y-6">
            <Panel className="space-y-5 p-5">
              <Toggle name="published" label="Hiển thị trên website" defaultChecked={post?.published ?? true} />
              <Field label="Chuyên mục" htmlFor="category">
                <input id="category" name="category" list="cats" defaultValue={post?.category ?? CATEGORIES[0]} className={inputClass} />
                <datalist id="cats">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Ngày đăng" htmlFor="publishedAt">
                <input id="publishedAt" name="publishedAt" type="datetime-local" defaultValue={post ? toLocal(post.publishedAt) : ""} className={inputClass} />
              </Field>
              <Field label="Đường dẫn (slug)" htmlFor="slug" hint="Để trống để tạo tự động từ tiêu đề.">
                <input id="slug" name="slug" defaultValue={post?.slug} className={inputClass} />
              </Field>
            </Panel>
            <Panel className="p-5">
              <ImageField name="coverImage" label="Ảnh đại diện" current={post?.coverImage ?? null} />
            </Panel>
            <Panel className="space-y-5 p-5">
              <p className="font-semibold text-ink">SEO (không bắt buộc)</p>
              <Field label="Tiêu đề SEO" htmlFor="seoTitle">
                <input id="seoTitle" name="seoTitle" defaultValue={post?.seoTitle ?? ""} className={inputClass} />
              </Field>
              <Field label="Mô tả SEO" htmlFor="seoDesc">
                <textarea id="seoDesc" name="seoDesc" rows={3} defaultValue={post?.seoDesc ?? ""} className={inputClass} />
              </Field>
            </Panel>
          </div>
        </div>
      </EditForm>
      {post ? <DeleteButton id={post.id} action={deletePost} label="Xóa bài viết" /> : null}
    </>
  );
}
