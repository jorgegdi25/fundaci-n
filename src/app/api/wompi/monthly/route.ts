import { secureEqual } from "@/lib/wompi-security";
import { config, database, charge, reconcile } from "@/lib/server/payments";

export const maxDuration = 300;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (
    !secret ||
    !secureEqual(request.headers.get("authorization") ?? "", `Bearer ${secret}`)
  )
    return new Response("Unauthorized", { status: 401 });
  try {
    config();
    const sql = database();
    await sql`DELETE FROM donation_rate_limits WHERE expires_at<now()`;
    // Recover missed notifications before considering another monthly cycle.
    const pending =
      await sql`SELECT transaction_id FROM donation_attempts WHERE status='PENDING' AND transaction_id IS NOT NULL LIMIT 20`;
    for (const row of pending) {
      try {
        await reconcile(row.transaction_id);
      } catch {
        console.error("wompi_pending_reconciliation_failed");
      }
    }
    const due =
      await sql`SELECT d.*,a.cycle,a.status AS last_status FROM donation_intents d
      JOIN LATERAL (SELECT cycle,status FROM donation_attempts WHERE intent_id=d.id ORDER BY cycle DESC LIMIT 1) a ON true
      WHERE d.subscription_state='active' AND d.cancelled_at IS NULL AND d.next_charge_at<=now() AND a.status='APPROVED'
      ORDER BY d.next_charge_at LIMIT 15`;
    let processed = 0;
    for (const intent of due) {
      const cycle = intent.cycle + 1,
        reference = `ALMA-${intent.id}-${cycle}`;
      const inserted =
        await sql`INSERT INTO donation_attempts(reference,intent_id,cycle,due_at)
        SELECT ${reference},id,${cycle},next_charge_at FROM donation_intents
        WHERE id=${intent.id} AND cancelled_at IS NULL AND subscription_state='active'
        ON CONFLICT (intent_id,cycle) DO NOTHING RETURNING reference`;
      if (!inserted.length) continue;
      try {
        await charge(intent, reference);
        processed++;
      } catch {
        console.error("wompi_monthly_confirmation_required");
      }
    }
    return Response.json(
      { processed, environment: "sandbox" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    console.error("wompi_monthly_job_failed");
    return new Response("Retry later", { status: 503 });
  }
}
