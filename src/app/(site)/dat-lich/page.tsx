import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, FileText, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Container, PageHero } from "@/components/ui";
import { BookingForm } from "@/components/forms/booking-form";
import { getDoctors, getServices, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Đặt lịch khám mắt online",
  description: "Đặt lịch khám mắt trực tuyến tại Bệnh viện Mắt Bà Rịa – Vũng Tàu: chọn dịch vụ, ngày giờ phù hợp, nhận mã đặt lịch ngay.",
  alternates: { canonical: "/dat-lich" },
};

export default async function BookingPage() {
  const [services, doctors, s] = await Promise.all([getServices(), getDoctors(), getSettings()]);
  const tel = s.hotline.replace(/[^\d+]/g, "");

  return (
    <>
      <PageHero
        eyebrow="Đặt lịch khám"
        title="Đặt lịch khám mắt online"
        lead="Chỉ mất khoảng 1 phút. Bệnh viện sẽ gọi điện xác nhận lịch hẹn với bạn trong giờ hành chính."
      />
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_22rem]">
        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-10">
          <Suspense fallback={<div className="min-h-[40rem]" />}>
            <BookingForm
              services={services.map((x) => ({ id: x.id, title: x.title, slug: x.slug }))}
              doctors={doctors.map((d) => ({ id: d.id, title: `${d.degree} ${d.name}` }))}
              hotline={s.hotline}
            />
          </Suspense>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-primary-800 p-7 text-white">
            <h2 className="font-display text-xl font-bold">Đặt lịch qua điện thoại</h2>
            <a href={`tel:${tel}`} className="mt-4 flex items-center gap-3 text-2xl font-bold">
              <Phone className="h-6 w-6 text-primary-300" aria-hidden /> {s.hotline}
            </a>
            <p className="mt-4 flex items-start gap-3 text-primary-100">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-primary-300" aria-hidden /> {s.workingHours}
            </p>
            <p className="mt-3 flex items-start gap-3 text-primary-100">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary-300" aria-hidden /> {s.address}
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-7">
            <h2 className="font-display text-xl font-bold text-ink">Khi đến khám, vui lòng mang theo</h2>
            <ul className="mt-4 space-y-3 text-ink-soft">
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden /> Thẻ BHYT hoặc ứng dụng VNeID (nếu có)
              </li>
              <li className="flex gap-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden /> CCCD / giấy tờ tùy thân
              </li>
              <li className="flex gap-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden /> Kính đang đeo, đơn thuốc và kết quả khám cũ
              </li>
            </ul>
          </div>
        </aside>
      </Container>
    </>
  );
}
