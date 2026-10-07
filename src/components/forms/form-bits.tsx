"use client";

import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import clsx from "clsx";
import type { ReactNode } from "react";

export function SubmitButton({ children, pendingText = "Đang gửi…", className }: { children: ReactNode; pendingText?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={clsx(
        "inline-flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary-700 px-8 py-3.5 text-lg font-semibold text-white shadow-[0_8px_20px_-8px_rgb(4_119_58/0.6)] transition hover:bg-primary-800 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70",
        className,
      )}
    >
      {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
      {pending ? pendingText : children}
    </button>
  );
}

/** Invisible to people, tempting to bots. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function FormAlert({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div
      role={ok ? "status" : "alert"}
      className={clsx(
        "flex items-start gap-3 rounded-2xl p-4",
        ok ? "bg-primary-50 text-primary-900 ring-1 ring-primary-200" : "bg-accent-100/60 text-accent-700 ring-1 ring-accent-100",
      )}
    >
      {ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden /> : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />}
      <div>{children}</div>
    </div>
  );
}

export const errProps = (errors: Record<string, string> | undefined, name: string) =>
  errors?.[name] ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};
