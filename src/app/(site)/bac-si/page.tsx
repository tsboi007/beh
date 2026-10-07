import type { Metadata } from "next";
import { BadgeCheck, Users } from "lucide-react";
import { Container, PageHero, SectionHeading } from "@/components/ui";
import { DoctorCard } from "@/components/doctor-card";
import { getDoctors, getStaff } from "@/lib/data";

export const metadata: Metadata = {
  title: "Đội ngũ y bác sĩ",
  description:
    "Đội ngũ bác sĩ, điều dưỡng, kỹ thuật viên và dược sĩ của Bệnh viện Mắt Bà Rịa – Vũng Tàu, kèm số chứng chỉ hành nghề.",
  alternates: { canonical: "/bac-si" },
};

export default async function DoctorsPage() {
  const [doctors, staff] = await Promise.all([getDoctors(), getStaff()]);
  const byDept = Map.groupBy(staff, (s) => s.department || "Khác");

  return (
    <>
      <PageHero
        eyebrow="Đội ngũ chuyên môn"
        title="Đội ngũ y bác sĩ"
        lead={`${doctors.length} bác sĩ cùng hơn ${Math.floor((staff.length + doctors.length) / 10) * 10} cán bộ, viên chức chuyên môn đồng hành chăm sóc đôi mắt của bạn.`}
      />
      <Container className="py-14 sm:py-20">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((d) => (
            <li key={d.id} data-reveal>
              <DoctorCard doctor={d} showBio />
            </li>
          ))}
        </ul>
      </Container>

      {staff.length > 0 ? (
        <section className="border-t border-line bg-white py-16 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Nhân sự"
              title="Cán bộ, viên chức các khoa, phòng"
              lead="Danh sách người hành nghề khám bệnh, chữa bệnh và nhân sự theo từng khoa, phòng."
            />
            <div className="mt-12 gap-6 lg:columns-2">
              {[...byDept.entries()].map(([dept, people]) => (
                <section key={dept} className="mb-6 break-inside-avoid rounded-3xl border border-line bg-canvas p-6" aria-labelledby={`dept-${dept}`}>
                  <h3 id={`dept-${dept}`} className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                    <Users className="h-5 w-5 text-primary-600" aria-hidden /> {dept}
                    <span className="ml-auto rounded-full bg-primary-100 px-2.5 py-0.5 text-sm font-semibold text-primary-800">{people!.length}</span>
                  </h3>
                  <ul className="mt-4 divide-y divide-line">
                    {people!.map((p) => (
                      <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5">
                        <span className="font-medium text-ink">{p.name}</span>
                        {p.license ? (
                          <span className="inline-flex items-center gap-1 text-sm text-muted">
                            <BadgeCheck className="h-3.5 w-3.5 text-primary-600" aria-hidden /> CCHN {p.license}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
