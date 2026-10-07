import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

type PostLike = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  publishedAt: Date;
};

export function PostCover({ src, alt, priority }: { src: string | null; alt: string; priority?: boolean }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }
  // Branded placeholder until an image is uploaded in Admin
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border-[18px] border-white/10" />
      <div className="absolute -bottom-16 -left-6 h-40 w-40 rounded-full border-[14px] border-secondary-500/25" />
      <Eye className="absolute bottom-5 right-5 h-10 w-10 text-white/30" aria-hidden strokeWidth={1.5} />
    </div>
  );
}

export function PostCard({ post, priority }: { post: PostLike; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden">
        <PostCover src={post.coverImage} alt="" priority={priority} />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-primary-800 shadow-sm">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <time dateTime={new Date(post.publishedAt).toISOString()} className="text-sm text-muted">
          {formatDate(post.publishedAt)}
        </time>
        <h3 className="mt-2 font-display text-xl font-bold leading-snug text-ink">
          <Link href={`/tin-tuc/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-primary-700">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-muted">{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-5 font-semibold text-primary-700">
          Đọc tiếp <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}
