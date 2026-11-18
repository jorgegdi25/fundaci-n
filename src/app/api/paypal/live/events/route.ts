import { livePayPal } from "@/lib/server/paypal";
import { PaymentError } from "@/lib/server/payments";

// Dedicated listener: Sandbox messages can never update Live records.
// The receiver stays available when creation of new checkouts is disabled.
export async function POST(request: Request) {
  try {
    const text = await request.text();
    if (text.length > 100000) throw new PaymentError("invalid_event", 400);
    let event;
    try {
      event = JSON.parse(text);
    } catch {
      throw new PaymentError("invalid_event", 400);
    }
    await livePayPal.events(request, event);
    return Response.json({ received: true });
  } catch (error) {
    if (!(error instanceof PaymentError))
      console.error("paypal_live_event_failed");
    return Response.json(
      { received: false },
      { status: error instanceof PaymentError ? error.status : 503 },
    );
  }
}
