import { desc, isNull, sql } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { AdminHeader, Panel, smallInput } from "@/components/admin/bits";
import { Badge } from "@/components/ui";
import { answerQuestion, deleteQuestion } from "../../actions";
import { formatDateTime } from "@/lib/utils";
import { QUESTION_TOPICS } from "@/lib/site";

export default async function QaAdmin() {
  const db = await adminDb();
  const rows = await db
    .select()
    .from(schema.questions)
    .orderBy(sql`${isNull(schema.questions.answer)} desc`, desc(schema.questions.createdAt));

  return (
    <>
      <AdminHeader title="Hỏi đáp" desc="Trả lời câu hỏi rồi bật “Đăng công khai” để hiển thị trên trang Hỏi đáp. SĐT và email người hỏi không bao giờ được công khai." />
      <ul className="space-y-4">
        {rows.map((q) => (
          <li key={q.id}>
            <Panel className="p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted">
                {q.answer ? (q.published ? <Badge>Đã đăng</Badge> : <Badge tone="blue">Đã trả lời – chưa đăng</Badge>) : <Badge tone="amber">Chưa trả lời</Badge>}
                <span>{formatDateTime(q.createdAt)}</span>
                {q.phone ? <a href={`tel:${q.phone}`} className="font-semibold text-primary-700">{q.phone}</a> : null}
                {q.email ? <a href={`mailto:${q.email}`} className="text-primary-700">{q.email}</a> : null}
              </div>
              <form action={answerQuestion} className="space-y-3">
                <input type="hidden" name="id" value={q.id} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="text-sm font-medium">
                    Tên hiển thị
                    <input name="fullName" defaultValue={q.fullName} className={`${smallInput} mt-1`} />
                  </label>
                  <label className="text-sm font-medium">
                    Chủ đề
                    <select name="topic" defaultValue={q.topic} className={`${smallInput} mt-1`}>
                      {[...new Set([q.topic, ...QUESTION_TOPICS])].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="block text-sm font-medium">
                  Câu hỏi (có thể biên tập lại cho rõ ràng)
                  <textarea name="question" rows={2} defaultValue={q.question} className={`${smallInput} mt-1`} />
                </label>
                <label className="block text-sm font-medium">
                  Câu trả lời
                  <textarea name="answer" rows={4} defaultValue={q.answer ?? ""} placeholder="Nhập câu trả lời của bác sĩ…" className={`${smallInput} mt-1`} />
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-sm font-medium">
                    <span className="sr-only">Người trả lời</span>
                    <input name="answeredBy" defaultValue={q.answeredBy ?? ""} placeholder="Người trả lời (VD: BS.CKI …)" className={smallInput} />
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" name="published" defaultChecked={q.published} className="h-4 w-4 accent-primary-700" /> Đăng công khai
                  </label>
                  <div className="ml-auto flex gap-2">
                    <button className="min-h-10 cursor-pointer rounded-lg bg-primary-700 px-4 font-semibold text-white hover:bg-primary-800">Lưu</button>
                    <button formAction={deleteQuestion} className="flex min-h-10 cursor-pointer items-center rounded-lg px-3 text-accent-700 ring-1 ring-accent-100 hover:bg-accent-100" aria-label="Xóa câu hỏi">
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </form>
            </Panel>
          </li>
        ))}
        {rows.length === 0 ? <Panel className="p-10 text-center text-muted">Chưa có câu hỏi nào.</Panel> : null}
      </ul>
    </>
  );
}
