import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, PageHero } from "@/components/ui";
import { PostCard, PostCover } from "@/components/post-card";
import { getPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tin tức & kiến thức về mắt",
  description: "Cẩm nang chăm sóc mắt, kiến thức bệnh lý về mắt và tin hoạt động của Bệnh viện Mắt Bà Rịa – Vũng Tàu.",
  alternates: { canonical: "/tin-tuc" },
};

export default async function NewsPage() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="Tin tức & kiến thức"
        title="Cẩm nang chăm sóc mắt"
        lead="Kiến thức y khoa dễ hiểu, cập nhật hoạt động và chương trình cộng đồng của bệnh viện."
      />
      <Container className="py-14 sm:py-20">
        {featured ? (
          <article data-reveal className="group relative grid overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft transition hover:shadow-lift lg:grid-cols-2">
            <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]">
              <PostCover src={featured.coverImage} alt="" priority />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-700">
                {featured.category} · <time dateTime={new Date(featured.publishedAt).toISOString()}>{formatDate(featured.publishedAt)}</time>
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
                <Link href={`/tin-tuc/${featured.slug}`} className="after:absolute after:inset-0 group-hover:text-primary-700">
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-4 text-lg text-muted">{featured.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-primary-700">
                Đọc bài viết <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </div>
          </article>
        ) : (
          <p className="text-center text-muted">Chưa có bài viết.</p>
        )}

        {rest.length > 0 ? (
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <li key={p.id} data-reveal>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </>
  );
}
