import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Briefcase, CalendarClock, Coins, Users } from "lucide-react";
import { Container } from "@/components/ui";
import { Markdown } from "@/components/markdown";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ApplyForm } from "@/components/forms/simple-forms";
import { JsonLd } from "@/components/json-ld";
import { getJob, getJobs } from "@/lib/data";
import { SITE } from "@/lib/site";
import { formatYmd } from "@/lib/utils";

export async function generateStaticParams() {
  const jobs = await getJobs();
  // At least one entry keeps the route prerenderable when no job is published yet.
  return jobs.length ? jobs.map((j) => ({ slug: j.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/tuyen-dung/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return { title: "Không tìm thấy tin tuyển dụng" };
  return { title: `Tuyển dụng: ${job.title}`, alternates: { canonical: `/tuyen-dung/${job.slug}` } };
}

export default function JobPage(props: PageProps<"/tuyen-dung/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <JobDetail {...props} />
    </Suspense>
  );
}

async function JobDetail({ params }: PageProps<"/tuyen-dung/[slug]">) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();
  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-primary-50 to-white">
        <Container className="py-12 sm:py-16">
          <Breadcrumbs items={[{ href: "/tuyen-dung", label: "Tuyển dụng" }, { label: job.title }]} />
          <h1 className="mt-6 text-4xl font-bold text-ink sm:text-5xl">{job.title}</h1>
          <ul className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: Briefcase, v: job.department },
              { icon: Users, v: `Số lượng: ${job.quantity}` },
              { icon: Coins, v: job.salary },
              ...(job.deadline ? [{ icon: CalendarClock, v: `Hạn nộp: ${formatYmd(job.deadline)}` }] : []),
            ].map(({ icon: Icon, v }) => (
              <li key={v} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-ink-soft ring-1 ring-line">
                <Icon className="h-4 w-4 text-primary-600" aria-hidden /> {v}
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_26rem]">
        <article className="min-w-0">
          <Markdown>{job.description}</Markdown>
        </article>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-lift sm:p-8">
            <h2 className="font-display text-2xl font-bold text-ink">Nộp hồ sơ</h2>
            <div className="mt-6">
              <ApplyForm jobId={job.id} />
            </div>
          </div>
        </aside>
      </Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: job.title,
          description: job.description,
          datePosted: new Date(job.createdAt).toISOString(),
          validThrough: job.deadline ?? undefined,
          employmentType: "FULL_TIME",
          hiringOrganization: { "@type": "Hospital", name: SITE.name, sameAs: SITE.url },
          jobLocation: {
            "@type": "Place",
            address: { "@type": "PostalAddress", streetAddress: "17 Phạm Ngọc Thạch", addressLocality: "Bà Rịa", addressCountry: "VN" },
          },
        }}
      />
    </>
  );
}
