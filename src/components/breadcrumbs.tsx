import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./json-ld";
import { SITE } from "@/lib/site";

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  const all = [{ href: "/", label: "Trang chủ" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((it, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 ? <ChevronRight className="h-4 w-4 shrink-0" aria-hidden /> : null}
              {it.href && i < all.length - 1 ? (
                <Link href={it.href} className="hover:text-primary-700">
                  {it.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-ink">
                  {it.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((it, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: it.label,
            ...(it.href ? { item: `${SITE.url}${it.href}` } : {}),
          })),
        }}
      />
    </>
  );
}
