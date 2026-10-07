// The consent wording and target sheet were supplied in AJUSTES A HOME, p. 7.
export const communityConsentVersion = "home-2026-10-06";
export function validateCommunitySignup(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (v.consent !== true || !["es", "en"].includes(String(v.lang))) return null;
  if (typeof v.contact !== "string" || v.contact.length > 254) return null;
  const contact = v.contact.trim();
  const email = /^[^\s@=]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const phone =
    /^\+?[\d\s().-]+$/.test(contact) &&
    contact.replace(/\D/g, "").length >= 7 &&
    contact.replace(/\D/g, "").length <= 15;
  if (!email && !phone) return null;
  if (
    v.name !== undefined &&
    (typeof v.name !== "string" || v.name.length > 100)
  )
    return null;
  if (!["footer", "donate"].includes(String(v.source))) return null;
  return {
    name: (v.name as string | undefined)?.trim() ?? "",
    contact: email ? contact.toLowerCase() : contact.replace(/[\s().-]/g, ""),
    channel: email ? "email" : "whatsapp",
    lang: v.lang as "es" | "en",
    source: v.source as "footer" | "donate",
    consent: true,
    consentVersion: communityConsentVersion,
  };
}
