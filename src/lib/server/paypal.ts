import "server-only";
import { randomBytes, randomUUID, createHmac } from "node:crypto";
import { database, PaymentError, cookieName } from "./payments";
import { sha256, secureEqual } from "../wompi-security";
import {
  paypalConfig,
  validatePayPalGift,
  decimalAmount,
  decimalCents,
  samePayPalOrder,
  samePayPalSubscription,
  safePayPalId,
  webhookHeaders,
  eventPaymentId,
  type PayPalContract,
} from "../paypal-security";
type Gift = PayPalContract & {
  frequency: string;
  cause: string;
  lang: string;
  status: string;
  subscription_state: string;
  next_charge_at: string | null;
  cancelled_at: string | null;
  created_at: string;
};
export function config() {
  const c = paypalConfig(process.env);
  if (!c || !process.env.DATABASE_URL)
    throw new PaymentError("paypal_unavailable");
  return c;
}
let tokenCache: { value: string; until: number; clientId: string } | undefined;
async function token() {
  const c = config();
  if (
    tokenCache &&
    tokenCache.clientId === c.clientId &&
    tokenCache.until > Date.now()
  )
    return tokenCache.value;
  const response = await fetch(`${c.apiUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${c.clientId}:${c.secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || typeof data?.access_token !== "string")
    throw new PaymentError("paypal_unavailable", 502);
  tokenCache = {
    value: data.access_token,
    until: Date.now() + Math.max(0, Number(data.expires_in) - 120) * 1000,
    clientId: c.clientId,
  };
  return tokenCache.value;
}
async function api(
  path: string,
  body?: Record<string, unknown>,
  requestId?: string,
) {
  let response: Response;
  try {
    response = await fetch(`${config().apiUrl}${path}`, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${await token()}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...(requestId ? { "PayPal-Request-Id": requestId } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new PaymentError("confirmation_pending", 502);
  }
  if (response.status === 204) return {};
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    console.error("paypal_request_failed", {
      status: response.status,
      resource: path.split("/")[2],
    });
    throw new PaymentError("confirmation_pending", 502);
  }
  return data;
}
export async function limited(request: Request, action: string) {
  const ip =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0] ??
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    "local";
  const bucket = createHmac("sha256", config().secret)
    .update(`paypal:${ip}:${action}:${Math.floor(Date.now() / 600000)}`)
    .digest("hex");
  const rows =
    await database()`INSERT INTO donation_rate_limits(bucket,expires_at) VALUES (${bucket},now()+interval '20 minutes') ON CONFLICT(bucket) DO UPDATE SET count=donation_rate_limits.count+1 RETURNING count`;
  if (rows[0].count > (action === "status" ? 120 : 15))
    throw new PaymentError("too_many_requests", 429);
}
async function owned(request: Request, body: Record<string, unknown>) {
  const id = body.id;
  if (
    typeof id !== "string" ||
    !/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/.test(id)
  )
    throw new PaymentError("not_found", 404);
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(`${cookieName(id)}=`))
    ?.split("=")[1];
  const access = typeof body.access === "string" ? body.access : cookie;
  if (!access || !/^[a-f0-9]{64}$/.test(access))
    throw new PaymentError("not_found", 404);
  const rows = await database()`SELECT * FROM paypal_gifts WHERE id=${id}`;
  if (!rows[0] || !secureEqual(rows[0].access_hash, sha256(access)))
    throw new PaymentError("not_found", 404);
  return rows[0] as Gift;
}
export async function create(body: Record<string, unknown>) {
  const gift = validatePayPalGift(body);
  if (!gift) throw new PaymentError("invalid_request", 400);
  const c = config(),
    sql = database(),
    id = randomUUID(),
    access = randomBytes(32).toString("hex");
  const consent = {
    foundation: true,
    monthly: gift.frequency === "monthly",
    acceptedAt: new Date().toISOString(),
    version: "paypal-sandbox-2026-10-06",
  };
  await sql`INSERT INTO paypal_gifts(id,access_hash,amount,currency,frequency,cause,lang,consent) VALUES(${id},${sha256(access)},${gift.amount},${gift.currency},${gift.frequency},${gift.cause},${gift.lang},${JSON.stringify(consent)}::jsonb)`;
  let orderId: string | undefined, subscriptionId: string | undefined;
  if (gift.frequency === "once") {
    const order = await api(
      "/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: id,
            payee: { merchant_id: c.merchantId },
            amount: {
              currency_code: gift.currency,
              value: decimalAmount(gift.amount),
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              shipping_preference: "NO_SHIPPING",
              user_action: "PAY_NOW",
            },
          },
        },
      },
      `${id}-create`,
    );
    if (
      !safePayPalId(order.id) ||
      !samePayPalOrder(order, { id, ...gift, order_id: order.id }, c.merchantId)
    )
      throw new PaymentError("invalid_provider_contract", 502);
    orderId = order.id;
    await sql`UPDATE paypal_gifts SET order_id=${orderId},status=${order.status} WHERE id=${id}`;
  } else {
    const planId = c.plans[gift.currency];
    const sub = await api(
      "/v1/billing/subscriptions",
      {
        plan_id: planId,
        custom_id: id,
        plan: {
          billing_cycles: [
            {
              sequence: 1,
              pricing_scheme: {
                fixed_price: {
                  currency_code: gift.currency,
                  value: decimalAmount(gift.amount),
                },
              },
            },
          ],
        },
      },
      `${id}-create`,
    );
    if (!safePayPalId(sub.id, true))
      throw new PaymentError("invalid_provider_contract", 502);
    subscriptionId = sub.id;
    await sql`UPDATE paypal_gifts SET subscription_id=${subscriptionId},plan_id=${planId},subscription_state=${sub.status} WHERE id=${id}`;
  }
  return {
    id,
    access,
    orderId,
    subscriptionId,
    resultPath: `/${gift.lang}/paypal/result?donation=${id}`,
  };
}
function date(value: unknown) {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value)))
    throw new PaymentError("invalid_provider_contract", 502);
  return value;
}
async function storePayment(gift: Gift, p: any, money: any) {
  if (
    !safePayPalId(p?.id) ||
    money?.currency_code !== gift.currency ||
    decimalCents(money.value) !== gift.amount
  )
    throw new PaymentError("invalid_provider_contract", 502);
  const paid = date(p.create_time ?? p.time),
    updated = date(p.update_time ?? p.time ?? p.create_time);
  if (
    ![
      "COMPLETED",
      "PENDING",
      "DECLINED",
      "DENIED",
      "FAILED",
      "REFUNDED",
      "PARTIALLY_REFUNDED",
      "REVERSED",
    ].includes(p.status)
  )
    throw new PaymentError("invalid_provider_contract", 502);
  await database()`INSERT INTO paypal_payments(id,gift_id,amount,currency,status,paid_at,updated_at) VALUES(${p.id},${gift.id},${gift.amount},${gift.currency},${p.status},${paid},${updated}) ON CONFLICT(id) DO UPDATE SET status=EXCLUDED.status,updated_at=EXCLUDED.updated_at WHERE paypal_payments.gift_id=EXCLUDED.gift_id AND paypal_payments.updated_at<=EXCLUDED.updated_at`;
}
async function syncOrder(gift: Gift) {
  const order = await api(`/v2/checkout/orders/${gift.order_id}`);
  if (!samePayPalOrder(order, gift, config().merchantId))
    throw new PaymentError("invalid_provider_contract", 502);
  for (const capture of order.purchase_units[0].payments?.captures ?? []) {
    if (!safePayPalId(capture.id))
      throw new PaymentError("invalid_provider_contract", 502);
    const canonical = await api(`/v2/payments/captures/${capture.id}`);
    if (
      canonical.id !== capture.id ||
      canonical.supplementary_data?.related_ids?.order_id !== gift.order_id
    )
      throw new PaymentError("invalid_provider_contract", 502);
    await storePayment(gift, canonical, canonical.amount);
  }
  const updated = date(order.update_time ?? order.create_time);
  await database()`UPDATE paypal_gifts SET status=${order.status},provider_updated_at=${updated} WHERE id=${gift.id} AND (provider_updated_at IS NULL OR provider_updated_at<=${updated}::timestamptz)`;
  return order;
}
async function syncSubscription(gift: Gift) {
  const sub = await api(
    `/v1/billing/subscriptions/${gift.subscription_id}?fields=plan`,
  );
  if (!samePayPalSubscription(sub, gift))
    throw new PaymentError("invalid_provider_contract", 502);
  const updated = date(
    sub.status_update_time ?? sub.update_time ?? sub.create_time,
  );
  const cancelled = sub.status === "CANCELLED",
    next =
      typeof sub.billing_info?.next_billing_time === "string"
        ? date(sub.billing_info.next_billing_time)
        : null;
  await database()`UPDATE paypal_gifts SET subscription_state=${sub.status},next_charge_at=${next},provider_updated_at=${updated},cancelled_at=CASE WHEN ${cancelled} THEN COALESCE(cancelled_at,now()) ELSE cancelled_at END WHERE id=${gift.id} AND (provider_updated_at IS NULL OR provider_updated_at<=${updated}::timestamptz) AND (cancelled_at IS NULL OR ${cancelled})`;
  const start = new Date(
      Math.max(Date.parse(gift.created_at) - 1000, Date.now() - 30 * 86400000),
    ).toISOString(),
    end = new Date().toISOString();
  if (sub.status !== "APPROVAL_PENDING") {
    const transactions = await api(
      `/v1/billing/subscriptions/${gift.subscription_id}/transactions?${new URLSearchParams({ start_time: start, end_time: end })}`,
    );
    for (const payment of transactions.transactions ?? [])
      await storePayment(
        gift,
        payment,
        payment.amount_with_breakdown?.gross_amount,
      );
  }
  return sub;
}
async function publicStatus(id: string) {
  const sql = database(),
    rows = await sql`SELECT * FROM paypal_gifts WHERE id=${id}`,
    payments =
      await sql`SELECT status,paid_at FROM paypal_payments WHERE gift_id=${id} ORDER BY paid_at DESC LIMIT 1`,
    g = rows[0];
  return {
    id: g.id,
    amount: g.amount,
    currency: g.currency,
    cause: g.cause,
    frequency: g.frequency,
    status: payments[0]?.status ?? "PENDING",
    subscriptionState: g.subscription_state,
    nextCharge: g.next_charge_at,
    cancelled: Boolean(g.cancelled_at),
    environment: "sandbox",
  };
}
export async function status(request: Request, body: Record<string, unknown>) {
  const gift = await owned(request, body);
  if (gift.order_id) await syncOrder(gift);
  if (gift.subscription_id) await syncSubscription(gift);
  return publicStatus(gift.id);
}
export async function confirm(request: Request, body: Record<string, unknown>) {
  const gift = await owned(request, body);
  if (gift.frequency === "monthly") {
    if (body.subscriptionId !== gift.subscription_id)
      throw new PaymentError("invalid_request", 400);
    await syncSubscription(gift);
  } else {
    if (body.orderId !== gift.order_id)
      throw new PaymentError("invalid_request", 400);
    const order = await syncOrder(gift);
    if (order.status === "APPROVED") {
      try {
        await api(
          `/v2/checkout/orders/${gift.order_id}/capture`,
          {},
          `${gift.id}-capture`,
        );
      } catch {
        /* A timeout does not prove failure; look up the canonical order. */
      }
      await syncOrder(gift);
    } else if (order.status !== "COMPLETED")
      throw new PaymentError("confirmation_pending", 409);
  }
  return publicStatus(gift.id);
}
export async function cancel(request: Request, body: Record<string, unknown>) {
  const gift = await owned(request, body);
  if (gift.frequency !== "monthly" || !gift.subscription_id)
    throw new PaymentError("invalid_request", 400);
  let sub = await syncSubscription(gift);
  if (["ACTIVE", "SUSPENDED"].includes(sub.status)) {
    await api(`/v1/billing/subscriptions/${gift.subscription_id}/cancel`, {
      reason: "Donor cancelled the monthly gift.",
    });
    sub = await syncSubscription(gift);
  }
  if (sub.status !== "CANCELLED")
    throw new PaymentError("confirmation_pending", 409);
  return publicStatus(gift.id);
}
export async function events(request: Request, event: any) {
  const headers = webhookHeaders(request.headers);
  if (
    !headers ||
    typeof event?.id !== "string" ||
    typeof event.event_type !== "string"
  )
    throw new PaymentError("invalid_event", 401);
  const verified = await api("/v1/notifications/verify-webhook-signature", {
    ...headers,
    webhook_id: config().webhookId,
    webhook_event: event,
  });
  if (verified.verification_status !== "SUCCESS")
    throw new PaymentError("invalid_event", 401);
  const sql = database();
  if ((await sql`SELECT id FROM paypal_events WHERE id=${event.id}`).length)
    return;
  const resource = event.resource;
  let gifts: Record<string, any>[] = [];
  if (
    event.event_type.startsWith("BILLING.SUBSCRIPTION.") &&
    safePayPalId(resource?.id, true)
  )
    gifts =
      await sql`SELECT * FROM paypal_gifts WHERE subscription_id=${resource.id}`;
  else if (
    event.event_type.startsWith("PAYMENT.SALE.") &&
    safePayPalId(resource?.billing_agreement_id, true)
  )
    gifts =
      await sql`SELECT * FROM paypal_gifts WHERE subscription_id=${resource.billing_agreement_id}`;
  else if (
    event.event_type.startsWith("PAYMENT.CAPTURE.") &&
    safePayPalId(resource?.supplementary_data?.related_ids?.order_id)
  )
    gifts =
      await sql`SELECT * FROM paypal_gifts WHERE order_id=${resource.supplementary_data.related_ids.order_id}`;
  const paymentId = eventPaymentId(resource);
  if (!gifts.length && paymentId && event.event_type.startsWith("PAYMENT."))
    gifts =
      await sql`SELECT g.* FROM paypal_gifts g JOIN paypal_payments p ON p.gift_id=g.id WHERE p.id=${paymentId}`;
  for (const gift of gifts) {
    if (gift.order_id) await syncOrder(gift as Gift);
    if (gift.subscription_id) await syncSubscription(gift as Gift);
  }
  if (
    paymentId &&
    ["PAYMENT.SALE.REFUNDED", "PAYMENT.SALE.REVERSED"].includes(
      event.event_type,
    )
  ) {
    // Subscription transaction history can still report COMPLETED after a refund.
    // A signed negative event stops counting it as paid until merchant reconciliation.
    await sql`UPDATE paypal_payments p SET status='REVIEW',updated_at=GREATEST(p.updated_at,now()) FROM paypal_gifts g WHERE p.id=${paymentId} AND p.gift_id=g.id AND g.frequency='monthly'`;
  }
  // No raw payload, donor name, email or credentials are retained in the event log.
  await sql`INSERT INTO paypal_events(id,event_type) VALUES(${event.id},${event.event_type}) ON CONFLICT(id) DO NOTHING`;
}
