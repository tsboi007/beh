import type { Metadata } from "next";
import { MessagesSquare, ShieldCheck, Stethoscope } from "lucide-react";
import { Container, PageHero } from "@/components/ui";
import { QuestionForm } from "@/components/forms/simple-forms";
import { JsonLd } from "@/components/json-ld";
import { getPublishedQuestions } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hỏi đáp bác sĩ",
  description: "Gửi câu hỏi về bệnh lý mắt, phẫu thuật Phaco, mổ cận thị, Glôcôm… và nhận giải đáp từ bác sĩ chuyên khoa Bệnh viện Mắt Bà Rịa – Vũng Tàu.",
  alternates: { canonical: "/hoi-dap" },
};

export default async function QaPage() {
  const questions = await getPublishedQuestions();
  return (
    <>
      <PageHero
        eyebrow="Hỏi đáp"
        title="Hỏi đáp cùng bác sĩ"
        lead="Đặt câu hỏi miễn phí. Câu trả lời của bác sĩ chuyên khoa sẽ được đăng công khai để nhiều người cùng tham khảo."
      />
      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.3fr_1fr]">
        <section aria-labelledby="qa-list">
          <h2 id="qa-list" className="font-display text-2xl font-bold text-ink">
            Câu hỏi đã được giải đáp ({questions.length})
          </h2>
          <ul className="mt-6 space-y-5">
            {questions.map((q) => (
              <li key={q.id} data-reveal className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-7">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="rounded-full bg-secondary-100 px-2.5 py-0.5 font-semibold text-secondary-700">{q.topic}</span>
                  <span className="text-muted">{q.fullName}</span>
                </div>
                <h3 className="mt-3 flex gap-3 text-lg font-semibold text-ink">
                  <MessagesSquare className="mt-1 h-5 w-5 shrink-0 text-secondary-600" aria-hidden />
                  {q.question}
                </h3>
                {q.answer ? (
                  <div className="mt-4 rounded-2xl bg-primary-50 p-5">
                    <p className="flex items-center gap-2 text-sm font-semibold text-primary-800">
                      <Stethoscope className="h-4 w-4" aria-hidden /> {q.answeredBy ?? "Bác sĩ"}
                      {q.answeredAt ? <span className="font-normal text-muted">· {formatDate(q.answeredAt)}</span> : null}
                    </p>
                    <p className="mt-2 whitespace-pre-line text-ink-soft">{q.answer}</p>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <aside id="dat-cau-hoi" className="scroll-mt-28 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-lift sm:p-8">
            <h2 className="font-display text-2xl font-bold text-ink">Đặt câu hỏi</h2>
            <p className="mt-2 flex items-start gap-2 text-sm text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden />
              Số điện thoại và email được bảo mật, chỉ dùng khi bác sĩ cần hỏi thêm thông tin.
            </p>
            <div className="mt-6">
              <QuestionForm />
            </div>
          </div>
        </aside>
      </Container>

      {questions.length > 0 ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: questions
              .filter((q) => q.answer)
              .map((q) => ({
                "@type": "Question",
                name: q.question,
                acceptedAnswer: { "@type": "Answer", text: q.answer },
              })),
          }}
        />
      ) : null}
    </>
  );
}
