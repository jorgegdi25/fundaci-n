// Transactional copy based on the November client brief. No automatic tax
// certificate, tax benefit or completed SARLAFT registration is promised.
export type DonationNotice = {
  provider: "wompi" | "paypal";
  reference: string;
  amountMinor: number;
  currency: "COP" | "USD" | "EUR";
  frequency: "once" | "monthly";
  cause: "general" | "el-cairo" | "sierra-nevada" | "amazonas" | "mhuysqa";
  lang: "es" | "en";
  environment: "sandbox";
  email: string | null;
  occurredAt: string;
};
export function validNotice(input: unknown): DonationNotice | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const v = input as Record<string, unknown>;
  if (
    !["wompi", "paypal"].includes(String(v.provider)) ||
    typeof v.reference !== "string" ||
    !/^[A-Za-z0-9_-]{1,120}$/.test(v.reference) ||
    !Number.isSafeInteger(v.amountMinor) ||
    Number(v.amountMinor) <= 0 ||
    Number(v.amountMinor) > 10000000000 ||
    !["COP", "USD", "EUR"].includes(String(v.currency)) ||
    (v.provider === "wompi") !== (v.currency === "COP") ||
    !["once", "monthly"].includes(String(v.frequency)) ||
    !["general", "el-cairo", "sierra-nevada", "amazonas", "mhuysqa"].includes(
      String(v.cause),
    ) ||
    !["es", "en"].includes(String(v.lang)) ||
    v.environment !== "sandbox" ||
    typeof v.occurredAt !== "string" ||
    !Number.isFinite(Date.parse(v.occurredAt)) ||
    (v.email !== null &&
      (typeof v.email !== "string" ||
        v.email.length > 254 ||
        !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(v.email)))
  )
    return null;
  // Whitelist fields; never retain raw provider responses, tokens or card data.
  return {
    provider: v.provider,
    reference: v.reference,
    amountMinor: v.amountMinor,
    currency: v.currency,
    frequency: v.frequency,
    cause: v.cause,
    lang: v.lang,
    environment: "sandbox",
    email: v.email,
    occurredAt: new Date(v.occurredAt).toISOString(),
  } as DonationNotice;
}
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function donationMessage(
  input: DonationNotice,
  audience: "donor" | "foundation",
) {
  const gift = validNotice(input);
  if (!gift) throw new Error("invalid_donation_notice");
  const es = gift.lang === "es";
  const names = {
    general: es ? "Fondo General" : "General Fund",
    "el-cairo": "El Cairo",
    "sierra-nevada": "Sierra Nevada",
    amazonas: es ? "Amazonas" : "Amazon",
    mhuysqa: "Pueblo Mhuysqa",
  };
  const amount = new Intl.NumberFormat(es ? "es-CO" : "en-US", {
    style: "currency",
    currency: gift.currency,
  }).format(gift.amountMinor / 100);
  const title =
    audience === "foundation"
      ? es
        ? "Aporte de prueba confirmado"
        : "Test gift confirmed"
      : es
        ? "¡Gracias de corazón! Tu aporte de prueba fue aprobado."
        : "Thank you from the heart! Your test gift was approved.";
  const warning = es
    ? "PRUEBA SANDBOX: no se ha movido dinero real. Este mensaje no es un certificado tributario."
    : "SANDBOX TEST: no real money has moved. This message is not a tax certificate.";
  const fields = [
    [es ? "Proyecto" : "Project", names[gift.cause]],
    [es ? "Aporte" : "Gift", `${amount} ${gift.currency}`],
    [
      es ? "Frecuencia" : "Frequency",
      gift.frequency === "monthly"
        ? es
          ? "Mensual"
          : "Monthly"
        : es
          ? "Único"
          : "One-time",
    ],
    [
      es ? "Medio de pago" : "Payment provider",
      gift.provider === "wompi" ? "Wompi" : "PayPal",
    ],
    [es ? "Referencia" : "Reference", gift.reference],
  ];
  const explanation =
    audience === "foundation"
      ? es
        ? "La pasarela confirmó este aporte de prueba. El pago y el registro SARLAFT se verifican por separado; este mensaje no acredita que el formulario esté completado."
        : "The payment provider confirmed this test gift. Payment and SARLAFT registration are verified separately; this message does not confirm that the form has been completed."
      : es
        ? "Para registrar una donación real y tramitar un certificado, si lo solicitaste, la fundación requiere completar el formulario de participantes y declaración de origen de fondos (SARLAFT). En esta prueba puedes revisar el formulario, sin enviar datos ficticios ni información personal al registro real."
        : "To register a real gift and process a certificate, if requested, the foundation requires the participant registration and declaration of source of funds form (SARLAFT). For this test, review the form without submitting fictitious or personal information to the real register. The current form is in Spanish.";
  const links = [
    [
      es ? "Revisar formulario SARLAFT" : "Review the SARLAFT form",
      "https://forms.gle/7DTsXPsm93ZMJby17",
    ],
    [
      es ? "Unirme a la comunidad" : "Join the community",
      "https://chat.whatsapp.com/Kd38mXQ7kYgB1jdDkr6QBt",
    ],
    [
      es ? "Contactar por WhatsApp" : "Contact us on WhatsApp",
      "https://wa.me/573044989707",
    ],
  ];
  const contact = es
    ? "Soporte: contacto@fundacionalmaarcoiris.org · Certificados: certificados@fundacionalmaarcoiris.org"
    : "Support: contacto@fundacionalmaarcoiris.org · Certificates: certificados@fundacionalmaarcoiris.org";
  const subject = `[Sandbox · ${audience}] ${title}`;
  const text = [
    title,
    warning,
    ...fields.map(([label, value]) => `${label}: ${value}`),
    explanation,
    ...links.map(([label, url]) => `${label}: ${url}`),
    contact,
  ].join("\n\n");
  const html = `<!doctype html><html lang="${gift.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f5f5f0;color:#272d29;font-family:Arial,sans-serif;font-size:18px;line-height:1.6"><table role="presentation" style="width:100%;max-width:640px;margin:24px auto;background:#fff;border-radius:18px"><tr><td style="padding:32px"><p style="color:#534a8f;font-weight:bold">Fundación Alma Arcoíris</p><h1 style="font-size:28px;line-height:1.3">${escape(title)}</h1><p style="padding:16px;background:#fff3cf;border-radius:8px">${escape(warning)}</p><table style="width:100%;font-size:18px">${fields.map(([label, value]) => `<tr><th scope="row" style="text-align:left;padding:8px 12px 8px 0">${escape(label)}</th><td style="padding:8px 0;overflow-wrap:anywhere">${escape(value)}</td></tr>`).join("")}</table><p>${escape(explanation)}</p>${links.map(([label, url]) => `<p><a href="${url}" style="color:#534a8f;font-weight:bold">${escape(label)} ↗</a></p>`).join("")}<p style="font-size:16px">${escape(contact)}</p></td></tr></table></body></html>`;
  return { subject, text, html };
}

export function donationEmailSettings(env: Record<string, string | undefined>) {
  // Separate opt-in from payment credentials. A configured API key alone never
  // enables mail. This implementation only permits a sandbox test recipient.
  const email = (v: string | undefined): v is string =>
    Boolean(v && v.length <= 254 && /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(v));
  if (
    env.DONATION_EMAILS_ENABLED !== "sandbox" ||
    !env.RESEND_API_KEY ||
    !email(env.DONATION_EMAIL_FROM) ||
    !email(env.DONATION_TEST_RECIPIENT)
  )
    return null;
  const start = Date.parse(env.DONATION_EMAIL_START_AT ?? "");
  if (!Number.isFinite(start)) return null;
  return {
    key: env.RESEND_API_KEY,
    from: env.DONATION_EMAIL_FROM,
    testRecipient: env.DONATION_TEST_RECIPIENT,
    start,
  };
}

export async function deliverDonationEmail(
  gift: DonationNotice,
  audience: "donor" | "foundation",
  env: Record<string, string | undefined>,
  fetcher: typeof fetch = fetch,
) {
  const c = donationEmailSettings(env),
    valid = validNotice(gift);
  if (!c || !valid || Date.parse(valid.occurredAt) < c.start)
    return { status: "disabled" as const };
  if (audience === "donor" && !valid.email)
    return { status: "skipped" as const };
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
    headers: {
      Authorization: `Bearer ${c.key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `alma/${valid.provider}/${valid.reference}/${audience}/v1`,
    },
    body: JSON.stringify({
      from: `Fundación Alma Arcoíris <${c.from}>`,
      to: [c.testRecipient],
      reply_to: "contacto@fundacionalmaarcoiris.org",
      ...donationMessage(valid, audience),
    }),
  });
  const data = await response.json().catch(() => null);
  if (
    !response.ok ||
    typeof data?.id !== "string" ||
    !/^[A-Za-z0-9_-]{1,100}$/.test(data.id)
  )
    throw new Error("donation_email_delivery_failed");
  return { status: "sent" as const, id: data.id };
}
