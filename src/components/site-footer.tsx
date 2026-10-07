import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Siren } from "lucide-react";
import { Logo } from "./logo";
import { FacebookIcon, TiktokIcon, YoutubeIcon } from "./brand-icons";
import { SITE, type SiteSettings } from "@/lib/site";

export function SiteFooter({ s, services }: { s: SiteSettings; services: { slug: string; title: string }[] }) {
  const year = 2026;
  return (
    <footer className="relative overflow-hidden bg-primary-900 text-primary-100">
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full border-[60px] border-white/[0.03]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo inverted />
            <p className="mt-5 max-w-sm text-primary-200">
              Bệnh viện chuyên khoa Mắt tuyến tỉnh, trực thuộc {SITE.owner}. Tiền thân là Trung tâm Mắt thành lập năm {SITE.founded}.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { href: s.facebookUrl, label: "Facebook", Icon: FacebookIcon },
                { href: s.youtubeUrl, label: "YouTube", Icon: YoutubeIcon },
                { href: s.tiktokUrl, label: "TikTok", Icon: TiktokIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Dịch vụ" className="lg:col-span-3">
            <h2 className="font-display text-lg font-bold text-white">Dịch vụ</h2>
            <ul className="mt-4 space-y-2.5">
              {services.slice(0, 7).map((sv) => (
                <li key={sv.slug}>
                  <Link href={`/dich-vu/${sv.slug}`} className="hover:text-white">
                    {sv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Liên kết nhanh" className="lg:col-span-2">
            <h2 className="font-display text-lg font-bold text-white">Thông tin</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                ["/gioi-thieu", "Giới thiệu"],
                ["/bac-si", "Đội ngũ bác sĩ"],
                ["/bang-gia", "Bảng giá"],
                ["/tin-tuc", "Tin tức"],
                ["/hoi-dap", "Hỏi đáp"],
                ["/tuyen-dung", "Tuyển dụng"],
                ["/tra-cuu", "Tra cứu lịch hẹn"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="font-display text-lg font-bold text-white">Liên hệ</h2>
            <ul className="mt-4 space-y-3.5">
              <li className="flex gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary-300" aria-hidden />
                <span>{s.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-primary-300" aria-hidden />
                <span>
                  Hotline:{" "}
                  <a className="font-semibold text-white" href={`tel:${s.hotline.replace(/[^\d+]/g, "")}`}>
                    {s.hotline}
                  </a>
                  <br />
                  Tổng đài: <a href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}>{s.phone}</a>
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-primary-300" aria-hidden />
                <a href={`mailto:${s.email}`} className="break-all hover:text-white">
                  {s.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-primary-300" aria-hidden />
                <span>{s.workingHours}</span>
              </li>
              <li className="flex gap-3">
                <Siren className="mt-1 h-5 w-5 shrink-0 text-primary-300" aria-hidden />
                <span>{s.emergencyNote}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-primary-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. {SITE.tagline}.
          </p>
          <p>Thông tin trên website chỉ mang tính tham khảo, không thay thế chẩn đoán của bác sĩ.</p>
        </div>
      </div>
    </footer>
  );
}
