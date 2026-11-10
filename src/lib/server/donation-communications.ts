import "server-only";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import { after } from "next/server";
import {
  validNotice,
  donationEmailSettings,
  deliverDonationEmail,
  donationNoticeKey,
  type DonationNotice,
} from "../donation-messages";
import { monthlyAuthorizationMinutes } from "../donations";

export async function queueDonationNotice(input: unknown) {
  const key = await enqueueDonationNotice(input);
  if (!key) return;
  after(async () => {
    try {
      await flushDonationNotices(key);
    } catch {
      console.error("donation_email_background_retry_required");
    }
  });
}

async function enqueueDonationNotice(input: unknown) {
  const settings = donationEmailSettings(process.env),
    notice = validNotice(input);
  if (!settings || !notice || Date.parse(notice.occurredAt) < settings.start)
    return;
  if (!process.env.DATABASE_URL)
    throw new Error("communications_database_unavailable");
  const sql = neon(process.env.DATABASE_URL);
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
  const sql = neon(process.env.DATABASE_URL);
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

export async function flushDonationNotices(eventKey: string | null = null) {
  if (!donationEmailSettings(process.env))
    return { configured: false, processed: 0, failed: 0 };
  if (!process.env.DATABASE_URL)
    throw new Error("communications_database_unavailable");
  const sql = neon(process.env.DATABASE_URL),
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
    if (!notice) {
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
          : await sql`SELECT status FROM paypal_payments WHERE id=${notice.reference}`;
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
