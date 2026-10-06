import { sandboxConfig } from "@/lib/wompi-security";
import {
  config,
  requireSameOrigin,
  limited,
  createIntent,
  cookieHeader,
  finalizeMonthly,
  intentStatus,
  cancelIntent,
  PaymentError,
} from "@/lib/server/payments";

export async function GET() {
  const ready = Boolean(sandboxConfig(process.env) && process.env.DATABASE_URL);
  return Response.json(
    { environment: ready ? "sandbox" : null, configured: ready },
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
    if (!["create", "authorize", "status", "cancel"].includes(String(action)))
      throw new PaymentError("invalid_request", 400);
    config();
    await limited(request, String(action), action === "status" ? 120 : 15);
    let data: unknown, cookie: string | undefined;
    if (action === "create") {
      const intent = await createIntent(body, new URL(request.url).origin);
      cookie = cookieHeader(intent.id, intent.token, request);
      // The cookie keeps the browser's result lookup private. The access token is
      // also provided for the donor's own monthly cancellation link.
      data = intent;
    } else if (action === "authorize")
      data = await finalizeMonthly(request, body);
    else if (action === "status") data = await intentStatus(request, body);
    else if (action === "cancel") data = await cancelIntent(request, body);
    else throw new PaymentError("invalid_request", 400);
    return Response.json(data, {
      headers: {
        "Cache-Control": "no-store",
        ...(cookie ? { "Set-Cookie": cookie } : {}),
      },
    });
  } catch (e) {
    if (!(e instanceof PaymentError)) console.error("donation_request_failed");
    return Response.json(
      { error: e instanceof PaymentError ? e.code : "payments_unavailable" },
      {
        status: e instanceof PaymentError ? e.status : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
