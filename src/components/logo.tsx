import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * Web rendition of the hospital emblem (green eye, blue arc wordmark, red "BR-VT", blue waves).
 * Replace with the official vector file when the hospital provides one.
 */
export function LogoMark({ className = "h-12 w-12", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <defs>
        <path id="bvm-arc" d="M 18 62 A 42 42 0 0 0 102 62" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="#fff" />
      {/* eye */}
      <path d="M14 40 C 32 12, 88 12, 106 40 C 88 64, 32 64, 14 40 Z" fill="#05933E" />
      <circle cx="60" cy="38" r="15" fill="#fff" />
      <circle cx="60" cy="38" r="7" fill="#05933E" />
      <circle cx="65" cy="33" r="3" fill="#fff" />
      {/* arc wordmark */}
      <text fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="11.5" fill="#0B7ED1" letterSpacing="0.6">
        <textPath href="#bvm-arc" startOffset="50%" textAnchor="middle">BỆNH VIỆN MẮT</textPath>
      </text>
      <text x="60" y="92" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="15" fill="#E50A08">
        BR-VT
      </text>
      {/* waves */}
      <g fill="none" stroke="#0B7ED1" strokeWidth="2.6" strokeLinecap="round">
        <path d="M36 100 q6 -4 12 0 t12 0 t12 0 t12 0" />
        <path d="M42 106 q6 -4 12 0 t12 0 t12 0" opacity="0.75" />
      </g>
    </svg>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3 rounded-xl" aria-label={`${SITE.name} – Trang chủ`}>
      <LogoMark className="h-12 w-12 shrink-0 rounded-full shadow-soft ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105" />
      <span className="flex flex-col whitespace-nowrap leading-tight">
        <span className={`font-display text-[0.8rem] font-bold uppercase tracking-[0.14em] ${inverted ? "text-primary-200" : "text-primary-700"}`}>
          Bệnh viện Mắt
        </span>
        <span className={`font-display text-lg font-bold ${inverted ? "text-white" : "text-ink"}`}>Bà Rịa – Vũng Tàu</span>
      </span>
    </Link>
  );
}
