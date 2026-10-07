import Image from "next/image";
import { BadgeCheck, CalendarCheck, ShieldCheck } from "lucide-react";
import heroImg from "../../../public/images/hero-kham-mat.webp";

/** Hero: real-life consultation photo framed by the logo's concentric-eye motif, with floating proof cards. */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none lg:pl-8">
      {/* concentric rings (eye motif from the logo) */}
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-12 h-[30rem] w-[30rem] rounded-full border-[28px] border-primary-100/80 motion-safe:animate-[spin_90s_linear_infinite]" />
      <div aria-hidden className="pointer-events-none absolute -right-2 top-4 h-[22rem] w-[22rem] rounded-full border-2 border-dashed border-secondary-500/25" />
      <div aria-hidden className="pointer-events-none absolute -bottom-10 -left-6 h-40 w-40 rounded-full bg-gradient-to-br from-primary-200 to-secondary-100 blur-2xl" />

      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lift ring-1 ring-black/5">
        <Image
          src={heroImg}
          alt="Bác sĩ chuyên khoa Mắt khám sinh hiển vi cho người bệnh lớn tuổi"
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 34rem, 90vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-primary-900/35 via-transparent to-transparent" />
      </div>

      {/* floating proof cards */}
      <div className="absolute -left-3 top-[10%] w-56 rounded-2xl bg-white/95 p-4 shadow-lift ring-1 ring-black/5 backdrop-blur motion-safe:animate-float sm:-left-10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
            <BadgeCheck className="h-5 w-5" aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink">Carl Zeiss Meditec</p>
            <p className="text-xs text-muted">VISUMAX 800 · MEL 90</p>
          </div>
        </div>
      </div>

      <div
        className="absolute -right-3 top-[52%] w-52 rounded-2xl bg-white/95 p-4 shadow-lift ring-1 ring-black/5 backdrop-blur motion-safe:animate-float sm:-right-6"
        style={{ animationDelay: "-2.5s" }}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-700">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink">Áp dụng BHYT</p>
            <p className="text-xs text-muted">Khám & phẫu thuật</p>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 flex justify-center lg:pl-8">
        <div
          className="whitespace-nowrap rounded-2xl bg-primary-800 px-4 py-3 text-white shadow-lift motion-safe:animate-float"
          style={{ animationDelay: "-4.5s" }}
        >
          <div className="flex items-center gap-2.5">
            <CalendarCheck className="h-5 w-5 text-primary-300" aria-hidden />
            <p className="text-sm font-semibold">Đặt lịch online trong 1 phút</p>
          </div>
        </div>
      </div>
    </div>
  );
}
