import "server-only";

/**
 * Optional notifications. Nothing is sent unless configured:
 *  - Email: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (+ notify email in Admin → Cài đặt)
 *  - Telegram: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 * Failures are logged and never block the visitor's request.
 */
export async function notifyStaff(subject: string, lines: string[], to?: string) {
  const text = lines.join("\n");
  await Promise.allSettled([sendEmail(subject, text, to), sendTelegram(`${subject}\n\n${text}`)]);
}

async function sendEmail(subject: string, text: string, to?: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!to || !SMTP_HOST || !SMTP_USER || !SMTP_PASS) return;
  try {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 465),
      secure: Number(SMTP_PORT ?? 465) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transport.sendMail({ from: `"Website BV Mắt BR-VT" <${SMTP_USER}>`, to, subject, text });
  } catch (e) {
    console.error("[notify] email failed", e);
  }
}

async function sendTelegram(text: string) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });
  } catch (e) {
    console.error("[notify] telegram failed", e);
  }
}
