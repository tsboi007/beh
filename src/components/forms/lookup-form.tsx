"use client";

import { useActionState } from "react";
import { CalendarDays, Clock, Search, Stethoscope, User } from "lucide-react";
import clsx from "clsx";
import { lookupAppointment, type FormState, type LookupResult } from "@/app/actions";
import { Field, inputClass } from "@/components/ui";
import { FormAlert, SubmitButton, errProps } from "./form-bits";

const STEPS = ["pending", "confirmed", "done"] as const;
const STEP_LABEL = { pending: "Đã tiếp nhận", confirmed: "Đã xác nhận", done: "Đã khám" };

export function LookupForm() {
  const [state, action] = useActionState<FormState<LookupResult>, FormData>(lookupAppointment, { ok: false });
  const v = state.values ?? {};
  const e = state.errors;
  const r = state.ok ? state.data : undefined;

  return (
    <div className="space-y-8">
      <form action={action} noValidate className="grid gap-5 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
        <Field label="Mã đặt lịch" htmlFor="code" required error={e?.code}>
          <input
            id="code"
            name="code"
            placeholder="BVM-XXXXXX"
            autoCapitalize="characters"
            defaultValue={v.code}
            className={clsx(inputClass, "font-mono uppercase tracking-wider")}
            {...errProps(e, "code")}
          />
        </Field>
        <Field label="Số điện thoại đã đăng ký" htmlFor="phone" required error={e?.phone}>
          <input id="phone" name="phone" type="tel" inputMode="tel" defaultValue={v.phone} className={inputClass} {...errProps(e, "phone")} />
        </Field>
        <div className="sm:pt-[1.85rem]">
          <SubmitButton pendingText="Đang tìm…" className="w-full !min-h-12 !py-0 !text-base">
            <Search className="h-5 w-5" aria-hidden /> Tra cứu
          </SubmitButton>
        </div>
      </form>

      {state.message && !state.ok ? <FormAlert ok={false}>{state.message}</FormAlert> : null}

      {r ? (
        <section aria-live="polite" className="animate-fade-up rounded-3xl border border-line bg-canvas p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-xl font-bold tracking-wider text-primary-800">{r.code}</p>
            <span
              className={clsx(
                "rounded-full px-3 py-1 text-sm font-semibold",
                r.statusKey === "cancelled" ? "bg-accent-100 text-accent-700" : r.statusKey === "pending" ? "bg-amber-100 text-amber-800" : "bg-primary-100 text-primary-800",
              )}
            >
              {r.status}
            </span>
          </div>

          {r.statusKey !== "cancelled" ? (
            <ol className="mt-8 grid grid-cols-3 gap-2" aria-label="Tiến trình lịch hẹn">
              {STEPS.map((step, i) => {
                const active = STEPS.indexOf(r.statusKey as (typeof STEPS)[number]) >= i;
                return (
                  <li key={step} className="text-center">
                    <div className={clsx("h-2 rounded-full", active ? "bg-primary-600" : "bg-line")} />
                    <p className={clsx("mt-2 text-sm font-medium", active ? "text-primary-800" : "text-muted")}>{STEP_LABEL[step]}</p>
                  </li>
                );
              })}
            </ol>
          ) : null}

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { icon: User, k: "Người khám", v: r.name },
              { icon: Stethoscope, k: "Dịch vụ", v: r.service ?? "Bác sĩ tư vấn" },
              { icon: CalendarDays, k: "Ngày khám", v: r.date },
              { icon: Clock, k: "Khung giờ", v: r.time },
            ].map(({ icon: Icon, k, v }) => (
              <div key={k} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-line">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
                <div>
                  <dt className="text-sm text-muted">{k}</dt>
                  <dd className="font-semibold text-ink">{v}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
