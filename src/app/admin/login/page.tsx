import type { Metadata } from "next";
import { LogoMark } from "@/components/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Đăng nhập quản trị", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-primary-900 px-4 py-12">
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full border-[70px] border-white/[0.04]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full border-[50px] border-primary-500/10" />
      <div className="relative w-full max-w-md rounded-[2rem] bg-white p-8 shadow-lift sm:p-10">
        <div className="flex flex-col items-center text-center">
          <LogoMark className="h-24" title="Logo Bệnh viện Mắt Bà Rịa – Vũng Tàu" />
          <h1 className="mt-5 font-display text-2xl font-bold text-ink">Quản trị website</h1>
          <p className="mt-1 text-muted">Bệnh viện Mắt Bà Rịa – Vũng Tàu</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
