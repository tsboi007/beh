import Link from "next/link";
import type { ReactNode } from "react";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import clsx from "clsx";

export function AdminHeader({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
        {desc ? <p className="mt-1 text-muted">{desc}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function NewButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-700 px-5 font-semibold text-white hover:bg-primary-800">
      <Plus className="h-5 w-5" aria-hidden /> {children}
    </Link>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("rounded-2xl border border-line bg-white shadow-sm", className)}>{children}</div>;
}

export function SavedNotice({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p role="status" className="mb-6 flex items-center gap-2 rounded-xl bg-primary-50 px-4 py-3 font-medium text-primary-800 ring-1 ring-primary-200">
      <CheckCircle2 className="h-5 w-5" aria-hidden /> Đã lưu thay đổi. Website đã được cập nhật.
    </p>
  );
}

export const smallInput =
  "block min-h-10 w-full rounded-lg border border-line bg-white px-3 py-2 text-[0.95rem] text-ink focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100";

export const thClass = "px-4 py-3 text-left text-sm font-semibold text-muted";
export const tdClass = "px-4 py-3 align-top";

export function DeleteButton({ id, action, label }: { id: number; action: (fd: FormData) => Promise<void>; label: string }) {
  return (
    <form action={action} className="mt-6">
      <input type="hidden" name="id" value={id} />
      <details className="inline-block">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full px-4 font-semibold text-accent-700 ring-1 ring-accent-100 hover:bg-accent-100">
          <Trash2 className="h-4 w-4" aria-hidden /> {label}
        </summary>
        <div className="mt-3 rounded-xl bg-accent-100/60 p-4">
          <p className="text-accent-700">Thao tác này không thể hoàn tác. Bạn chắc chắn?</p>
          <button className="mt-3 min-h-10 cursor-pointer rounded-lg bg-accent-700 px-4 font-semibold text-white">Xác nhận xóa</button>
        </div>
      </details>
    </form>
  );
}
