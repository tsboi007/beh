import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { AdminHeader, Panel } from "@/components/admin/bits";
import { EditForm } from "@/components/admin/editor";
import { Field, inputClass } from "@/components/ui";
import { saveSettings } from "../../actions";
import { DEFAULT_SETTINGS, SETTING_LABELS, type SiteSettings } from "@/lib/site";

const GROUPS: { title: string; keys: (keyof SiteSettings)[] }[] = [
  { title: "Thông tin liên hệ", keys: ["address", "hotline", "phone", "email", "workingHours", "emergencyNote"] },
  { title: "Mạng xã hội & chat", keys: ["zaloUrl", "messengerUrl", "facebookUrl", "youtubeUrl", "tiktokUrl"] },
  { title: "Bản đồ & thông báo", keys: ["mapEmbedUrl", "notifyEmail"] },
];

export default async function SettingsAdmin() {
  const db = await adminDb();
  const rows = await db.select().from(schema.settings);
  const s: SiteSettings = { ...DEFAULT_SETTINGS };
  for (const r of rows) if (r.key in s) (s as Record<string, string>)[r.key] = r.value;

  return (
    <>
      <AdminHeader title="Cài đặt website" desc="Thông tin hiển thị ở đầu trang, chân trang, nút liên hệ nhanh và trang Liên hệ." />
      <EditForm action={saveSettings} submitLabel="Lưu cài đặt">
        {GROUPS.map((g) => (
          <Panel key={g.title} className="p-5 sm:p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-ink">{g.title}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {g.keys.map((k) => (
                <Field key={k} label={SETTING_LABELS[k]} htmlFor={k} className={k === "mapEmbedUrl" || k === "address" ? "sm:col-span-2" : undefined}>
                  <input id={k} name={k} defaultValue={s[k]} className={inputClass} />
                </Field>
              ))}
            </div>
          </Panel>
        ))}
        <p className="text-sm text-muted">
          Gửi email thông báo cần cấu hình SMTP trong biến môi trường trên Vercel (xem README). Có thể dùng thêm Telegram bot qua biến TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
        </p>
      </EditForm>
    </>
  );
}
