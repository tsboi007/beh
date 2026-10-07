"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, Check, Copy, PartyPopper } from "lucide-react";
import { bookAppointment, type FormState } from "@/app/actions";
import { Field, inputClass } from "@/components/ui";
import { FormAlert, Honeypot, SubmitButton, errProps } from "./form-bits";
import { TIME_SLOTS } from "@/lib/site";

type Opt = { id: number; title: string; slug?: string };
const noopSubscribe = () => () => {};

export function BookingForm({ services, doctors, hotline }: { services: Opt[]; doctors: Opt[]; hotline: string }) {
  const [state, action] = useActionState<FormState<{ code: string }>, FormData>(bookAppointment, { ok: false });
  const search = useSearchParams();
  const preselect = services.find((s) => s.slug === search.get("dich-vu"))?.id;
  // Today in Vietnam time, client-only (avoids a stale date in the prerendered page)
  const minDate = useSyncExternalStore(
    noopSubscribe,
    () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()),
    () => undefined,
  );
  const topRef = useRef<HTMLDivElement>(null);
  const v = state.values ?? {};
  const e = state.errors;

  useEffect(() => {
    if (state.ok || state.message) topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (e) {
      const first = Object.keys(e)[0];
      document.getElementById(first)?.focus();
    }
  }, [state, e]);

  if (state.ok && state.data) return <BookingSuccess code={state.data.code} hotline={hotline} />;

  return (
    <div ref={topRef} className="scroll-mt-32">
      <form action={action} noValidate className="relative space-y-6">
        <Honeypot />
        {state.message ? <FormAlert ok={false}>{state.message}</FormAlert> : null}

        <fieldset className="space-y-5">
          <legend className="mb-4 flex items-center gap-3 font-display text-xl font-bold text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm text-primary-800">1</span>
            Thông tin người khám
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Họ và tên" htmlFor="fullName" required error={e?.fullName} className="sm:col-span-2">
              <input id="fullName" name="fullName" autoComplete="name" defaultValue={v.fullName} className={inputClass} {...errProps(e, "fullName")} />
            </Field>
            <Field label="Số điện thoại" htmlFor="phone" required error={e?.phone} hint="Bệnh viện sẽ gọi số này để xác nhận lịch.">
              <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" defaultValue={v.phone} className={inputClass} {...errProps(e, "phone")} />
            </Field>
            <Field label="Năm sinh" htmlFor="birthYear" error={e?.birthYear}>
              <input id="birthYear" name="birthYear" inputMode="numeric" maxLength={4} placeholder="VD: 1965" defaultValue={v.birthYear} className={inputClass} {...errProps(e, "birthYear")} />
            </Field>
            <Field label="Email (không bắt buộc)" htmlFor="email" error={e?.email} className="sm:col-span-2">
              <input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} className={inputClass} {...errProps(e, "email")} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-5 border-t border-line pt-6">
          <legend className="mb-4 flex items-center gap-3 font-display text-xl font-bold text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm text-primary-800">2</span>
            Dịch vụ & thời gian
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Dịch vụ cần khám" htmlFor="serviceId">
              <select id="serviceId" name="serviceId" defaultValue={v.serviceId ?? (preselect ? String(preselect) : "")} className={inputClass}>
                <option value="">Chưa rõ, cần bác sĩ tư vấn</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Bác sĩ (không bắt buộc)" htmlFor="doctorId">
              <select id="doctorId" name="doctorId" defaultValue={v.doctorId ?? ""} className={inputClass}>
                <option value="">Bệnh viện sắp xếp</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ngày mong muốn" htmlFor="preferredDate" required error={e?.preferredDate} hint="Khám theo lịch hẹn từ Thứ 2 đến Thứ 6.">
              <input id="preferredDate" name="preferredDate" type="date" min={minDate} defaultValue={v.preferredDate} className={inputClass} {...errProps(e, "preferredDate")} />
            </Field>
            <div>
              <p id="time-label" className="mb-1.5 block text-[0.95rem] font-semibold text-ink">
                Khung giờ <span className="text-accent-700" aria-hidden>*</span>
              </p>
              <div role="radiogroup" aria-labelledby="time-label" className="grid grid-cols-2 gap-2" id="preferredTime" tabIndex={-1}>
                {TIME_SLOTS.map((t) => (
                  <label key={t} className="group relative cursor-pointer">
                    <input type="radio" name="preferredTime" value={t} defaultChecked={v.preferredTime === t} className="peer sr-only" />
                    <span className="flex min-h-11 items-center justify-center rounded-xl border border-line bg-white px-2 text-[0.95rem] font-medium text-ink-soft transition peer-checked:border-primary-600 peer-checked:bg-primary-700 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-primary-200 hover:border-primary-300">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
              {e?.preferredTime ? (
                <p role="alert" className="mt-1.5 text-sm font-medium text-accent-700">
                  {e.preferredTime}
                </p>
              ) : null}
            </div>
            <Field label="Triệu chứng / ghi chú" htmlFor="note" className="sm:col-span-2" hint="Ví dụ: mờ mắt 2 tuần, đã đeo kính 3 độ, có bệnh tiểu đường…">
              <textarea id="note" name="note" rows={4} defaultValue={v.note} className={inputClass} />
            </Field>
          </div>
        </fieldset>

        <div className="border-t border-line pt-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" name="consent" defaultChecked={v.consent === "on"} className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-primary-700" {...errProps(e, "consent")} id="consent" />
            <span className="text-ink-soft">
              Tôi đồng ý để Bệnh viện Mắt Bà Rịa – Vũng Tàu sử dụng thông tin trên nhằm liên hệ xác nhận lịch khám.
            </span>
          </label>
          {e?.consent ? (
            <p id="consent-error" role="alert" className="mt-1.5 text-sm font-medium text-accent-700">
              {e.consent}
            </p>
          ) : null}
        </div>

        <SubmitButton className="w-full sm:w-auto">
          <CalendarCheck className="h-5 w-5" aria-hidden /> Xác nhận đặt lịch
        </SubmitButton>
      </form>
    </div>
  );
}

function BookingSuccess({ code, hotline }: { code: string; hotline: string }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="animate-fade-up text-center">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-700">
        <PartyPopper className="h-10 w-10" aria-hidden />
      </span>
      <h2 ref={ref} tabIndex={-1} className="mt-6 font-display text-3xl font-bold text-ink outline-none">
        Đặt lịch thành công!
      </h2>
      <p className="mx-auto mt-3 max-w-md text-muted">
        Bệnh viện sẽ gọi điện xác nhận trong giờ hành chính. Vui lòng lưu lại mã đặt lịch để tra cứu.
      </p>
      <div className="mx-auto mt-8 flex max-w-sm items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50 p-4">
        <div className="text-left">
          <p className="text-sm text-muted">Mã đặt lịch</p>
          <p className="font-mono text-2xl font-bold tracking-wider text-primary-800">{code}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(code);
            setCopied(true);
          }}
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 font-semibold text-primary-800 shadow-soft"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? "Đã chép" : "Sao chép"}
        </button>
      </div>
      <p className="mt-6 text-muted">
        Cần đổi lịch? Gọi <a className="font-semibold text-primary-700 underline" href={`tel:${hotline.replace(/[^\d+]/g, "")}`}>{hotline}</a>
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/tra-cuu" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary-700 px-6 font-semibold text-white hover:bg-primary-800">
          Tra cứu lịch hẹn
        </Link>
        <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-full px-6 font-semibold text-primary-800 ring-1 ring-primary-200 hover:bg-primary-50">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
