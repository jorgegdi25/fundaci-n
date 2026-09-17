export type Frequency = "monthly" | "once";
export const donationAmounts = {
  monthly: [250000, 150000, 50000],
  once: [750000, 500000, 250000],
} as const;
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
    v.amount < 1000 ||
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
