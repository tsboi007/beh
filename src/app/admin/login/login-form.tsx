"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { login, type AdminState } from "../actions";
import { Field, inputClass } from "@/components/ui";
import { FormAlert, SubmitButton } from "@/components/forms/form-bits";

export function LoginForm() {
  const [state, action] = useActionState<AdminState, FormData>(login, {});
  return (
    <form action={action} className="mt-8 space-y-5">
      {state.error ? <FormAlert ok={false}>{state.error}</FormAlert> : null}
      <Field label="Email" htmlFor="email" required>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClass} />
      </Field>
      <Field label="Mật khẩu" htmlFor="password" required>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <SubmitButton pendingText="Đang đăng nhập…" className="w-full">
        <LogIn className="h-5 w-5" aria-hidden /> Đăng nhập
      </SubmitButton>
    </form>
  );
}
