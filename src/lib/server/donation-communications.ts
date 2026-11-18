import "server-only";
import { after } from "next/server";
import {
  validNotice,
  donationEmailSettings,
  donationNoticeKey,
} from "../donation-messages";
import { start } from "workflow/api";
import { HookConflictError } from "workflow/errors";
import { deliverVerifiedDonationNotice } from "../workflows/donation-notice";
import {
  communicationsDatabase,
  flushDonationNotices,
  donationNoticePending,
} from "./donation-notice-delivery";
import type { PayPalEnvironment } from "../paypal-live";
export { flushDonationNotices } from "./donation-notice-delivery";

import { monthlyAuthorizationMinutes } from "../donations";

export async function queueDonationNotice(
  input: unknown,
  environment: PayPalEnvironment = "sandbox",
) {
  const key = await enqueueDonationNotice(input, environment);
  if (!key) return;
  if (environment === "production") {
    if (!(await donationNoticePending(key, environment))) return;
    try {
      await start(deliverVerifiedDonationNotice, [key, environment], {
        experimental_hook: {
          token: `donation-notice:${key}`,
          experimental_minRetention: "23h",
        },
      });
    } catch (error) {
      if (!HookConflictError.is(error)) throw error;
    }
    return;
  }
  after(async () => {
    try {
      await flushDonationNotices(key);
    } catch {
      console.error("donation_email_background_retry_required");
    }
  });
}

async function enqueueDonationNotice(
  input: unknown,
  environment: PayPalEnvironment = "sandbox",
) {
  const settings = donationEmailSettings(process.env, environment),
    notice = validNotice(input);
  if (
    !settings ||
    !notice ||
    notice.environment !== environment ||
    Date.parse(notice.occurredAt) < settings.start
  )
    return;
  const sql = communicationsDatabase(environment);
  const key = donationNoticeKey(notice);
  await sql`INSERT INTO donation_communications(event_key,payload,donor_skipped)
    VALUES(${key},${JSON.stringify(notice)}::jsonb,${notice.status === "ABANDONED"})
    ON CONFLICT(event_key) DO NOTHING`;
  return key;
}

export async function queueAbandonedMonthlyNotices(
  reference: string | null = null,
) {
  const settings = donationEmailSettings(process.env);
  if (!settings || !process.env.DATABASE_URL) return;
  const sql = communicationsDatabase("sandbox");
  const attempts =
    await sql`SELECT a.reference,d.amount,d.cause,d.lang,d.email,d.environment,d.created_at
    FROM donation_attempts a JOIN donation_intents d ON d.id=a.intent_id
    WHERE d.environment='sandbox' AND d.frequency='monthly' AND d.source_state='new'
    AND d.cancelled_at IS NULL AND d.email IS NOT NULL AND d.consent ? 'emailCapturedAt'
    AND d.created_at >= ${new Date(settings.start).toISOString()}::timestamptz
    AND d.created_at <= now()-(${monthlyAuthorizationMinutes}::int * interval '1 minute')
    AND a.cycle=0 AND a.status='CREATED' AND a.transaction_id IS NULL
    AND (${reference}::text IS NULL OR a.reference=${reference})
    AND NOT EXISTS (SELECT 1 FROM donation_communications n WHERE n.event_key='wompi/' || a.reference || '/abandoned')
    ORDER BY d.created_at LIMIT 15`;
  for (const attempt of attempts)
    await enqueueDonationNotice({
      provider: "wompi",
      reference: attempt.reference,
      amountMinor: attempt.amount * 100,
      currency: "COP",
      frequency: "monthly",
      cause: attempt.cause,
      lang: attempt.lang,
      environment: attempt.environment,
      email: attempt.email,
      occurredAt: new Date(attempt.created_at).toISOString(),
      status: "ABANDONED",
    });
}
