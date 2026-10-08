"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { login, type AdminState } from "../actions";
import { Field, inputClass } from "@/components/ui";
import { FormAlert, SubmitButton } from "@/components/forms/form-bits";
import { PasswordInput } from "@/components/admin/password-input";

export function LoginForm() {
  const [state, action] = useActionState<AdminState, FormData>(login, {});
  return (
    <form action={action} className="mt-8 space-y-5">
      {state.error ? <FormAlert ok={false}>{state.error}</FormAlert> : null}
      <Field label="Tên đăng nhập hoặc email" htmlFor="email" required hint="VD: admin hoặc admin@beh.vn">
        <input id="email" name="email" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required className={inputClass} />
      </Field>
      <Field label="Mật khẩu" htmlFor="password" required>
        <PasswordInput id="password" name="password" autoComplete="current-password" required />
      </Field>
      <SubmitButton pendingText="Đang đăng nhập…" className="w-full">
        <LogIn className="h-5 w-5" aria-hidden /> Đăng nhập
      </SubmitButton>
    </form>
  );
}
