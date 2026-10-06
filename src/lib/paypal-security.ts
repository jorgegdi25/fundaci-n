import { causes, type Frequency } from "./donations.ts";
export type PayPalCurrency = "USD" | "EUR";
export function paypalConfig(env: Record<string, string | undefined>) {
  if (env.PAYPAL_ENVIRONMENT !== "sandbox") return null;
  const keys = [
    "PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "PAYPAL_MERCHANT_ID",
    "PAYPAL_PLAN_USD",
    "PAYPAL_PLAN_EUR",
    "PAYPAL_WEBHOOK_ID",
  ] as const;
  if (keys.some((k) => !env[k]?.trim())) return null;
  return {
    environment: "sandbox" as const,
    apiUrl: "https://api-m.sandbox.paypal.com",
    clientId: env.PAYPAL_CLIENT_ID!,
    secret: env.PAYPAL_CLIENT_SECRET!,
    merchantId: env.PAYPAL_MERCHANT_ID!,
    plans: { USD: env.PAYPAL_PLAN_USD!, EUR: env.PAYPAL_PLAN_EUR! },
    webhookId: env.PAYPAL_WEBHOOK_ID!,
  };
}
export function decimalCents(value: unknown) {
  if (typeof value !== "string" || !/^\d{1,6}(?:\.\d{1,2})?$/.test(value))
    return null;
  const [whole, fraction = ""] = value.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
}
export const decimalAmount = (cents: number) => (cents / 100).toFixed(2);
export function validatePayPalGift(v: Record<string, unknown>) {
  const amount = decimalCents(v.amount);
  if (amount === null || amount < 100 || amount > 1000000) return null;
  if (v.currency !== "USD" && v.currency !== "EUR") return null;
  if (v.frequency !== "once" && v.frequency !== "monthly") return null;
  if (
    typeof v.cause !== "string" ||
    !causes.includes(v.cause as (typeof causes)[number])
  )
    return null;
  if (v.lang !== "es" && v.lang !== "en") return null;
  if (
    v.agreeFoundation !== true ||
    (v.frequency === "monthly" && v.agreeMonthly !== true)
  )
    return null;
  return {
    amount,
    currency: v.currency as PayPalCurrency,
    frequency: v.frequency as Frequency,
    cause: v.cause,
    lang: v.lang,
  };
}
export type PayPalContract = {
  id: string;
  amount: number;
  currency: string;
  order_id?: string;
  subscription_id?: string;
  plan_id?: string;
};
// Approval callbacks and webhook payloads are hints. Only canonical API resources
// whose financial contract matches the stored gift can update its status.
export function samePayPalOrder(
  order: any,
  gift: PayPalContract,
  merchantId: string,
) {
  const units = order?.purchase_units;
  return (
    order?.id === gift.order_id &&
    order?.intent === "CAPTURE" &&
    Array.isArray(units) &&
    units.length === 1 &&
    units[0].custom_id === gift.id &&
    units[0].payee?.merchant_id === merchantId &&
    units[0].amount?.currency_code === gift.currency &&
    decimalCents(units[0].amount?.value) === gift.amount
  );
}
export function samePayPalSubscription(sub: any, gift: PayPalContract) {
  const cycles = sub?.plan?.billing_cycles;
  const cycle = cycles?.[0],
    price = cycle?.pricing_scheme?.fixed_price;
  return (
    sub?.id === gift.subscription_id &&
    sub.custom_id === gift.id &&
    sub.plan_id === gift.plan_id &&
    (!sub.quantity || sub.quantity === "1") &&
    Array.isArray(cycles) &&
    cycles.length === 1 &&
    cycle.tenure_type === "REGULAR" &&
    cycle.sequence === 1 &&
    cycle.total_cycles === 0 &&
    cycle.frequency?.interval_unit === "MONTH" &&
    cycle.frequency.interval_count === 1 &&
    price?.currency_code === gift.currency &&
    decimalCents(price.value) === gift.amount &&
    sub.plan.payment_preferences?.auto_bill_outstanding === false &&
    (!sub.plan.payment_preferences.setup_fee ||
      decimalCents(sub.plan.payment_preferences.setup_fee.value) === 0) &&
    (!sub.shipping_amount || decimalCents(sub.shipping_amount.value) === 0) &&
    (!sub.plan.taxes || Number(sub.plan.taxes.percentage) === 0)
  );
}
export function safePayPalId(
  value: unknown,
  subscription = false,
): value is string {
  return (
    typeof value === "string" &&
    (subscription ? /^I-[A-Z0-9]{8,24}$/ : /^[A-Z0-9]{10,32}$/).test(value)
  );
}
// Read identifiers from a verified event; never fetch a URL supplied by its payload.
export function eventPaymentId(resource: any) {
  for (const id of [
    resource?.sale_id,
    resource?.supplementary_data?.related_ids?.capture_id,
  ]) {
    if (safePayPalId(id)) return id;
  }
  for (const link of Array.isArray(resource?.links) ? resource.links : []) {
    if (link?.rel !== "up" || typeof link.href !== "string") continue;
    try {
      const url = new URL(link.href);
      const match = url.pathname.match(
        /^\/v[12]\/payments\/(?:sale|sales|captures)\/([A-Z0-9]{10,32})$/,
      );
      if (
        url.protocol === "https:" &&
        [
          "api.paypal.com",
          "api-m.paypal.com",
          "api.sandbox.paypal.com",
          "api-m.sandbox.paypal.com",
        ].includes(url.hostname) &&
        !url.username &&
        !url.password &&
        !url.port &&
        !url.search &&
        !url.hash &&
        match
      )
        return match[1];
    } catch {
      /* Ignore malformed links. */
    }
  }
  return safePayPalId(resource?.id) ? resource.id : null;
}
export function webhookHeaders(headers: Headers) {
  const values = {
    auth_algo: headers.get("paypal-auth-algo"),
    cert_url: headers.get("paypal-cert-url"),
    transmission_id: headers.get("paypal-transmission-id"),
    transmission_sig: headers.get("paypal-transmission-sig"),
    transmission_time: headers.get("paypal-transmission-time"),
  };
  if (Object.values(values).some((v) => !v || v.length > 4096)) return null;
  try {
    const url = new URL(values.cert_url!);
    if (
      url.protocol !== "https:" ||
      ![
        "api.sandbox.paypal.com",
        "api.paypal.com",
        "api-m.sandbox.paypal.com",
        "api-m.paypal.com",
      ].includes(url.hostname) ||
      !url.pathname.startsWith("/v1/notifications/certs/") ||
      url.username ||
      url.password ||
      url.port ||
      url.search ||
      url.hash
    )
      return null;
  } catch {
    return null;
  }
  return values;
}
