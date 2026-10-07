import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { Container, PageHero } from "@/components/ui";
import { LookupForm } from "@/components/forms/lookup-form";

export const metadata: Metadata = {
  title: "Tra cứu lịch hẹn",
  description: "Tra cứu trạng thái lịch hẹn khám tại Bệnh viện Mắt Bà Rịa – Vũng Tàu bằng mã đặt lịch và số điện thoại.",
  alternates: { canonical: "/tra-cuu" },
  robots: { index: false },
};

export default function LookupPage() {
  return (
    <>
      <PageHero
        eyebrow="Tra cứu"
        title="Tra cứu lịch hẹn"
        lead="Nhập mã đặt lịch (dạng BVM-XXXXXX) và số điện thoại bạn đã dùng khi đặt lịch."
      />
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-10">
          <LookupForm />
          <p className="mt-8 flex items-start gap-2 text-sm text-muted">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Vì lý do bảo mật, hệ thống chỉ hiển thị thông tin lịch hẹn và che bớt họ tên. Kết quả khám được trả trực tiếp tại bệnh viện.
          </p>
        </div>
      </Container>
    </>
  );
}
