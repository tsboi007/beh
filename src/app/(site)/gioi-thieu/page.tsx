import type { Metadata } from "next";
import { Award, Building2, Cpu, HeartPulse, Target } from "lucide-react";
import { ButtonLink, Container, PageHero, SectionHeading } from "@/components/ui";
import { EQUIPMENT, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Giới thiệu bệnh viện",
  description:
    "Bệnh viện Mắt Bà Rịa – Vũng Tàu: tiền thân là Trung tâm Mắt (2006), nâng cấp thành bệnh viện chuyên khoa tuyến tỉnh năm 2014. Hệ thống thiết bị Carl Zeiss hiện đại.",
  alternates: { canonical: "/gioi-thieu" },
};

const TIMELINE = [
  { year: "2006", title: "Thành lập Trung tâm Mắt", desc: "Hình thành các phòng chức năng đầu tiên cùng Phòng khám – Cấp cứu, đặt nền móng cho chuyên khoa Mắt của tỉnh." },
  {
    year: "2014",
    title: "Nâng cấp thành Bệnh viện Mắt",
    desc: "Trở thành bệnh viện chuyên khoa tuyến tỉnh. Thành lập Khoa Khúc xạ – Mắt trẻ em – Chấn thương – Tạo hình thẩm mỹ cùng các phòng chức năng mới.",
  },
  {
    year: "Hôm nay",
    title: "Đầu tư công nghệ Carl Zeiss",
    desc: "Đồng bộ hệ thống chẩn đoán, phẫu thuật khúc xạ và Phaco hiện đại. Triển khai dự án cộng đồng \"Vì đôi mắt Việt Nam\".",
  },
];

const DEPARTMENTS = [
  "Khoa Khám bệnh – Cấp cứu",
  "Khoa Khúc xạ – Mắt trẻ em – Chấn thương – Tạo hình thẩm mỹ",
  "Các khoa lâm sàng điều trị",
  "Khoa Cận lâm sàng",
  "Phòng Kế hoạch tổng hợp – Thiết bị y tế",
  "Phòng Điều dưỡng",
  "Phòng Quản lý chất lượng & CNTT",
  "Phòng Tổ chức – Hành chính",
  "Phòng Tài chính – Kế toán",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Về chúng tôi"
        title={SITE.name}
        lead={`Bệnh viện chuyên khoa Mắt tuyến tỉnh trực thuộc ${SITE.owner}. Gần 20 năm đồng hành cùng sức khỏe thị giác của người dân Bà Rịa – Vũng Tàu và khu vực lân cận.`}
      />

      {/* Values from the official tagline */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Giá trị cốt lõi" title={`“${SITE.tagline}”`} />
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: Cpu, title: "Kỹ thuật cao", desc: "Ứng dụng kỹ thuật hiện đại: ReLEx SMILE, Phaco, OCT, laser quang đông, trên nền tảng thiết bị Carl Zeiss." },
              { icon: Award, title: "Chất lượng cao", desc: "Quy trình chuyên môn chuẩn hóa, quản lý chất lượng và an toàn người bệnh được đặt lên hàng đầu." },
              { icon: Target, title: "Hiệu quả cao", desc: "Chẩn đoán chính xác, điều trị cá nhân hóa, tối ưu chi phí và áp dụng Bảo hiểm y tế." },
            ].map(({ icon: Icon, title, desc }) => (
              <li key={title} data-reveal className="rounded-3xl border border-line bg-white p-8 shadow-soft">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-700 text-white">
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold text-ink">{title}</h3>
                <p className="mt-3 text-muted">{desc}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Timeline */}
      <section className="bg-gradient-to-b from-primary-50/70 to-white py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Lịch sử hình thành" title="Chặng đường phát triển" />
          <ol className="relative mx-auto mt-14 max-w-3xl border-l-2 border-primary-200 pl-8 sm:pl-12">
            {TIMELINE.map((t) => (
              <li key={t.year} data-reveal className="relative pb-12 last:pb-0">
                <span className="absolute -left-[2.6rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-4 ring-primary-200 sm:-left-[3.6rem]">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                </span>
                <p className="font-display text-3xl font-bold text-primary-700">{t.year}</p>
                <h3 className="mt-1 text-xl font-semibold text-ink">{t.title}</h3>
                <p className="mt-2 text-muted">{t.desc}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Equipment */}
      <section id="thiet-bi" className="scroll-mt-24 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Trang thiết bị"
            title="Hệ thống thiết bị y tế hiện đại"
            lead="Toàn bộ là thiết bị của Carl Zeiss Meditec (CHLB Đức), hãng hàng đầu thế giới về quang học và nhãn khoa."
          />
          <div className="mt-12 overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
            <table className="w-full text-left">
              <caption className="sr-only">Danh sách thiết bị y tế</caption>
              <thead className="bg-primary-800 text-white">
                <tr>
                  <th scope="col" className="px-5 py-4 font-semibold sm:px-7">Thiết bị</th>
                  <th scope="col" className="hidden px-5 py-4 font-semibold md:table-cell">Chức năng</th>
                  <th scope="col" className="px-5 py-4 font-semibold sm:px-7">Nhóm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {EQUIPMENT.map((e) => (
                  <tr key={e.name} className="align-top hover:bg-primary-50/40">
                    <td className="px-5 py-5 sm:px-7">
                      <p className="font-display text-lg font-bold text-ink">{e.name}</p>
                      <p className="text-[0.95rem] text-muted">{e.kind}</p>
                    </td>
                    <td className="hidden px-5 py-5 text-ink-soft md:table-cell">{e.detail}</td>
                    <td className="px-5 py-5 sm:px-7">
                      <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-800">{e.group}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Organisation */}
      <section className="bg-primary-900 py-20 text-white sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div data-reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-primary-200">
              <Building2 className="h-4 w-4" aria-hidden /> Cơ cấu tổ chức
            </p>
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">Các khoa, phòng</h2>
            <p className="mt-4 text-lg text-primary-100">
              Bộ máy tổ chức gồm các khoa lâm sàng, cận lâm sàng và phòng chức năng phối hợp chặt chẽ, lấy người bệnh làm trung tâm.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {DEPARTMENTS.map((d) => (
              <li key={d} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-primary-300" aria-hidden />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="py-20 text-center">
        <h2 className="font-display text-3xl font-bold text-ink">Sẵn sàng chăm sóc đôi mắt của bạn</h2>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/dat-lich">Đặt lịch khám</ButtonLink>
          <ButtonLink href="/bac-si" variant="secondary">
            Đội ngũ bác sĩ
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
