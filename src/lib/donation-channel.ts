export type DonationChannel = "external" | "sandbox";

// Existing WordPress donation button, verified against Wompi's public link API.
export const legacyDonationUrl = "https://checkout.wompi.co/l/bfXo9h";
export const donationReviewHost = "fundacion-alma-arcoiris.vercel.app";

export function donationChannel(
  host: string | null,
  deploymentHosts: readonly string[] = [],
): DonationChannel {
  if (!host || host !== host.trim() || /[/\\@?#\s]/.test(host))
    return "external";
  let url: URL;
  try {
    url = new URL(`https://${host}`);
  } catch {
    return "external";
  }
  const hostname = url.hostname.toLowerCase();
  if (["localhost", "127.0.0.1", "[::1]"].includes(hostname)) return "sandbox";
  if (url.port) return "external";
  const allowed = [donationReviewHost, ...deploymentHosts].filter((value) =>
    /^[a-z0-9-]+\.vercel\.app$/.test(value),
  );
  return allowed.includes(hostname) ? "sandbox" : "external";
}
