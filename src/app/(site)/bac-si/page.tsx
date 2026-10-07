import type { Metadata } from "next";
import { Container, PageHero } from "@/components/ui";
import { DoctorCard } from "@/components/doctor-card";
import { getDoctors } from "@/lib/data";

export const metadata: Metadata = {
  title: "Đội ngũ bác sĩ",
  description: "Đội ngũ bác sĩ chuyên khoa Mắt giàu kinh nghiệm, tận tâm của Bệnh viện Mắt Bà Rịa – Vũng Tàu.",
  alternates: { canonical: "/bac-si" },
};

export default async function DoctorsPage() {
  const doctors = await getDoctors();
  return (
    <>
      <PageHero
        eyebrow="Đội ngũ chuyên môn"
        title="Bác sĩ của chúng tôi"
        lead="Các bác sĩ chuyên khoa Mắt được đào tạo bài bản, thường xuyên cập nhật kỹ thuật mới và làm việc trên hệ thống thiết bị hiện đại."
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
    </>
  );
}
