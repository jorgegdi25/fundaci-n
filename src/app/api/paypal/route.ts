import { paypalConfig } from "@/lib/paypal-security";
import {
  PaymentError,
  requireSameOrigin,
  cookieHeader,
} from "@/lib/server/payments";
import {
  config,
  limited,
  create,
  confirm,
  status,
  cancel,
} from "@/lib/server/paypal";
export async function GET() {
  const c = paypalConfig(process.env),
    ready = Boolean(c && process.env.DATABASE_URL);
  return Response.json(
    {
      configured: ready,
      environment: ready ? "sandbox" : null,
      clientId: ready ? c?.clientId : undefined,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const text = await request.text();
    if (text.length > 16000) throw new PaymentError("invalid_request", 400);
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(text);
    } catch {
      throw new PaymentError("invalid_request", 400);
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new PaymentError("invalid_request", 400);
    const action = body.action ?? "create";
    if (!["create", "confirm", "status", "cancel"].includes(String(action)))
      throw new PaymentError("invalid_request", 400);
    config();
    await limited(request, String(action));
    let data: unknown, cookie: string | undefined;
    if (action === "create") {
      const gift = await create(body);
      data = gift;
      cookie = cookieHeader(gift.id, gift.access, request);
    } else if (action === "confirm") data = await confirm(request, body);
    else if (action === "status") data = await status(request, body);
    else data = await cancel(request, body);
    return Response.json(data, {
      headers: {
        "Cache-Control": "no-store",
        ...(cookie ? { "Set-Cookie": cookie } : {}),
      },
    });
  } catch (e) {
    if (!(e instanceof PaymentError)) console.error("paypal_donation_failed");
    return Response.json(
      { error: e instanceof PaymentError ? e.code : "paypal_unavailable" },
      {
        status: e instanceof PaymentError ? e.status : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
