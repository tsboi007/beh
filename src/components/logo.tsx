import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { SITE } from "@/lib/site";
import logoImg from "../../public/logo-bvm.png";

/**
 * Official hospital logo (supplied by the hospital, pink frame removed).
 * The file has a white background, so on dark surfaces it always sits in a white tile (brand rule).
 */
export function LogoMark({ className = "h-12", title }: { className?: string; title?: string }) {
  return (
    <span className={clsx("inline-flex shrink-0 items-center justify-center rounded-xl bg-white p-1", className)}>
      <Image
        src={logoImg}
        alt={title ?? ""}
        aria-hidden={title ? undefined : true}
        priority
        sizes="96px"
        className="h-full w-auto"
      />
    </span>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3 rounded-xl" aria-label={`${SITE.name} – Trang chủ`}>
      <LogoMark className="h-12 shadow-soft ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 lg:h-14" />
      <span className="flex flex-col whitespace-nowrap leading-tight">
        <span className={`font-display text-[0.8rem] font-bold uppercase tracking-[0.14em] ${inverted ? "text-primary-200" : "text-primary-700"}`}>
          Bệnh viện Mắt
        </span>
        <span className={`font-display text-lg font-bold ${inverted ? "text-white" : "text-ink"}`}>Bà Rịa – Vũng Tàu</span>
      </span>
    </Link>
  );
}
