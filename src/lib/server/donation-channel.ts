import "server-only";
import { donationChannel } from "../donation-channel";
import { paypalLiveCheckoutAllowed, paypalLiveConfig } from "../paypal-live";

export function routedDonationChannel(host: string | null) {
  if (
    paypalLiveCheckoutAllowed(host, process.env) &&
    paypalLiveConfig(process.env)
  )
    return "paypal-live" as const;
  return donationChannel(host, [
    process.env.VERCEL_URL ?? "",
    process.env.VERCEL_BRANCH_URL ?? "",
  ]);
}

export function requestDonationChannel(request: Request) {
  return routedDonationChannel(
    request.headers.get("host") ?? new URL(request.url).host,
  );
}
