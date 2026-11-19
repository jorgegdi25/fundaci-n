import { donationEmailSettings } from "./donation-messages.ts";

// A connection check, never a receipt. Fixed recipient and idempotency keys
// ensure retries cannot send extra messages or contact donors.
export async function sendPayPalMailCheck(
  env: Record<string, string | undefined>,
  fetcher: typeof fetch = fetch,
) {
  const config = donationEmailSettings(env, "production");
  if (
    env.PAYPAL_LIVE_EMAILS_ENABLED !== "review" ||
    !config ||
    config.testRecipient !== "webmaster@fundacionalmaarcoiris.org"
  )
    throw new Error("mail_review_only");

  const messages = [
    {
      lang: "es",
      subject: "[PRUEBA] Avisos de PayPal — español",
      title: "Prueba de conexión de correo",
      body: "Este mensaje verifica la conexión de correos de Fundación Alma Arcoíris para PayPal. No corresponde a una donación y no confirma ningún cobro. Los avisos de revisión se envían únicamente al correo webmaster de la fundación.",
    },
    {
      lang: "en",
      subject: "[TEST] PayPal notifications — English",
      title: "Email connection test",
      body: "This message checks the PayPal email connection for Fundación Alma Arcoíris. It is not a donation receipt and does not confirm any payment. Review notifications are sent only to the foundation’s webmaster email address.",
    },
  ];
  const results: { lang: string; id: string }[] = [];
  for (const message of messages) {
    const response = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
      headers: {
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `alma/paypal-live-connection/2026-11-18/${message.lang}/v1`,
      },
      body: JSON.stringify({
        from: `Fundación Alma Arcoíris <${config.from}>`,
        to: [config.testRecipient],
        reply_to: "contacto@fundacionalmaarcoiris.org",
        subject: message.subject,
        text: `${message.title}\n\n${message.body}`,
        html: `<!doctype html><html lang="${message.lang}"><head><meta charset="utf-8"></head><body style="margin:0;background:#f5f5f0;font-family:Arial,sans-serif;font-size:18px;line-height:1.6;color:#272d29"><table role="presentation" style="width:100%;max-width:640px;margin:24px auto;background:white;border-radius:18px"><tr><td style="padding:32px"><p style="color:#534a8f;font-weight:bold">Fundación Alma Arcoíris</p><h1 style="font-size:28px">${message.title}</h1><p>${message.body}</p></td></tr></table></body></html>`,
      }),
    });
    const data = await response.json().catch(() => null);
    if (
      !response.ok ||
      typeof data?.id !== "string" ||
      !/^[A-Za-z0-9_-]{1,100}$/.test(data.id)
    )
      throw new Error("mail_check_delivery_failed");
    results.push({ lang: message.lang, id: data.id });
  }
  return { sent: results, recipient: config.testRecipient, donation: false };
}
