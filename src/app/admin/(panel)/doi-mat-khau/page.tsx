import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
import { getAdmin } from "@/lib/auth";
import { Panel } from "@/components/admin/bits";
import { ChangePasswordForm } from "./change-password-form";

async function AccountEmail() {
  const admin = await getAdmin();
  return <>{admin?.email}</>;
}

export default function ChangePasswordPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Đổi mật khẩu</h1>
        <p className="mt-1 text-muted">
          Tài khoản:{" "}
          <Suspense fallback="…">
            <AccountEmail />
          </Suspense>
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Panel className="p-6 sm:p-8">
          <ChangePasswordForm />
        </Panel>
        <Panel className="h-fit p-6">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <ShieldCheck className="h-5 w-5 text-primary-600" aria-hidden /> Lời khuyên bảo mật
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[0.95rem] text-ink-soft">
            <li>Trang quản trị chứa thông tin cá nhân của người bệnh (họ tên, số điện thoại, triệu chứng). Hãy dùng mật khẩu mạnh, không dùng chung với tài khoản khác.</li>
            <li>Không chia sẻ mật khẩu qua Zalo, email hay giấy ghi chú.</li>
            <li>Đổi mật khẩu ngay khi có nhân sự nghỉ việc hoặc nghi lộ mật khẩu.</li>
          </ul>
        </Panel>
      </div>
    </>
  );
}
