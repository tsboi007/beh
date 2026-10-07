import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, CalendarClock, Users } from "lucide-react";
import { Container, PageHero } from "@/components/ui";
import { ApplyForm } from "@/components/forms/simple-forms";
import { getJobs } from "@/lib/data";
import { formatYmd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tuyển dụng",
  description: "Cơ hội nghề nghiệp tại Bệnh viện Mắt Bà Rịa – Vũng Tàu: bác sĩ, điều dưỡng, kỹ thuật viên khúc xạ và các vị trí hành chính.",
  alternates: { canonical: "/tuyen-dung" },
};

export default async function JobsPage() {
  const jobs = await getJobs();
  return (
    <>
      <PageHero
        eyebrow="Tuyển dụng"
        title="Cùng chúng tôi mang lại ánh sáng"
        lead="Môi trường chuyên nghiệp, thiết bị hiện đại, cơ hội được đào tạo chuyên sâu trong lĩnh vực Nhãn khoa."
      />
      <Container className="py-12 sm:py-16">
        {jobs.length > 0 ? (
          <ul className="grid gap-5">
            {jobs.map((j) => (
              <li key={j.id} data-reveal>
                <Link
                  href={`/tuyen-dung/${j.slug}`}
                  className="group flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift sm:flex-row sm:items-center sm:justify-between sm:p-8"
                >
                  <div>
                    <h2 className="font-display text-2xl font-bold text-ink group-hover:text-primary-700">{j.title}</h2>
                    <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-muted">
                      <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4" aria-hidden /> {j.department}</span>
                      <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" aria-hidden /> Số lượng: {j.quantity}</span>
                      {j.deadline ? (
                        <span className="inline-flex items-center gap-1.5"><CalendarClock className="h-4 w-4" aria-hidden /> Hạn nộp: {formatYmd(j.deadline)}</span>
                      ) : null}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-primary-700">
                    Xem chi tiết <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="font-display text-3xl font-bold text-ink">Hiện chưa có vị trí đang tuyển</h2>
              <p className="mt-4 text-lg text-muted">
                Bạn vẫn có thể gửi hồ sơ ứng tuyển tự do. Phòng Tổ chức – Hành chính sẽ lưu trữ và liên hệ khi có vị trí phù hợp.
              </p>
            </div>
            <div className="rounded-[2rem] border border-line bg-white p-6 shadow-lift sm:p-10">
              <h2 className="font-display text-2xl font-bold text-ink">Gửi hồ sơ tự do</h2>
              <div className="mt-6">
                <ApplyForm />
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
