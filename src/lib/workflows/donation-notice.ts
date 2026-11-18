import { sleep } from "workflow";
import {
  flushDonationNotices,
  donationNoticePending,
} from "../server/donation-notice-delivery";
import type { PayPalEnvironment } from "../paypal-live";

// Only an internal receipt key crosses the workflow boundary. Donor contact
// details and provider credentials are read inside the delivery step.
export async function deliverVerifiedDonationNotice(
  key: string,
  environment: PayPalEnvironment,
) {
  "use workflow";
  for (let attempt = 0; attempt < 8; attempt++) {
    if (!(await deliverNotice(key, environment))) return;
    if (attempt < 7) await sleep("16m");
  }
}

async function deliverNotice(key: string, environment: PayPalEnvironment) {
  "use step";
  await flushDonationNotices(key, environment);
  const pending = await donationNoticePending(key, environment);
  if (pending) console.warn("donation_notice_retry_pending");
  return pending;
}
