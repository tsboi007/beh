"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarCheck, Menu, Phone, Search, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "./logo";
import { NAV } from "@/lib/site";

export function SiteHeader({ hotline }: { hotline: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const tel = hotline.replace(/[^\d+]/g, "");

  return (
    <>
      <div className="hidden bg-primary-900 text-sm text-primary-100 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
          <p>Kỹ thuật cao – Chất lượng cao – Hiệu quả cao</p>
          <div className="flex items-center gap-5">
            <Link href="/tra-cuu" className="inline-flex items-center gap-1.5 hover:text-white">
              <Search className="h-4 w-4" aria-hidden /> Tra cứu lịch hẹn
            </Link>
            <Link href="/tuyen-dung" className="hover:text-white">
              Tuyển dụng
            </Link>
            <a href={`tel:${tel}`} className="inline-flex items-center gap-1.5 font-semibold text-white">
              <Phone className="h-4 w-4" aria-hidden /> {hotline}
            </a>
          </div>
        </div>
      </div>

      <header
        className={clsx(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled ? "bg-white/90 shadow-soft backdrop-blur-lg" : "bg-white",
        )}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
          <Logo />

          <nav aria-label="Điều hướng chính" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={clsx(
                      "relative whitespace-nowrap rounded-full px-3.5 py-2 text-[0.97rem] font-medium transition-colors",
                      isActive(item.href) ? "text-primary-700" : "text-ink-soft hover:text-primary-700",
                    )}
                  >
                    {item.label}
                    {isActive(item.href) ? (
                      <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary-500" aria-hidden />
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/dat-lich"
              className="hidden min-h-12 items-center gap-2 rounded-full bg-primary-700 px-5 font-semibold text-white shadow-[0_8px_20px_-8px_rgb(4_119_58/0.6)] transition hover:bg-primary-800 sm:inline-flex"
            >
              <CalendarCheck className="h-5 w-5" aria-hidden />
              Đặt lịch khám
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-primary-50 xl:hidden"
              aria-label="Mở menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={clsx(
          "fixed inset-0 z-50 xl:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          className={clsx(
            "absolute inset-0 bg-primary-900/40 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={clsx(
            "absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col bg-white shadow-lift transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span className="font-display text-lg font-bold">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full hover:bg-primary-50"
              aria-label="Đóng menu"
              tabIndex={open ? 0 : -1}
            >
              <X className="h-6 w-6" aria-hidden />
            </button>
          </div>
          <nav aria-label="Điều hướng di động" className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {[{ href: "/", label: "Trang chủ" }, ...NAV, { href: "/tra-cuu", label: "Tra cứu lịch hẹn" }, { href: "/tuyen-dung", label: "Tuyển dụng" }].map(
                (item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      tabIndex={open ? 0 : -1}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={clsx(
                        "flex min-h-12 items-center rounded-xl px-4 text-lg font-medium",
                        pathname === item.href ? "bg-primary-50 text-primary-800" : "text-ink hover:bg-slate-50",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="space-y-3 border-t border-line p-5">
            <Link
              href="/dat-lich"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary-700 font-semibold text-white"
            >
              <CalendarCheck className="h-5 w-5" aria-hidden /> Đặt lịch khám
            </Link>
            <a
              href={`tel:${tel}`}
              tabIndex={open ? 0 : -1}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full ring-1 ring-primary-200 font-semibold text-primary-800"
            >
              <Phone className="h-5 w-5" aria-hidden /> {hotline}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
