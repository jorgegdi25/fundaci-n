export type Frequency = "monthly" | "once";
export const donationAmounts = {
  monthly: [9900, 29900],
  once: [49900, 99900],
} as const;
// Suggested gifts supplied in the October 24, 2026 Home and Donate revisions.
// These are independent donation amounts, not a live conversion from COP.
export const usdDonationAmounts = {
  monthly: [3.33, 9.99],
  once: [15.9, 31.9],
} as const;
export const supportPercentages = [0, 5, 10, 15] as const;
export function donationTotal(
  amount: number,
  percentage: number,
  currency: string,
) {
  if (
    !Number.isFinite(amount) ||
    amount < 0 ||
    !["COP", "USD", "EUR"].includes(currency) ||
    !supportPercentages.includes(percentage as 0 | 5 | 10 | 15)
  )
    return null;
  const scale = currency === "COP" ? 1 : 100;
  if (Math.abs(amount * scale - Math.round(amount * scale)) > 1e-7) return null;
  const base = Math.round(amount * scale);
  if (!Number.isSafeInteger(base)) return null;
  const support = Math.round((base * percentage) / 100);
  return {
    base: base / scale,
    support: support / scale,
    total: (base + support) / scale,
  };
}
export const causes = [
  "general",
  "el-cairo",
  "sierra-nevada",
  "amazonas",
  "mhuysqa",
] as const;
export function validateDonation(value: unknown) {
  if (!value || typeof value !== "object")
    return { ok: false as const, error: "invalid_request" };
  const v = value as Record<string, unknown>;
  if (v.frequency !== "monthly" && v.frequency !== "once")
    return { ok: false as const, error: "invalid_frequency" };
  if (
    typeof v.amount !== "number" ||
    !Number.isSafeInteger(v.amount) ||
    v.amount < 1500 ||
    v.amount > 100000000
  )
    return { ok: false as const, error: "invalid_amount" };
  if (
    typeof v.cause !== "string" ||
    !causes.includes(v.cause as (typeof causes)[number])
  )
    return { ok: false as const, error: "invalid_cause" };
  return {
    ok: true as const,
    donation: {
      amount: v.amount,
      frequency: v.frequency as Frequency,
      cause: v.cause,
      currency: "COP" as const,
    },
  };
}
