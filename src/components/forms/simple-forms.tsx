"use client";

import { useActionState, useEffect, useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { applyJob, askQuestion, sendContact, type FormState } from "@/app/actions";
import { Field, inputClass } from "@/components/ui";
import { FormAlert, Honeypot, SubmitButton, errProps } from "./form-bits";
import { QUESTION_TOPICS } from "@/lib/site";

function useResetOnSuccess(state: FormState) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
    if (state.errors) {
      const k = Object.keys(state.errors)[0];
      (document.getElementById(k) ?? document.getElementById(`q-${k}`))?.focus();
    }
  }, [state]);
  return ref;
}

export function QuestionForm() {
  const [state, action] = useActionState<FormState, FormData>(askQuestion, { ok: false });
  const ref = useResetOnSuccess(state);
  const v = state.ok ? {} : (state.values ?? {});
  const e = state.errors;
  return (
    <form ref={ref} action={action} noValidate className="relative space-y-5">
      <Honeypot />
      {state.message ? <FormAlert ok={state.ok}>{state.message}</FormAlert> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tên hiển thị" htmlFor="q-fullName" required error={e?.fullName} hint="Có thể dùng tên viết tắt, VD: Chị H. (Bà Rịa)">
          <input id="q-fullName" name="fullName" defaultValue={v.fullName} className={inputClass} aria-invalid={!!e?.fullName} />
        </Field>
        <Field label="Chủ đề" htmlFor="q-topic">
          <select id="q-topic" name="topic" defaultValue={v.topic ?? QUESTION_TOPICS[0]} className={inputClass}>
            {QUESTION_TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Số điện thoại (không công khai)" htmlFor="q-phone" error={e?.phone}>
          <input id="q-phone" name="phone" type="tel" inputMode="tel" defaultValue={v.phone} className={inputClass} aria-invalid={!!e?.phone} />
        </Field>
        <Field label="Email (không công khai)" htmlFor="q-email" error={e?.email}>
          <input id="q-email" name="email" type="email" defaultValue={v.email} className={inputClass} aria-invalid={!!e?.email} />
        </Field>
        <Field label="Câu hỏi của bạn" htmlFor="q-question" required error={e?.question} className="sm:col-span-2">
          <textarea id="q-question" name="question" rows={5} defaultValue={v.question} className={inputClass} aria-invalid={!!e?.question} />
        </Field>
      </div>
      <SubmitButton>
        <Send className="h-5 w-5" aria-hidden /> Gửi câu hỏi
      </SubmitButton>
    </form>
  );
}

export function ContactForm() {
  const [state, action] = useActionState<FormState, FormData>(sendContact, { ok: false });
  const ref = useResetOnSuccess(state);
  const v = state.ok ? {} : (state.values ?? {});
  const e = state.errors;
  return (
    <form ref={ref} action={action} noValidate className="relative space-y-5">
      <Honeypot />
      {state.message ? <FormAlert ok={state.ok}>{state.message}</FormAlert> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Họ và tên" htmlFor="fullName" required error={e?.fullName}>
          <input id="fullName" name="fullName" autoComplete="name" defaultValue={v.fullName} className={inputClass} {...errProps(e, "fullName")} />
        </Field>
        <Field label="Số điện thoại" htmlFor="phone" required error={e?.phone}>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" defaultValue={v.phone} className={inputClass} {...errProps(e, "phone")} />
        </Field>
        <Field label="Email" htmlFor="email" error={e?.email} className="sm:col-span-2">
          <input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} className={inputClass} {...errProps(e, "email")} />
        </Field>
        <Field label="Nội dung" htmlFor="message" required error={e?.message} className="sm:col-span-2">
          <textarea id="message" name="message" rows={5} defaultValue={v.message} className={inputClass} {...errProps(e, "message")} />
        </Field>
      </div>
      <SubmitButton>
        <Send className="h-5 w-5" aria-hidden /> Gửi liên hệ
      </SubmitButton>
    </form>
  );
}

export function ApplyForm({ jobId }: { jobId?: number }) {
  const [state, action] = useActionState<FormState, FormData>(applyJob, { ok: false });
  const ref = useResetOnSuccess(state);
  const v = state.ok ? {} : (state.values ?? {});
  const e = state.errors;
  return (
    <form ref={ref} action={action} noValidate className="relative space-y-5">
      <Honeypot />
      <input type="hidden" name="jobId" value={jobId ?? ""} />
      {state.message ? <FormAlert ok={state.ok}>{state.message}</FormAlert> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Họ và tên" htmlFor="fullName" required error={e?.fullName} className="sm:col-span-2">
          <input id="fullName" name="fullName" autoComplete="name" defaultValue={v.fullName} className={inputClass} {...errProps(e, "fullName")} />
        </Field>
        <Field label="Số điện thoại" htmlFor="phone" required error={e?.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} className={inputClass} {...errProps(e, "phone")} />
        </Field>
        <Field label="Email" htmlFor="email" required error={e?.email}>
          <input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} className={inputClass} {...errProps(e, "email")} />
        </Field>
        <Field label="CV / hồ sơ (PDF, Word, tối đa 5MB)" htmlFor="cv" required error={e?.cv} className="sm:col-span-2">
          <div className="relative">
            <Paperclip className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
            <input
              id="cv"
              name="cv"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className={`${inputClass} pl-12 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-100 file:px-4 file:py-1.5 file:font-semibold file:text-primary-800`}
              {...errProps(e, "cv")}
            />
          </div>
        </Field>
        <Field label="Thư giới thiệu (không bắt buộc)" htmlFor="coverLetter" className="sm:col-span-2">
          <textarea id="coverLetter" name="coverLetter" rows={4} defaultValue={v.coverLetter} className={inputClass} />
        </Field>
      </div>
      <SubmitButton pendingText="Đang tải hồ sơ…">
        <Send className="h-5 w-5" aria-hidden /> Nộp hồ sơ
      </SubmitButton>
    </form>
  );
}
