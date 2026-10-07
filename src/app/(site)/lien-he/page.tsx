import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, Siren } from "lucide-react";
import { Container, PageHero } from "@/components/ui";
import { ContactForm } from "@/components/forms/simple-forms";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Địa chỉ, số điện thoại, email và bản đồ đường đi đến Bệnh viện Mắt Bà Rịa – Vũng Tàu, 17 Phạm Ngọc Thạch, Phường Bà Rịa.",
  alternates: { canonical: "/lien-he" },
};

export default async function ContactPage() {
  const s = await getSettings();
  const items = [
    { icon: MapPin, label: "Địa chỉ", value: s.address },
    { icon: Phone, label: "Hotline tư vấn", value: s.hotline, href: `tel:${s.hotline.replace(/[^\d+]/g, "")}` },
    { icon: Phone, label: "Tổng đài", value: s.phone, href: `tel:${s.phone.replace(/[^\d+]/g, "")}` },
    { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    { icon: Clock, label: "Giờ làm việc", value: s.workingHours },
    { icon: Siren, label: "Cấp cứu", value: s.emergencyNote },
  ];
  return (
    <>
      <PageHero eyebrow="Liên hệ" title="Liên hệ với chúng tôi" lead="Bệnh viện luôn sẵn sàng lắng nghe và hỗ trợ bạn." />
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {items.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-4 rounded-3xl border border-line bg-white p-5 shadow-soft">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-muted">{label}</p>
                  {href ? (
                    <a href={href} className="break-words font-semibold text-ink hover:text-primary-700">
                      {value}
                    </a>
                  ) : (
                    <p className="font-semibold text-ink">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="overflow-hidden rounded-3xl border border-line shadow-soft">
            <iframe
              title="Bản đồ đường đến Bệnh viện Mắt Bà Rịa – Vũng Tàu"
              src={s.mapEmbedUrl}
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-lift sm:p-10 lg:self-start">
          <h2 className="font-display text-2xl font-bold text-ink">Gửi tin nhắn</h2>
          <p className="mt-2 text-muted">Để đặt lịch khám, vui lòng dùng trang Đặt lịch để được xử lý nhanh hơn.</p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </Container>
    </>
  );
}
