import { paypalSetupAllowed } from "@/lib/paypal-setup-access";
import { setupPayPalLive } from "@/lib/paypal-provisioning";

export const runtime = "nodejs";
export const maxDuration = 180;

// Fixed catalog provisioning only; requires the private operator token AND the
// immutable, Vercel-authenticated Production deployment. Never runs in a build.
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!paypalSetupAllowed(request, process.env))
    return Response.json({ error: "not_found" }, { status: 404, headers });
  if ((await request.text()) !== '{"action":"plans"}')
    return Response.json(
      { error: "invalid_request" },
      { status: 400, headers },
    );
  try {
    const state = await setupPayPalLive({
      clientId: process.env.PAYPAL_LIVE_CLIENT_ID ?? "",
      secret: process.env.PAYPAL_LIVE_CLIENT_SECRET ?? "",
    });
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
