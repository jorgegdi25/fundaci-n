import "server-only";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import { after } from "next/server";
import {
  validNotice,
  donationEmailSettings,
  deliverDonationEmail,
  type DonationNotice,
} from "../donation-messages";

export async function queueDonationNotice(input: unknown) {
  const settings = donationEmailSettings(process.env),
    notice = validNotice(input);
  if (!settings || !notice || Date.parse(notice.occurredAt) < settings.start)
    return;
  if (!process.env.DATABASE_URL)
    throw new Error("communications_database_unavailable");
  const sql = neon(process.env.DATABASE_URL);
  const key = `${notice.provider}/${notice.reference}`;
  await sql`INSERT INTO donation_communications(event_key,payload) VALUES(${key},${JSON.stringify(notice)}::jsonb) ON CONFLICT(event_key) DO NOTHING`;
  after(async () => {
    try {
      await flushDonationNotices(key);
    } catch {
      console.error("donation_email_background_retry_required");
    }
  });
}

export async function flushDonationNotices(eventKey: string | null = null) {
  if (!donationEmailSettings(process.env))
    return { configured: false, processed: 0 };
  if (!process.env.DATABASE_URL)
    throw new Error("communications_database_unavailable");
  const sql = neon(process.env.DATABASE_URL),
    leaseId = randomUUID();
  // Keep uncertain retries within Resend's 24-hour idempotency retention window.
  // After that interval require manual reconciliation rather than resend blindly.
  await sql`UPDATE donation_communications SET needs_review=true WHERE first_attempt_at<now()-interval '23 hours' AND ((donor_sent_at IS NULL AND donor_skipped=false) OR foundation_sent_at IS NULL)`;
  const rows =
    await sql`UPDATE donation_communications SET lease_id=${leaseId},lease_until=now()+interval '5 minutes',first_attempt_at=COALESCE(first_attempt_at,now()),attempts=attempts+1
    WHERE event_key IN (SELECT event_key FROM donation_communications WHERE needs_review=false AND (${eventKey}::text IS NULL OR event_key=${eventKey}) AND next_attempt_at<=now() AND (lease_until IS NULL OR lease_until<now()) AND ((donor_sent_at IS NULL AND donor_skipped=false) OR foundation_sent_at IS NULL) ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 5)
    RETURNING event_key,payload,donor_sent_at,donor_skipped,foundation_sent_at`;
  let processed = 0;
  for (const row of rows) {
    const notice = validNotice(row.payload);
    if (!notice) {
      await sql`UPDATE donation_communications SET needs_review=true WHERE event_key=${row.event_key} AND lease_id=${leaseId}`;
      continue;
    }
    try {
      const state =
        notice.provider === "wompi"
          ? await sql`SELECT status FROM donation_attempts WHERE reference=${notice.reference}`
          : await sql`SELECT status FROM paypal_payments WHERE id=${notice.reference}`;
      if (
        state[0]?.status !==
        (notice.provider === "wompi" ? "APPROVED" : "COMPLETED")
      ) {
        await sql`UPDATE donation_communications SET needs_review=true WHERE event_key=${row.event_key} AND lease_id=${leaseId}`;
        continue;
      }
      for (const audience of ["donor", "foundation"] as const) {
        if (
          row[`${audience}_sent_at`] ||
          (audience === "donor" && row.donor_skipped)
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
      // Avoid retaining provider messages or donor details in logs.
      console.error("donation_email_retry_required");
    } finally {
      await sql`UPDATE donation_communications SET lease_until=NULL,lease_id=NULL,next_attempt_at=now()+interval '15 minutes' WHERE event_key=${row.event_key} AND lease_id=${leaseId}`;
    }
  }
  return { configured: true, processed };
}
