import type { PayPalCurrency } from "./paypal-security.ts";

export type PayPalEnvironment = "sandbox" | "production";

// Live credentials are never read by previews or localhost. Missing config stays
// closed; saving credentials alone cannot enable a checkout.
export function paypalLiveConfig(env: Record<string, string | undefined>) {
  if (env.VERCEL_ENV !== "production") return null;
  const names = [
    "CLIENT_ID",
    "CLIENT_SECRET",
    "MERCHANT_ID",
    "PLAN_USD",
    "PLAN_EUR",
    "WEBHOOK_ID",
    "DATABASE_URL",
  ] as const;
  if (names.some((name) => !env[`PAYPAL_LIVE_${name}`]?.trim())) return null;
  if (!separatePayPalDatabase(env.PAYPAL_LIVE_DATABASE_URL!, env.DATABASE_URL))
    return null;
  return {
    environment: "production" as const,
    apiUrl: "https://api-m.paypal.com",
    clientId: env.PAYPAL_LIVE_CLIENT_ID!,
    secret: env.PAYPAL_LIVE_CLIENT_SECRET!,
    merchantId: env.PAYPAL_LIVE_MERCHANT_ID!,
    plans: {
      USD: env.PAYPAL_LIVE_PLAN_USD!,
      EUR: env.PAYPAL_LIVE_PLAN_EUR!,
    } satisfies Record<PayPalCurrency, string>,
    webhookId: env.PAYPAL_LIVE_WEBHOOK_ID!,
  };
}

export function separatePayPalDatabase(live: string, sandbox?: string) {
  function identity(value: string) {
    const url = new URL(value);
    if (
      !["postgres:", "postgresql:"].includes(url.protocol) ||
      !url.hostname ||
      !url.pathname ||
      url.pathname === "/"
    )
      throw new Error("invalid_database");
    return `${url.hostname.toLowerCase().replace("-pooler.", ".")}:${url.port || "5432"}${decodeURIComponent(url.pathname)}`;
  }
  try {
    return identity(live) !== (sandbox ? identity(sandbox) : null);
  } catch {
    return false;
  }
}

export function paypalLiveCheckoutAllowed(
  host: string | null,
  env: Record<string, string | undefined>,
) {
  if (!host || !paypalLiveAccountHost(host, env)) return false;
  const name = host.toLowerCase();
  if (env.PAYPAL_LIVE_CHECKOUT_STAGE === "review")
    return (
      /^[a-z0-9-]+\.vercel\.app$/.test(env.VERCEL_URL ?? "") &&
      name === env.VERCEL_URL
    );
  return (
    env.PAYPAL_LIVE_CHECKOUT_STAGE === "public" &&
    ["fundacionalmaarcoiris.org", "www.fundacionalmaarcoiris.org"].includes(
      name,
    )
  );
}

export function paypalLiveAccountHost(
  host: string | null,
  env: Record<string, string | undefined>,
) {
  if (
    env.VERCEL_ENV !== "production" ||
    !host ||
    host !== host.trim() ||
    /[/\\@?#\s:]/.test(host)
  )
    return false;
  return (
    ["fundacionalmaarcoiris.org", "www.fundacionalmaarcoiris.org"].includes(
      host.toLowerCase(),
    ) ||
    (/^[a-z0-9-]+\.vercel\.app$/.test(env.VERCEL_URL ?? "") &&
      host.toLowerCase() === env.VERCEL_URL)
  );
}
