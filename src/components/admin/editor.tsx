"use client";

import Image from "next/image";
import { useActionState, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bold, Heading2, ImageUp, Italic, List, ListOrdered, Quote, Save } from "lucide-react";
import clsx from "clsx";
import type { AdminState } from "@/app/admin/actions";
import { FormAlert, SubmitButton } from "@/components/forms/form-bits";

export function EditForm({
  action,
  children,
  submitLabel = "Lưu",
}: {
  action: (s: AdminState, fd: FormData) => Promise<AdminState>;
  children: ReactNode;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<AdminState, FormData>(action, {});
  return (
    <form action={formAction} className="space-y-6">
      {state.error ? <FormAlert ok={false}>{state.error}</FormAlert> : null}
      {state.ok ? <FormAlert ok>Đã lưu thay đổi. Website đã được cập nhật.</FormAlert> : null}
      {children}
      <div className="sticky bottom-0 -mx-4 flex justify-end border-t border-line bg-slate-50/90 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
        <SubmitButton pendingText="Đang lưu…" className="!min-h-11 !px-6 !py-2 !text-base">
          <Save className="h-5 w-5" aria-hidden /> {submitLabel}
        </SubmitButton>
      </div>
    </form>
  );
}

const TOOLS = [
  { icon: Heading2, label: "Tiêu đề", before: "\n## ", after: "" },
  { icon: Bold, label: "In đậm", before: "**", after: "**" },
  { icon: Italic, label: "In nghiêng", before: "*", after: "*" },
  { icon: List, label: "Danh sách", before: "\n- ", after: "" },
  { icon: ListOrdered, label: "Danh sách số", before: "\n1. ", after: "" },
  { icon: Quote, label: "Trích dẫn / lưu ý", before: "\n> ", after: "" },
];

export function MarkdownEditor({ name, defaultValue = "", label, rows = 18 }: { name: string; defaultValue?: string; label: string; rows?: number }) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const id = `md-${name}`;

  const wrap = (before: string, after: string) => {
    const el = document.getElementById(id) as HTMLTextAreaElement | null;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const next = value.slice(0, s) + before + value.slice(s, e) + after + value.slice(e);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, e + before.length);
    });
  };

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-[0.95rem] font-semibold text-ink">
          {label}
        </label>
        <div role="tablist" className="flex rounded-lg bg-slate-100 p-1 text-sm">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={clsx("cursor-pointer rounded-md px-3 py-1 font-medium", tab === t ? "bg-white text-ink shadow-sm" : "text-muted")}
            >
              {t === "write" ? "Soạn thảo" : "Xem trước"}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {tab === "write" ? (
          <>
            <div className="flex flex-wrap gap-1 border-b border-line bg-slate-50 px-2 py-1.5">
              {TOOLS.map(({ icon: Icon, label: l, before, after }) => (
                <button
                  key={l}
                  type="button"
                  title={l}
                  aria-label={l}
                  onClick={() => wrap(before, after)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-ink-soft hover:bg-white hover:text-primary-700"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </button>
              ))}
            </div>
            <textarea
              id={id}
              name={name}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={rows}
              className="block w-full resize-y px-4 py-3 font-mono text-[0.9rem] leading-relaxed text-ink focus:outline-none"
            />
          </>
        ) : (
          <>
            <input type="hidden" name={name} value={value} />
            <div className="prose-bvm max-h-[36rem] overflow-y-auto px-5 py-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || "_Chưa có nội dung_"}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
      <p className="mt-1.5 text-sm text-muted">
        Định dạng Markdown: <code>## Tiêu đề</code>, <code>**đậm**</code>, <code>- gạch đầu dòng</code>, <code>&gt; lưu ý</code>.
      </p>
    </div>
  );
}

export function ImageField({ name, label, current }: { name: string; label: string; current: string | null }) {
  const [preview, setPreview] = useState<string | null>(current);
  return (
    <div>
      <p className="mb-1.5 text-[0.95rem] font-semibold text-ink">{label}</p>
      <div className="flex flex-col gap-4 rounded-xl border border-dashed border-line bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:w-48">
          {preview ? (
            <Image src={preview} alt="" fill className="object-cover" unoptimized sizes="192px" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              <ImageUp className="h-8 w-8" aria-hidden />
            </div>
          )}
        </div>
        <div className="space-y-2 text-sm">
          <input
            type="file"
            name={name}
            accept="image/jpeg,image/png,image/webp,image/avif"
            aria-label={label}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
            className="block w-full text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-100 file:px-4 file:py-2 file:font-semibold file:text-primary-800"
          />
          <p className="text-muted">JPG, PNG, WebP · tối đa 4MB · nên dùng ảnh ngang 1600×1000px.</p>
          {current ? (
            <label className="flex cursor-pointer items-center gap-2 text-accent-700">
              <input type="checkbox" name={`${name}__remove`} className="h-4 w-4 accent-accent-700" /> Xóa ảnh hiện tại
            </label>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-slate-300 transition after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:bg-primary-600 peer-checked:after:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-primary-200" />
      <span className="font-medium text-ink">{label}</span>
    </label>
  );
}
