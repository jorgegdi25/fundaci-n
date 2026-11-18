import "server-only";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import {
  validNotice,
  donationEmailSettings,
  deliverDonationEmail,
  type DonationNotice,
} from "../donation-messages";
import { monthlyAuthorizationMinutes } from "../donations";
import { separatePayPalDatabase, type PayPalEnvironment } from "../paypal-live";

export function communicationsDatabase(environment: PayPalEnvironment) {
  const url =
    environment === "production"
      ? process.env.PAYPAL_LIVE_DATABASE_URL
      : process.env.DATABASE_URL;
  if (
    !url ||
    (environment === "production" &&
      (process.env.VERCEL_ENV !== "production" ||
        !separatePayPalDatabase(url, process.env.DATABASE_URL)))
  )
    throw new Error("communications_database_unavailable");
  return neon(url);
}

export async function donationNoticePending(
  key: string,
  environment: PayPalEnvironment,
) {
  const rows = await communicationsDatabase(
    environment,
  )`SELECT needs_review,donor_sent_at,donor_skipped,foundation_sent_at FROM donation_communications WHERE event_key=${key}`;
  const row = rows[0];
  return Boolean(
    row &&
    !row.needs_review &&
    ((!row.donor_sent_at && !row.donor_skipped) || !row.foundation_sent_at),
  );
}

export async function flushDonationNotices(
  eventKey: string | null = null,
  environment: PayPalEnvironment = "sandbox",
) {
  if (!donationEmailSettings(process.env, environment))
    return { configured: false, processed: 0, failed: 0 };
  const sql = communicationsDatabase(environment),
    leaseId = randomUUID();
  // Keep uncertain retries within Resend's 24-hour idempotency retention window.
  // After that interval require manual reconciliation rather than resend blindly.
  await sql`UPDATE donation_communications SET needs_review=true
    WHERE first_attempt_at<now()-interval '23 hours'
    AND ((donor_sent_at IS NULL AND donor_skipped=false)
      OR (foundation_sent_at IS NULL AND COALESCE(payload->>'status','APPROVED') IN ('APPROVED','ABANDONED')))`;
  const rows =
    await sql`UPDATE donation_communications SET lease_id=${leaseId},lease_until=now()+interval '5 minutes',first_attempt_at=COALESCE(first_attempt_at,now()),attempts=attempts+1
    WHERE event_key IN (SELECT event_key FROM donation_communications WHERE needs_review=false AND (${eventKey}::text IS NULL OR event_key=${eventKey}) AND next_attempt_at<=now() AND (lease_until IS NULL OR lease_until<now())
      AND ((donor_sent_at IS NULL AND donor_skipped=false)
        OR (foundation_sent_at IS NULL AND COALESCE(payload->>'status','APPROVED') IN ('APPROVED','ABANDONED')))
      ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 5)
    RETURNING event_key,payload,donor_sent_at,donor_skipped,foundation_sent_at`;
  let processed = 0;
  let failed = 0;
  for (const row of rows) {
    const notice = validNotice(row.payload);
    if (!notice || notice.environment !== environment) {
      await sql`UPDATE donation_communications SET needs_review=true WHERE event_key=${row.event_key} AND lease_id=${leaseId}`;
      continue;
    }
    try {
      const status = notice.status ?? "APPROVED";
      const state =
        notice.provider === "wompi"
          ? await sql`SELECT CASE WHEN a.status='CREATED' AND a.cycle=0 AND a.transaction_id IS NULL
                AND d.frequency='monthly' AND d.source_state='new' AND d.cancelled_at IS NULL
                AND d.created_at<=now()-(${monthlyAuthorizationMinutes}::int * interval '1 minute')
              THEN 'ABANDONED' ELSE a.status END AS status
              FROM donation_attempts a JOIN donation_intents d ON d.id=a.intent_id
              WHERE a.reference=${notice.reference} AND d.environment='sandbox'`
          : await sql`SELECT p.status FROM paypal_payments p JOIN paypal_gifts g ON g.id=p.gift_id WHERE p.id=${notice.reference} AND g.environment=${environment}`;
      if (
        state[0]?.status !==
        (notice.provider === "wompi" ? status : "COMPLETED")
      ) {
        await sql`UPDATE donation_communications SET needs_review=true WHERE event_key=${row.event_key} AND lease_id=${leaseId}`;
        continue;
      }
      for (const audience of ["donor", "foundation"] as const) {
        if (
          row[`${audience}_sent_at`] ||
          (audience === "donor" && row.donor_skipped) ||
          (audience === "foundation" &&
            status !== "APPROVED" &&
            status !== "ABANDONED")
        )
          continue;
        const result = await deliverDonationEmail(
          notice as DonationNotice,
          audience,
          process.env,
        );
        if (result.status === "disabled") continue;
        if (result.status === "skipped")
          await sql`UPDATE donation_communications SET donor_skipped=true WHERE event_key=${row.event_key} AND lease_id=${leaseId}`;
        else if (audience === "donor")
          await sql`UPDATE donation_communications SET donor_sent_at=now() WHERE event_key=${row.event_key} AND lease_id=${leaseId}`;
        else
          await sql`UPDATE donation_communications SET foundation_sent_at=now() WHERE event_key=${row.event_key} AND lease_id=${leaseId}`;
      }
      processed++;
    } catch {
      failed++;
      // Avoid retaining provider messages or donor details in logs.
      console.error("donation_email_retry_required");
    } finally {
      await sql`UPDATE donation_communications SET lease_until=NULL,lease_id=NULL,next_attempt_at=now()+interval '15 minutes' WHERE event_key=${row.event_key} AND lease_id=${leaseId}`;
    }
  }
  return { configured: true, processed, failed };
}
