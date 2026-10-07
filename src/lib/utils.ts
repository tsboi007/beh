export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

const dateFmt = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" });
const dateTimeFmt = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Ho_Chi_Minh",
});

export const formatDate = (d: Date | string | null | undefined) => (d ? dateFmt.format(new Date(d)) : "");
export const formatDateTime = (d: Date | string | null | undefined) => (d ? dateTimeFmt.format(new Date(d)) : "");

/** "2026-10-08" -> "08/10/2026" without timezone shifts. */
export function formatYmd(ymd: string) {
  const [y, m, d] = ymd.split("-");
  return y && m && d ? `${d}/${m}/${y}` : ymd;
}

/** Vietnamese phone numbers: mobile (0xxxxxxxxx) or landline (02xx…), optional +84. */
export const PHONE_RE = /^(?:\+?84|0)(?:\d[\s.-]?){8,10}$/;

export function normalizePhone(p: string) {
  const digits = p.replace(/[^\d+]/g, "");
  return digits.startsWith("+84") ? "0" + digits.slice(3) : digits.startsWith("84") && digits.length > 10 ? "0" + digits.slice(2) : digits;
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I confusion

export function appointmentCode() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return "BVM-" + Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

export function readingTime(markdown: string) {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  done: "Đã khám",
  cancelled: "Đã hủy",
};
