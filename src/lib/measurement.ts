import { routeNames } from "./i18n.ts";

export const tagManagerId = "GTM-KBQZZQ26";
export const consentStorageKey = "alma-consent-v1";
export type MeasurementConsent = { analytics: boolean; marketing: boolean };
export type MeasurementEvent =
  | "donation_started"
  | "donation_completed"
  | "whatsapp_click"
  | "volunteer_application"
  | "volunteer_information"
  | "phone_click"
  | "email_click"
  | "newsletter_signup";

type EventFields = {
  payment_provider?: "wompi" | "paypal";
  donation_frequency?: "once" | "monthly";
  project?: string;
  value?: number;
  currency?: "COP" | "USD" | "EUR";
  transaction_id?: string;
  link_context?: "direct" | "community";
  placement?: "header" | "footer" | "content";
  signup_source?: "footer" | "donate";
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function measurementHost(host: string) {
  return [
    "fundacionalmaarcoiris.org",
    "www.fundacionalmaarcoiris.org",
  ].includes(host);
}

export function parseMeasurementConsent(
  value: unknown,
): MeasurementConsent | null {
  if (!value || typeof value !== "object") return null;
  const consent = value as Record<string, unknown>;
  return typeof consent.analytics === "boolean" &&
    typeof consent.marketing === "boolean"
    ? { analytics: consent.analytics, marketing: consent.marketing }
    : null;
}

export function readMeasurementConsent(): MeasurementConsent {
  try {
    return (
      parseMeasurementConsent(
        JSON.parse(localStorage.getItem(consentStorageKey) ?? "null"),
      ) ?? { analytics: false, marketing: false }
    );
  } catch {
    return { analytics: false, marketing: false };
  }
}

export function measurementPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const lang = segments[0] === "en" ? "en" : "es";
  const page = segments.slice(1).join("/");
  const namedPage = Object.values(routeNames).some(
    (route) => route[lang] === page,
  );
  const projectPage =
    segments[1] === routeNames.projects[lang] &&
    ["el-cairo", "sierra-nevada", "amazonas", "mhuysqa"].includes(
      segments[2],
    ) &&
    segments.length === 3;
  return namedPage || projectPage ? "/" + segments.join("/") : "/" + lang;
}

export function consentCommand(consent: MeasurementConsent) {
  return {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  };
}

export function trackEvent(event: MeasurementEvent, fields: EventFields = {}) {
  if (
    typeof window === "undefined" ||
    !measurementHost(window.location.hostname)
  )
    return false;
  const consent = readMeasurementConsent();
  if (!consent.analytics && !consent.marketing) return false;
  const page = measurementPath(window.location.pathname);
  // Explicit fields prevent contact details, URLs, form contents and payment
  // access tokens from reaching the measurement layer.
  try {
    (window.dataLayer ??= []).push({
      event,
      page_path: page,
      page_location: window.location.origin + page,
      language: page.startsWith("/en") ? "en" : "es",
      payment_provider: fields.payment_provider,
      donation_frequency: fields.donation_frequency,
      project: fields.project,
      value: fields.value,
      currency: fields.currency,
      transaction_id: fields.transaction_id,
      link_context: fields.link_context,
      placement: fields.placement,
      signup_source: fields.signup_source,
    });
    return true;
  } catch {
    // Measurement must not interrupt registration or payment result rendering.
    return false;
  }
}

export function linkMeasurement(href: string, action: string | null) {
  if (action === "volunteer_application" || action === "volunteer_information")
    return { event: action } as const;
  let url: URL;
  try {
    url = new URL(href, "https://fundacionalmaarcoiris.org");
  } catch {
    return null;
  }
  if (url.protocol === "tel:") return { event: "phone_click" } as const;
  if (url.protocol === "mailto:") return { event: "email_click" } as const;
  if (
    url.origin === "https://checkout.wompi.co" &&
    url.pathname === "/l/bfXo9h"
  )
    return {
      event: "donation_started",
      fields: { payment_provider: "wompi", donation_frequency: "once" },
    } as const;
  if (["wa.me", "api.whatsapp.com", "chat.whatsapp.com"].includes(url.hostname))
    return {
      event: "whatsapp_click",
      fields: {
        link_context:
          url.hostname === "chat.whatsapp.com" ? "community" : "direct",
      },
    } as const;
  return null;
}

export function trackCompletedDonation(gift: {
  id: string;
  amount: number;
  currency: string;
  frequency: string;
  cause: string;
  environment: string;
  provider: "wompi" | "paypal";
}) {
  if (
    gift.environment !== "production" ||
    typeof window === "undefined" ||
    !["COP", "USD", "EUR"].includes(gift.currency) ||
    !Number.isFinite(gift.amount) ||
    gift.amount <= 0 ||
    !["general", "el-cairo", "sierra-nevada", "amazonas", "mhuysqa"].includes(
      gift.cause,
    ) ||
    !/^[a-zA-Z0-9_-]{1,120}$/.test(gift.id)
  )
    return;
  const key = `alma-measured-gift-${gift.provider}-${gift.id}`;
  try {
    if (sessionStorage.getItem(key)) return;
  } catch {}
  if (
    trackEvent("donation_completed", {
      transaction_id: `${gift.provider}-${gift.id}`,
      payment_provider: gift.provider,
      donation_frequency: gift.frequency === "monthly" ? "monthly" : "once",
      project: gift.cause,
      value: gift.amount,
      currency: gift.currency as "COP" | "USD" | "EUR",
    })
  ) {
    try {
      sessionStorage.setItem(key, "1");
    } catch {}
  }
}
