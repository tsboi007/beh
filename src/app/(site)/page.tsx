import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  HeartHandshake,
  MessagesSquare,
  Microscope,
  Phone,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRoundCheck,
  Wallet,
} from "lucide-react";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";
import { HeroVisual } from "@/components/home/hero-visual";
import { ServiceIcon } from "@/components/service-icon";
import { PostCard } from "@/components/post-card";
import { DoctorCard } from "@/components/doctor-card";
import { getDoctors, getPosts, getPublishedQuestions, getServices, getSettings } from "@/lib/data";
import { EQUIPMENT, SITE } from "@/lib/site";

export default async function HomePage() {
  const [s, services, posts, doctors, questions] = await Promise.all([
    getSettings(),
    getServices(),
    getPosts(3),
    getDoctors(),
    getPublishedQuestions(),
  ]);
  const tel = s.hotline.replace(/[^\d+]/g, "");

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_90%_-10%,rgb(11_126_209/0.10),transparent)]" />
        <Container className="relative grid items-center gap-12 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-28 lg:pt-20">
          <div className="animate-fade-up">
            <Eyebrow>Bệnh viện chuyên khoa Mắt tuyến tỉnh · Từ {SITE.founded}</Eyebrow>
            <h1 className="mt-6 text-[2.6rem] font-bold leading-[1.08] text-ink sm:text-6xl lg:text-[3.25rem] xl:text-[4.25rem]">
              Đôi mắt sáng khỏe,
              <br />
              <span className="relative text-primary-700 sm:whitespace-nowrap">
                cuộc sống trọn vẹn
                <svg aria-hidden viewBox="0 0 300 12" className="absolute -bottom-2 left-0 h-3 w-full text-primary-300" preserveAspectRatio="none">
                  <path d="M2 9 C 80 2, 220 2, 298 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-muted sm:text-xl">
              Khám và điều trị chuyên sâu các bệnh lý về mắt với đội ngũ bác sĩ chuyên khoa tận tâm và hệ thống thiết bị
              <strong className="font-semibold text-ink"> Carl Zeiss</strong> hiện đại. Áp dụng Bảo hiểm y tế.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/dat-lich" className="h-14 px-8 text-lg">
                <CalendarCheck className="h-5 w-5" aria-hidden /> Đặt lịch khám
              </ButtonLink>
              <ButtonLink href={`tel:${tel}`} variant="secondary" className="h-14 px-8 text-lg">
                <Phone className="h-5 w-5" aria-hidden /> {s.hotline}
              </ButtonLink>
            </div>
            <ul className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-8">
              {[
                ["20", "năm chăm sóc mắt"],
                ["9", "hệ thống máy Zeiss"],
                ["BHYT", "khám & phẫu thuật"],
              ].map(([k, v]) => (
                <li key={v}>
                  <p className="font-display text-3xl font-bold text-primary-700 sm:text-4xl">{k}</p>
                  <p className="mt-1 text-sm leading-snug text-muted sm:text-base">{v}</p>
                </li>
              ))}
            </ul>
          </div>
          <HeroVisual />
        </Container>
      </section>

      {/* ---------------- QUICK ACTIONS ---------------- */}
      <section aria-label="Tác vụ nhanh" className="relative z-10 -mt-12">
        <Container>
          <ul className="grid gap-4 rounded-[2rem] border border-line bg-white p-3 shadow-lift sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/dat-lich", icon: CalendarCheck, title: "Đặt lịch khám", desc: "Chọn ngày giờ phù hợp, không phải chờ đợi" },
              { href: "/tra-cuu", icon: Search, title: "Tra cứu lịch hẹn", desc: "Kiểm tra trạng thái bằng mã đặt lịch" },
              { href: "/hoi-dap", icon: MessagesSquare, title: "Hỏi đáp bác sĩ", desc: "Gửi câu hỏi, bác sĩ chuyên khoa trả lời" },
              { href: "/bang-gia", icon: Wallet, title: "Bảng giá dịch vụ", desc: "Chi phí minh bạch, áp dụng BHYT" },
            ].map(({ href, icon: Icon, title, desc }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex h-full items-start gap-4 rounded-3xl p-5 transition-colors hover:bg-primary-50"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 transition-colors group-hover:bg-primary-700 group-hover:text-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span>
                    <span className="flex items-center gap-1 font-semibold text-ink">
                      {title}
                      <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                    </span>
                    <span className="mt-1 block text-[0.95rem] leading-snug text-muted">{desc}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section className="py-24 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Dịch vụ chuyên khoa"
            title="Chăm sóc toàn diện cho đôi mắt của bạn"
            lead="Từ khám tầm soát định kỳ đến phẫu thuật kỹ thuật cao: mỗi phác đồ được cá nhân hóa theo tình trạng của từng người bệnh."
          />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((sv, i) => (
              <li key={sv.id} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 80}ms` }}>
                <article className="group relative flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lift">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 transition-transform duration-300 group-hover:scale-110">
                    <ServiceIcon name={sv.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold text-ink">
                    <Link href={`/dich-vu/${sv.slug}`} className="after:absolute after:inset-0">
                      {sv.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-muted">{sv.shortDesc}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-primary-700">
                    Tìm hiểu thêm
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </article>
              </li>
            ))}
            <li data-reveal className="lg:col-span-2">
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-primary-800 p-7 text-white">
                <div aria-hidden className="absolute -right-12 -top-12 h-44 w-44 rounded-full border-[22px] border-white/10" />
                <div className="relative">
                  <Stethoscope className="h-9 w-9 text-primary-300" aria-hidden />
                  <h3 className="mt-6 font-display text-2xl font-bold">Chưa biết nên khám gì?</h3>
                  <p className="mt-3 text-primary-100">
                    Gọi hotline hoặc đặt lịch khám tổng quát, bác sĩ sẽ tư vấn hướng điều trị phù hợp nhất.
                  </p>
                </div>
                <div className="relative mt-7 flex flex-wrap gap-3">
                  <ButtonLink href="/dat-lich" variant="white">
                    Đặt lịch ngay
                  </ButtonLink>
                </div>
              </div>
            </li>
          </ul>
        </Container>
      </section>

      {/* ---------------- TECHNOLOGY ---------------- */}
      <section className="relative overflow-hidden bg-primary-900 py-24 text-white sm:py-28">
        <div aria-hidden className="pointer-events-none absolute -right-48 top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full border-[80px] border-white/[0.03]" />
        <div aria-hidden className="pointer-events-none absolute -right-20 top-1/2 h-[24rem] w-[24rem] -translate-y-1/2 rounded-full border-[40px] border-primary-500/10" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div data-reveal className="lg:sticky lg:top-32 lg:self-start">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-primary-200">
                <Microscope className="h-4 w-4" aria-hidden /> Công nghệ
              </p>
              <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
                Hệ thống thiết bị Carl Zeiss Meditec
              </h2>
              <p className="mt-5 text-lg text-primary-100">
                Bệnh viện đầu tư đồng bộ hệ thống chẩn đoán và phẫu thuật của Carl Zeiss Meditec (CHLB Đức). Nhờ đó người bệnh tại Bà Rịa – Vũng Tàu được điều trị bằng công nghệ ngang tầm các trung tâm mắt lớn mà không phải đi xa.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/gioi-thieu#thiet-bi" variant="white">
                  Xem chi tiết thiết bị
                </ButtonLink>
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {EQUIPMENT.map((eq, i) => (
                <li
                  key={eq.name}
                  data-reveal
                  style={{ ["--reveal-delay" as string]: `${(i % 2) * 90}ms` }}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:border-primary-400/40 hover:bg-white/[0.07]"
                >
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary-300">{eq.group}</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-white">{eq.name}</h3>
                  <p className="mt-1 text-[0.95rem] font-medium text-primary-100">{eq.kind}</p>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-primary-200/90">{eq.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ---------------- PROCESS ---------------- */}
      <section className="py-24 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Quy trình"
            title="Khám mắt dễ dàng chỉ với 4 bước"
            lead="Đặt lịch trước giúp bạn được tiếp đón nhanh hơn và chủ động thời gian."
          />
          <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
            <div aria-hidden className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 md:block" />
            {[
              { icon: CalendarCheck, title: "Đặt lịch", desc: "Đặt online hoặc gọi hotline, nhận mã đặt lịch ngay." },
              { icon: UserRoundCheck, title: "Xác nhận", desc: "Bệnh viện gọi điện xác nhận ngày giờ khám." },
              { icon: ClipboardList, title: "Thăm khám", desc: "Đo thị lực, nhãn áp, khám chuyên sâu cùng bác sĩ." },
              { icon: HeartHandshake, title: "Điều trị & theo dõi", desc: "Tư vấn phác đồ, hẹn tái khám đúng lịch." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <li key={title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 100}ms` }} className="relative text-center">
                <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary-700 shadow-lift ring-8 ring-canvas">
                  <Icon className="h-7 w-7" aria-hidden />
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-ink">{title}</h3>
                <p className="mx-auto mt-2 max-w-60 text-muted">{desc}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------- DOCTORS ---------------- */}
      {doctors.length > 0 ? (
        <section className="bg-gradient-to-b from-primary-50/60 to-white py-24 sm:py-28">
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                align="left"
                eyebrow="Đội ngũ chuyên môn"
                title="Bác sĩ tận tâm, giàu kinh nghiệm"
                lead="Đội ngũ bác sĩ chuyên khoa Mắt luôn đặt sự an toàn và thị lực lâu dài của người bệnh lên hàng đầu."
              />
              <ButtonLink href="/bac-si" variant="secondary">
                Xem tất cả bác sĩ <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {doctors.slice(0, 4).map((d) => (
                <li key={d.id} data-reveal>
                  <DoctorCard doctor={d} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* ---------------- NEWS ---------------- */}
      {posts.length > 0 ? (
        <section className="py-24 sm:py-28">
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                align="left"
                eyebrow="Kiến thức & tin tức"
                title="Cẩm nang chăm sóc mắt"
                lead="Kiến thức y khoa được biên soạn bởi bác sĩ chuyên khoa, dễ hiểu và đáng tin cậy."
              />
              <ButtonLink href="/tin-tuc" variant="secondary">
                Tất cả bài viết <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </div>
            <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <li key={p.id} data-reveal>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* ---------------- FAQ ---------------- */}
      {questions.length > 0 ? (
        <section className="border-t border-line bg-white py-24 sm:py-28">
          <Container className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <div data-reveal>
              <SectionHeading
                align="left"
                eyebrow="Hỏi đáp"
                title="Câu hỏi thường gặp"
                lead="Không tìm thấy câu trả lời? Gửi câu hỏi để bác sĩ chuyên khoa giải đáp miễn phí."
              />
              <ButtonLink href="/hoi-dap#dat-cau-hoi" className="mt-8">
                <MessagesSquare className="h-5 w-5" aria-hidden /> Đặt câu hỏi cho bác sĩ
              </ButtonLink>
            </div>
            <div className="divide-y divide-line rounded-3xl border border-line bg-canvas" data-reveal>
              {questions.slice(0, 5).map((q) => (
                <details key={q.id} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-semibold text-ink">
                    {q.question}
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-muted">{q.answer}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* ---------------- CTA ---------------- */}
      <section className="pb-24">
        <Container>
          <div
            data-reveal
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 px-6 py-14 text-white sm:px-14 sm:py-16"
          >
            <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[40px] border-white/10" />
            <div aria-hidden className="absolute -bottom-32 right-40 h-72 w-72 rounded-full border-[30px] border-secondary-500/20" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 className="text-3xl font-bold leading-tight sm:text-4xl">Đừng chờ đến khi mắt mờ mới đi khám</h2>
                <p className="mt-4 max-w-xl text-lg text-primary-100">
                  Người từ 40 tuổi, người bệnh đái tháo đường hoặc có tiền sử gia đình mắc Glôcôm nên khám mắt định kỳ 6 tháng đến 1 năm một lần.
                </p>
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-primary-100">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary-300" aria-hidden /> Áp dụng BHYT
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary-300" aria-hidden /> {s.workingHours}
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <ButtonLink href="/dat-lich" variant="white" className="h-14 text-lg">
                  <CalendarCheck className="h-5 w-5" aria-hidden /> Đặt lịch khám ngay
                </ButtonLink>
                <a
                  href={`tel:${tel}`}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 text-lg font-semibold text-white ring-1 ring-inset ring-white/40 transition hover:bg-white/10"
                >
                  <Phone className="h-5 w-5" aria-hidden /> Hotline {s.hotline}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
