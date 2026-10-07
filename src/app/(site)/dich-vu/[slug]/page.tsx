import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CalendarCheck, Phone } from "lucide-react";
import { ButtonLink, Container } from "@/components/ui";
import { Markdown } from "@/components/markdown";
import { ServiceIcon } from "@/components/service-icon";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getService, getServices, getSettings } from "@/lib/data";
import { SITE } from "@/lib/site";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/dich-vu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const sv = await getService(slug);
  if (!sv) return { title: "Không tìm thấy dịch vụ" };
  return {
    title: sv.seoTitle || sv.title,
    description: sv.seoDesc || sv.shortDesc,
    alternates: { canonical: `/dich-vu/${sv.slug}` },
    openGraph: { title: sv.title, description: sv.seoDesc || sv.shortDesc, type: "article" },
  };
}

export default function ServicePage(props: PageProps<"/dich-vu/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ServiceDetail {...props} />
    </Suspense>
  );
}

async function ServiceDetail({ params }: PageProps<"/dich-vu/[slug]">) {
  const { slug } = await params;
  const [sv, all, s] = await Promise.all([getService(slug), getServices(), getSettings()]);
  if (!sv) notFound();
  const tel = s.hotline.replace(/[^\d+]/g, "");

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-primary-50 to-white">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full border-[48px] border-primary-100/70" />
        <Container className="relative py-12 sm:py-16">
          <Breadcrumbs items={[{ href: "/dich-vu", label: "Dịch vụ" }, { label: sv.title }]} />
          <div className="mt-8 flex animate-fade-up flex-col gap-6 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white text-primary-700 shadow-lift">
              <ServiceIcon name={sv.icon} className="h-10 w-10" />
            </span>
            <div>
              <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">{sv.title}</h1>
              <p className="mt-3 max-w-2xl text-lg text-muted">{sv.shortDesc}</p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_22rem] lg:py-20">
        <article className="min-w-0 max-w-3xl">
          <Markdown>{sv.content}</Markdown>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-primary-800 p-7 text-white shadow-lift">
            <h2 className="font-display text-2xl font-bold">Đặt lịch khám</h2>
            <p className="mt-2 text-primary-100">Chủ động thời gian, được tiếp đón nhanh hơn.</p>
            <ButtonLink href={`/dat-lich?dich-vu=${sv.slug}`} variant="white" className="mt-6 w-full">
              <CalendarCheck className="h-5 w-5" aria-hidden /> Đặt lịch {sv.title.split(" (")[0].toLowerCase()}
            </ButtonLink>
            <a
              href={`tel:${tel}`}
              className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full font-semibold ring-1 ring-inset ring-white/40 hover:bg-white/10"
            >
              <Phone className="h-5 w-5" aria-hidden /> {s.hotline}
            </a>
          </div>
          <nav aria-label="Dịch vụ khác" className="rounded-3xl border border-line bg-white p-6">
            <h2 className="font-display text-lg font-bold text-ink">Dịch vụ khác</h2>
            <ul className="mt-3 space-y-1">
              {all
                .filter((x) => x.slug !== sv.slug)
                .map((x) => (
                  <li key={x.slug}>
                    <Link
                      href={`/dich-vu/${x.slug}`}
                      className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-ink-soft hover:bg-primary-50 hover:text-primary-800"
                    >
                      <ServiceIcon name={x.icon} className="h-5 w-5 shrink-0 text-primary-600" />
                      {x.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </aside>
      </Container>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: sv.title,
          description: sv.seoDesc || sv.shortDesc,
          url: `${SITE.url}/dich-vu/${sv.slug}`,
          about: { "@type": "MedicalProcedure", name: sv.title },
          provider: { "@type": "Hospital", name: SITE.name },
        }}
      />
    </>
  );
}
