import "server-only";
import { donationChannel } from "../donation-channel";

export function routedDonationChannel(host: string | null) {
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
