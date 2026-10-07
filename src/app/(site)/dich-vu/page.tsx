import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, PageHero } from "@/components/ui";
import { ServiceIcon } from "@/components/service-icon";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dịch vụ khám & điều trị mắt",
  description:
    "Khám mắt tổng quát, phẫu thuật cận thị ReLEx SMILE, phẫu thuật Phaco, điều trị Glôcôm, nhãn nhi – lác, bệnh võng mạc tại Bệnh viện Mắt Bà Rịa – Vũng Tàu.",
  alternates: { canonical: "/dich-vu" },
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero
        eyebrow="Dịch vụ"
        title="Dịch vụ chuyên khoa Mắt"
        lead="Đầy đủ các chuyên khoa sâu, thực hiện trên hệ thống thiết bị Carl Zeiss. Hầu hết dịch vụ được áp dụng Bảo hiểm y tế."
      />
      <Container className="py-16 sm:py-20">
        <ul className="grid gap-6 md:grid-cols-2">
          {services.map((sv) => (
            <li key={sv.id} data-reveal>
              <Link
                href={`/dich-vu/${sv.slug}`}
                className="group flex h-full gap-6 rounded-3xl border border-line bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lift sm:p-8"
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700">
                  <ServiceIcon name={sv.icon} className="h-8 w-8" />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-2xl font-bold text-ink group-hover:text-primary-700">{sv.title}</span>
                  <span className="mt-2 text-muted">{sv.shortDesc}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-primary-700">
                    Xem chi tiết <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
