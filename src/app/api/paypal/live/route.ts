import {
  paypalLiveCheckoutAllowed,
  paypalLiveAccountHost,
} from "@/lib/paypal-live";
import { livePayPal } from "@/lib/server/paypal";
import {
  PaymentError,
  requireSameOrigin,
  cookieHeader,
} from "@/lib/server/payments";

const host = (request: Request) =>
  request.headers.get("host") ?? new URL(request.url).host;
const noStore = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  try {
    if (!paypalLiveCheckoutAllowed(host(request), process.env))
      return Response.json(
        { configured: false, environment: null },
        { headers: noStore },
      );
    await livePayPal.ready();
    return Response.json(
      {
        configured: true,
        environment: "production",
        clientId: livePayPal.config().clientId,
      },
      { headers: noStore },
    );
  } catch {
    return Response.json(
      { configured: false, environment: null },
      { headers: noStore },
    );
  }
}

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    if (!paypalLiveAccountHost(host(request), process.env))
      throw new PaymentError("paypal_live_unavailable", 403);
    const text = await request.text();
    if (text.length > 16000) throw new PaymentError("invalid_request", 400);
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      throw new PaymentError("invalid_request", 400);
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new PaymentError("invalid_request", 400);
    const action = body.action ?? "create";
    if (!["create", "confirm", "status", "cancel"].includes(action))
      throw new PaymentError("invalid_request", 400);
    if (
      action === "create" &&
      !paypalLiveCheckoutAllowed(host(request), process.env)
    )
      throw new PaymentError("paypal_live_unavailable", 403);
    await livePayPal.limited(request, action);
    let data: unknown, cookie: string | undefined;
    if (action === "create") {
      const gift = await livePayPal.create(body);
      data = gift;
      cookie = cookieHeader(gift.id, gift.access, request);
    } else if (action === "confirm")
      data = await livePayPal.confirm(request, body);
    else if (action === "status") data = await livePayPal.status(request, body);
    else data = await livePayPal.cancel(request, body);
    return Response.json(data, {
      headers: { ...noStore, ...(cookie ? { "Set-Cookie": cookie } : {}) },
    });
  } catch (error) {
    if (!(error instanceof PaymentError))
      console.error("paypal_live_request_failed");
    return Response.json(
      {
        error:
          error instanceof PaymentError
            ? error.code
            : "paypal_live_unavailable",
      },
      {
        status: error instanceof PaymentError ? error.status : 503,
        headers: noStore,
      },
    );
  }
}
