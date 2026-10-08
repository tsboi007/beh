"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";
import { inputClass } from "@/components/ui";

export function PasswordInput({ className, onValue, ...props }: ComponentProps<"input"> & { onValue?: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        type={show ? "text" : "password"}
        onChange={(e) => onValue?.(e.target.value)}
        className={clsx(inputClass, "pr-12", className)}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        aria-pressed={show}
        className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted hover:bg-slate-100 hover:text-ink"
      >
        {show ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
      </button>
    </div>
  );
}

/** Simple, explainable strength meter (length + character variety). */
export function passwordStrength(pw: string) {
  if (!pw) return { score: 0, label: "", tone: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length < 8) score = Math.min(score, 1);
  const levels = [
    { label: "Rất yếu", tone: "bg-accent-500" },
    { label: "Yếu", tone: "bg-accent-500" },
    { label: "Trung bình", tone: "bg-amber-500" },
    { label: "Khá", tone: "bg-secondary-500" },
    { label: "Mạnh", tone: "bg-primary-600" },
    { label: "Rất mạnh", tone: "bg-primary-700" },
  ];
  return { score, ...levels[score] };
}
