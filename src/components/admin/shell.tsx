"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  Briefcase,
  CalendarCheck,
  ExternalLink,
  FileText,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessagesSquare,
  Settings,
  Stethoscope,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import clsx from "clsx";
import { LogoMark } from "@/components/logo";
import { logout } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/lich-hen", label: "Lịch hẹn", icon: CalendarCheck },
  { href: "/admin/hoi-dap", label: "Hỏi đáp", icon: MessagesSquare },
  { href: "/admin/lien-he", label: "Liên hệ", icon: Mail },
  { href: "/admin/bai-viet", label: "Bài viết", icon: FileText },
  { href: "/admin/dich-vu", label: "Dịch vụ", icon: Stethoscope },
  { href: "/admin/bang-gia", label: "Bảng giá", icon: Wallet },
  { href: "/admin/bac-si", label: "Bác sĩ & nhân sự", icon: UserRound },
  { href: "/admin/tuyen-dung", label: "Tuyển dụng", icon: Briefcase },
  { href: "/admin/cai-dat", label: "Cài đặt", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  const nav = (
    <nav aria-label="Quản trị" className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-3 px-5 py-5">
        <LogoMark className="h-10" />
        <span className="leading-tight">
          <span className="block font-display text-sm font-bold text-white">BV Mắt BR-VT</span>
          <span className="block text-xs text-primary-200">Trang quản trị</span>
        </span>
      </Link>
      <ul className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={() => setOpen(false)}
              aria-current={active(href) ? "page" : undefined}
              className={clsx(
                "flex min-h-11 items-center gap-3 rounded-xl px-3 font-medium transition-colors",
                active(href) ? "bg-white text-primary-900" : "text-primary-100 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden /> {label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-primary-100 hover:bg-white/10">
          <ExternalLink className="h-5 w-5" aria-hidden /> Xem website
        </a>
        <Link
          href="/admin/doi-mat-khau"
          onClick={() => setOpen(false)}
          aria-current={pathname === "/admin/doi-mat-khau" ? "page" : undefined}
          className={clsx(
            "flex min-h-11 items-center gap-3 rounded-xl px-3",
            pathname === "/admin/doi-mat-khau" ? "bg-white text-primary-900" : "text-primary-100 hover:bg-white/10",
          )}
        >
          <KeyRound className="h-5 w-5" aria-hidden /> Đổi mật khẩu
        </Link>
        <form action={logout}>
          <button type="submit" className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-primary-100 hover:bg-white/10">
            <LogOut className="h-5 w-5" aria-hidden /> Đăng xuất
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-primary-900 lg:block">{nav}</aside>

      {/* mobile */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <span className="font-display font-bold text-ink">Quản trị</span>
        <button type="button" onClick={() => setOpen(true)} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl hover:bg-slate-100" aria-label="Mở menu">
          <Menu className="h-6 w-6" aria-hidden />
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-primary-900">
            <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-white hover:bg-white/10" aria-label="Đóng menu">
              <X className="h-5 w-5" aria-hidden />
            </button>
            {nav}
          </div>
        </div>
      ) : null}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
