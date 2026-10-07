import { BadgeCheck, CalendarCheck, ShieldCheck } from "lucide-react";

/** Signature hero illustration: a stylised iris built from the logo's concentric-eye motif. */
export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]" aria-hidden>
      {/* soft glow */}
      <div className="absolute inset-[8%] rounded-full bg-gradient-to-br from-primary-200 via-white to-secondary-100 blur-2xl" />

      <svg viewBox="0 0 400 400" className="relative h-full w-full">
        <defs>
          <radialGradient id="iris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#022C13" />
            <stop offset="28%" stopColor="#02421C" />
            <stop offset="52%" stopColor="#05933E" />
            <stop offset="78%" stopColor="#4FB87A" />
            <stop offset="100%" stopColor="#0B7ED1" />
          </radialGradient>
          <radialGradient id="shine" cx="35%" cy="30%" r="40%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#05933E" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0B7ED1" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <circle cx="200" cy="200" r="196" fill="none" stroke="url(#ring)" strokeWidth="1.5" strokeDasharray="2 8" />
        <g className="origin-center motion-safe:animate-[spin_80s_linear_infinite]" style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="172" fill="none" stroke="#DAEFE2" strokeWidth="14" />
          <circle cx="200" cy="200" r="172" fill="none" stroke="#05933E" strokeWidth="3" strokeDasharray="60 420" strokeLinecap="round" />
          <circle cx="200" cy="200" r="172" fill="none" stroke="#0B7ED1" strokeWidth="3" strokeDasharray="20 520" strokeDashoffset="-300" strokeLinecap="round" />
        </g>

        <circle cx="200" cy="200" r="140" fill="#fff" />
        <circle cx="200" cy="200" r="122" fill="url(#iris)" />
        {/* iris fibres */}
        <g stroke="#fff" strokeOpacity="0.16" strokeWidth="1.2">
          {Array.from({ length: 48 }, (_, i) => {
            const a = (i / 48) * Math.PI * 2;
            const r1 = 54;
            const r2 = 118;
            return (
              <line
                key={i}
                x1={(200 + Math.cos(a) * r1).toFixed(2)}
                y1={(200 + Math.sin(a) * r1).toFixed(2)}
                x2={(200 + Math.cos(a) * r2).toFixed(2)}
                y2={(200 + Math.sin(a) * r2).toFixed(2)}
              />
            );
          })}
        </g>
        <circle cx="200" cy="200" r="50" fill="#011a0b" />
        <circle cx="200" cy="200" r="122" fill="url(#shine)" />
        <ellipse cx="172" cy="166" rx="20" ry="13" fill="#fff" fillOpacity="0.85" transform="rotate(-30 172 166)" />
        <circle cx="228" cy="232" r="5" fill="#fff" fillOpacity="0.6" />
      </svg>

      {/* floating proof cards */}
      <div className="absolute -left-2 top-[14%] w-56 rounded-2xl bg-white/95 p-4 shadow-lift ring-1 ring-black/5 backdrop-blur motion-safe:animate-float sm:-left-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
            <BadgeCheck className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink">Carl Zeiss Meditec</p>
            <p className="text-xs text-muted">VISUMAX 800 · MEL 90</p>
          </div>
        </div>
      </div>

      <div
        className="absolute -right-2 top-[46%] w-52 rounded-2xl bg-white/95 p-4 shadow-lift ring-1 ring-black/5 backdrop-blur motion-safe:animate-float sm:-right-6"
        style={{ animationDelay: "-2.5s" }}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-700">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink">Áp dụng BHYT</p>
            <p className="text-xs text-muted">Khám & phẫu thuật</p>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[6%] left-[12%] rounded-2xl bg-primary-800 px-4 py-3 text-white shadow-lift motion-safe:animate-float"
        style={{ animationDelay: "-4.5s" }}
      >
        <div className="flex items-center gap-2.5">
          <CalendarCheck className="h-5 w-5 text-primary-300" />
          <p className="text-sm font-semibold">Đặt lịch online trong 1 phút</p>
        </div>
      </div>
    </div>
  );
}
