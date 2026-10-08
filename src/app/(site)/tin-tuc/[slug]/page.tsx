import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CalendarCheck, Clock } from "lucide-react";
import { ButtonLink, Container } from "@/components/ui";
import { Markdown } from "@/components/markdown";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/post-card";
import { getPost, getPosts, getRelatedPosts } from "@/lib/data";
import { SITE } from "@/lib/site";
import { formatDate, readingTime } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = await getPosts(50);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tin-tuc/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Không tìm thấy bài viết" };
  const description = post.seoDesc || post.excerpt;
  return {
    title: post.seoTitle || post.title,
    description,
    alternates: { canonical: `/tin-tuc/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: new Date(post.publishedAt).toISOString(),
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default function PostPage(props: PageProps<"/tin-tuc/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <PostDetail {...props} />
    </Suspense>
  );
}

async function PostDetail({ params }: PageProps<"/tin-tuc/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post.slug, post.category);

  return (
    <>
      <article>
        <header className="border-b border-line bg-gradient-to-b from-primary-50 to-white">
          <Container className="py-12 sm:py-16">
            <Breadcrumbs items={[{ href: "/tin-tuc", label: "Tin tức" }, { label: post.category }]} />
            <div className="mx-auto mt-8 max-w-3xl animate-fade-up text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-700">{post.category}</p>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-ink sm:text-5xl">{post.title}</h1>
              <p className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-muted">
                <time dateTime={new Date(post.publishedAt).toISOString()}>{formatDate(post.publishedAt)}</time>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" aria-hidden /> {readingTime(post.content)} phút đọc
                </span>
              </p>
            </div>
          </Container>
        </header>

        <Container className="py-12 sm:py-16">
          {post.coverImage ? (
            <div className="relative mx-auto mb-12 aspect-[16/9] max-w-4xl overflow-hidden rounded-3xl shadow-lift">
              <Image src={post.coverImage} alt={post.title} fill priority sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
            </div>
          ) : null}
          <div className="mx-auto max-w-3xl">
            {post.excerpt ? <p className="mb-8 text-xl leading-relaxed text-ink">{post.excerpt}</p> : null}
            <Markdown>{post.content}</Markdown>

            <aside className="mt-14 flex flex-col items-start gap-5 rounded-3xl bg-primary-800 p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
              <div>
                <p className="font-display text-2xl font-bold">Bạn cần được bác sĩ tư vấn?</p>
                <p className="mt-1 text-primary-100">Đặt lịch khám để được thăm khám và tư vấn trực tiếp.</p>
              </div>
              <ButtonLink href="/dat-lich" variant="white" className="shrink-0">
                <CalendarCheck className="h-5 w-5" aria-hidden /> Đặt lịch khám
              </ButtonLink>
            </aside>
            <p className="mt-6 text-sm italic text-muted">
              Thông tin trong bài viết chỉ mang tính tham khảo, không thay thế cho việc thăm khám và chẩn đoán của bác sĩ chuyên khoa.
            </p>
          </div>
        </Container>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-line bg-white py-16">
          <Container>
            <h2 className="font-display text-3xl font-bold text-ink">Bài viết liên quan</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          headline: post.title,
          description: post.seoDesc || post.excerpt,
          datePublished: new Date(post.publishedAt).toISOString(),
          dateModified: new Date(post.updatedAt).toISOString(),
          image: post.coverImage ?? undefined,
          url: `${SITE.url}/tin-tuc/${post.slug}`,
          inLanguage: "vi",
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: `${SITE.url}/logo-bvm.png` } },
        }}
      />
    </>
  );
}
