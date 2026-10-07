import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "white";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary-700 text-white shadow-[0_8px_20px_-8px_rgb(4_119_58/0.6)] hover:bg-primary-800 hover:shadow-[0_12px_28px_-10px_rgb(4_119_58/0.7)]",
  secondary: "bg-white text-primary-800 ring-1 ring-inset ring-primary-200 hover:bg-primary-50 hover:ring-primary-300",
  ghost: "text-primary-700 hover:bg-primary-50",
  white: "bg-white text-primary-800 hover:bg-primary-50 shadow-soft",
};

const base =
  "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={clsx(base, variants[variant], className)} {...props} />;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={clsx(base, variants[variant], className)} {...props} />;
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={clsx(
        "inline-flex items-center gap-2 rounded-full bg-primary-100 px-3.5 py-1.5 text-sm font-semibold text-primary-800",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      data-reveal
      className={clsx("max-w-3xl", align === "center" ? "mx-auto text-center" : "", className)}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-4 text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      {lead ? <p className="mt-4 text-lg text-muted">{lead}</p> : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-primary-50 to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full border-[48px] border-primary-100/70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-8 h-56 w-56 rounded-full border-[24px] border-secondary-100/70"
      />
      <Container className="relative py-14 sm:py-20">
        <div className="max-w-3xl animate-fade-up">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="mt-4 text-4xl font-bold leading-[1.15] text-ink sm:text-5xl">{title}</h1>
          {lead ? <p className="mt-5 text-lg text-muted sm:text-xl">{lead}</p> : null}
          {children}
        </div>
      </Container>
    </section>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={clsx("rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8", className)}>{children}</div>
  );
}

export function Badge({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "blue" | "red" | "gray" | "amber" }) {
  const tones = {
    green: "bg-primary-100 text-primary-800",
    blue: "bg-secondary-100 text-secondary-700",
    red: "bg-accent-100 text-accent-700",
    gray: "bg-slate-100 text-slate-700",
    amber: "bg-amber-100 text-amber-800",
  };
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold whitespace-nowrap", tones[tone])}>
      {children}
    </span>
  );
}

/* ---------- Form primitives (visible labels, errors next to the field) ---------- */

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[0.95rem] font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-accent-700" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? <p id={`${htmlFor}-hint`} className="mt-1.5 text-sm text-muted">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm font-medium text-accent-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "block min-h-12 w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink shadow-sm transition placeholder:text-slate-400 hover:border-primary-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 aria-[invalid=true]:border-accent-500 aria-[invalid=true]:ring-accent-100";
