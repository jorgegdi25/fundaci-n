import { events } from "@/lib/server/paypal";
import { PaymentError } from "@/lib/server/payments";
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
    await events(request, event);
    return Response.json({ received: true });
  } catch (e) {
    if (!(e instanceof PaymentError)) console.error("paypal_event_failed");
    return Response.json(
      { received: false },
      { status: e instanceof PaymentError ? e.status : 503 },
    );
  }
}
