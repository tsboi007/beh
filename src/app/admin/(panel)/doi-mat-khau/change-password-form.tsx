"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { KeyRound } from "lucide-react";
import clsx from "clsx";
import { changePassword, type AdminState } from "@/app/admin/actions";
import { Field } from "@/components/ui";
import { FormAlert, SubmitButton } from "@/components/forms/form-bits";
import { PasswordInput, passwordStrength } from "@/components/admin/password-input";

export function ChangePasswordForm() {
  const [state, action] = useActionState<AdminState, FormData>(changePassword, {});
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const strength = passwordStrength(next);
  const mismatch = confirm.length > 0 && confirm !== next;

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-5" onReset={() => (setNext(""), setConfirm(""))}>
      {state.error ? <FormAlert ok={false}>{state.error}</FormAlert> : null}
      {state.ok ? <FormAlert ok>Đã đổi mật khẩu. Lần đăng nhập sau hãy dùng mật khẩu mới.</FormAlert> : null}

      <Field label="Mật khẩu hiện tại" htmlFor="current" required>
        <PasswordInput id="current" name="current" autoComplete="current-password" required />
      </Field>

      <Field label="Mật khẩu mới" htmlFor="next" required hint="Tối thiểu 8 ký tự. Nên dùng 12 ký tự trở lên, có chữ hoa, chữ thường, số và ký tự đặc biệt.">
        <PasswordInput id="next" name="next" autoComplete="new-password" minLength={8} required onValue={setNext} aria-describedby="next-hint pw-strength" />
      </Field>
      {next ? (
        <div id="pw-strength" aria-live="polite" className="-mt-2">
          <div className="flex gap-1.5" aria-hidden>
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className={clsx("h-1.5 flex-1 rounded-full", i <= strength.score ? strength.tone : "bg-line")} />
            ))}
          </div>
          <p className="mt-1.5 text-sm text-muted">
            Độ mạnh: <strong className="text-ink">{strength.label}</strong>
          </p>
        </div>
      ) : null}

      <Field label="Nhập lại mật khẩu mới" htmlFor="confirm" required error={mismatch ? "Mật khẩu nhập lại chưa khớp." : undefined}>
        <PasswordInput id="confirm" name="confirm" autoComplete="new-password" required onValue={setConfirm} aria-invalid={mismatch || undefined} />
      </Field>

      <SubmitButton pendingText="Đang lưu…" className="w-full sm:w-auto">
        <KeyRound className="h-5 w-5" aria-hidden /> Đổi mật khẩu
      </SubmitButton>
    </form>
  );
}
