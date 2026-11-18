import { paypalSetupAllowed } from "@/lib/paypal-setup-access";
import { setupPayPalLive } from "@/lib/paypal-provisioning";
import { migratePayPalLive } from "@/lib/paypal-migration";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const maxDuration = 180;

// Fixed provisioning only; requires the private operator token AND the
// immutable, Vercel-authenticated Production deployment. Never runs in a build.
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!paypalSetupAllowed(request, process.env))
    return Response.json({ error: "not_found" }, { status: 404, headers });
  const text = await request.text();
  if (
    ![
      '{"action":"plans"}',
      '{"action":"schema"}',
      '{"action":"webhook"}',
    ].includes(text)
  )
    return Response.json(
      { error: "invalid_request" },
      { status: 400, headers },
    );
  try {
    if (text === '{"action":"schema"}') {
      const schema = await readFile(
        join(process.cwd(), "scripts/paypal-live-schema.sql"),
        "utf8",
      );
      const result = await migratePayPalLive(
        process.env.PAYPAL_LIVE_DATABASE_URL_UNPOOLED ?? "",
        process.env.DATABASE_URL ?? "",
        schema,
      );
      return Response.json(result, { headers });
    }
    if (text === '{"action":"webhook"}') {
      const receiver = await fetch(
        "https://fundacionalmaarcoiris.org/api/paypal/live/events",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
        },
      );
      if (receiver.status !== 401 || (await receiver.json()).received !== false)
        throw new Error("live_receiver_not_published");
    }
    const state = await setupPayPalLive(
      {
        clientId: process.env.PAYPAL_LIVE_CLIENT_ID ?? "",
        secret: process.env.PAYPAL_LIVE_CLIENT_SECRET ?? "",
      },
      undefined,
      text === '{"action":"webhook"}',
    );
    return Response.json({ ...state, charged: false }, { headers });
  } catch (error) {
    // Only controlled errors: never return credentials or provider payloads.
    const code =
      error instanceof Error && /^[a-zA-Z0-9_]+$/.test(error.message)
        ? error.message
        : "paypal_setup_failed";
    return Response.json({ error: code }, { status: 502, headers });
  }
}
