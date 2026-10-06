import { authenticEvent } from "@/lib/wompi-security";
import {
  config,
  provider,
  applyTransaction,
  PaymentError,
} from "@/lib/server/payments";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    if (text.length > 50000)
      return new Response("Invalid event", { status: 400 });
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return new Response("Invalid event", { status: 400 });
    }
    const c = config();
    if (
      !authenticEvent(
        body,
        c.eventsSecret,
        request.headers.get("x-event-checksum"),
      )
    )
      return new Response("Invalid signature", { status: 401 });
    if (body.event !== "transaction.updated")
      return Response.json({ received: true });
    const id = body.data?.transaction?.id;
    if (typeof id !== "string" || !/^[a-zA-Z0-9-]{1,100}$/.test(id))
      return new Response("Invalid transaction", { status: 400 });
    // Some event fields are not included in the checksum. Read the canonical
    // transaction from Wompi before matching reference, amount and currency.
    const transaction = await provider(
      `/transactions/${encodeURIComponent(id)}`,
    );
    await applyTransaction(transaction, body.timestamp);
    return Response.json({ received: true });
  } catch (e) {
    console.error("wompi_event_processing_failed");
    return Response.json(
      { error: e instanceof PaymentError ? e.code : "retry_later" },
      { status: 503 },
    );
  }
}
