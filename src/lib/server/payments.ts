import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import {
  sandboxConfig,
  sha256,
  secureEqual,
  integritySignature,
  nextMonthlyDate,
  colombiaDateParts,
  sameContract,
} from "../wompi-security";
import { validateDonation } from "../donations";
import { matchesOrigin } from "../request-security";

export class PaymentError extends Error {
  constructor(
    public code: string,
    public status = 503,
  ) {
    super(code);
  }
}
export function config() {
  const value = sandboxConfig(process.env);
  if (!value || !process.env.DATABASE_URL)
    throw new PaymentError("payments_unavailable");
  return value;
}
export function database() {
  if (!process.env.DATABASE_URL) throw new PaymentError("payments_unavailable");
  return neon(process.env.DATABASE_URL);
}
export async function provider(path: string, body?: Record<string, unknown>) {
  const c = config();
  const res = await fetch(`${c.apiUrl}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      ...(path !== "/merchants/info"
        ? { Authorization: `Bearer ${c.privateKey}` }
        : {}),
      "Content-Type": "application/json",
      ...(path === "/merchants/info"
        ? { "x-merchant-public-key": c.publicKey }
        : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    // Log diagnostics only; provider messages can contain private donor data.
    const failure = await res.json().catch(() => null);
    const type = failure?.error?.type;
    console.error("wompi_request_failed", {
      resource: path.split("/")[1],
      status: res.status,
      type:
        typeof type === "string" && /^[A-Z_]+$/.test(type) ? type : "unknown",
      fields: Object.keys(failure?.error?.messages ?? {}).filter((field) =>
        /^(amount_in_cents|currency|reference|signature|customer_email|payment_source_id|acceptance_token|accept_personal_auth|payment_method|recurrent)$/.test(
          field,
        ),
      ),
    });
    throw new PaymentError("provider_unavailable", 502);
  }
  const json = await res.json();
  if (!json.data || typeof json.data !== "object")
    throw new PaymentError("provider_unavailable", 502);
  return json.data as Record<string, any>;
}
export async function merchantContracts() {
  const data = await provider("/merchants/info");
  const policy = data.presigned_acceptance,
    personal = data.presigned_personal_data_auth;
  for (const item of [policy, personal]) {
    if (
      typeof item?.acceptance_token !== "string" ||
      typeof item?.permalink !== "string"
    )
      throw new PaymentError("provider_unavailable", 502);
    const url = new URL(item.permalink);
    if (
      url.protocol !== "https:" ||
      !/^(?:[a-z0-9-]+\.)*wompi\.(co|com)$/.test(url.hostname)
    )
      throw new PaymentError("provider_unavailable", 502);
  }
  return { policy, personal };
}
export function requireSameOrigin(request: Request) {
  if (
    !matchesOrigin(
      request.url,
      request.headers.get("host"),
      request.headers.get("origin"),
    )
  )
    throw new PaymentError("invalid_origin", 403);
}
export async function limited(request: Request, action: string, limit = 15) {
  const c = config(),
    sql = database();
  const ip =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0] ??
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    "local";
  const window = Math.floor(Date.now() / 600000);
  const key = sha256(`${c.eventsSecret}${ip}${action}${window}`);
  const rows = await sql`INSERT INTO donation_rate_limits(bucket, expires_at)
    VALUES (${key}, now() + interval '20 minutes') ON CONFLICT (bucket)
    DO UPDATE SET count=donation_rate_limits.count+1 RETURNING count`;
  if (rows[0].count > limit) throw new PaymentError("too_many_requests", 429);
}
export const cookieName = (id: string) => `alma_donation_${id}`;
export function cookieHeader(id: string, token: string, request: Request) {
  return `${cookieName(id)}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
}
export async function ownedIntent(
  request: Request,
  id: unknown,
  access?: unknown,
) {
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
  const token = typeof access === "string" ? access : cookie;
  if (!token || !/^[a-f0-9]{64}$/.test(token))
    throw new PaymentError("not_found", 404);
  const sql = database(),
    rows = await sql`SELECT * FROM donation_intents WHERE id=${id}`;
  if (!rows[0] || !secureEqual(rows[0].access_hash, sha256(token)))
    throw new PaymentError("not_found", 404);
  return rows[0];
}
export async function createIntent(
  body: Record<string, unknown>,
  origin: string,
) {
  const checked = validateDonation(body);
  if (!checked.ok) throw new PaymentError(checked.error, 400);
  if (body.lang !== "es" && body.lang !== "en")
    throw new PaymentError("invalid_language", 400);
  if (body.agreeFoundation !== true)
    throw new PaymentError("consent_required", 400);
  const c = config(),
    sql = database(),
    id = randomUUID(),
    token = randomBytes(32).toString("hex");
  const { amount, cause, frequency } = checked.donation;
  const contracts = frequency === "monthly" ? await merchantContracts() : null;
  const consent = {
    foundation: `/${body.lang}/${body.lang === "es" ? "condiciones" : "terms"}`,
    acceptedAt: new Date().toISOString(),
    version: "sandbox-2026-10-06",
    ...(contracts
      ? {
          policyToken: contracts.policy.acceptance_token,
          personalToken: contracts.personal.acceptance_token,
          policy: contracts.policy.permalink,
          personal: contracts.personal.permalink,
        }
      : {}),
  };
  await sql`INSERT INTO donation_intents(id,access_hash,amount,cause,frequency,lang,consent)
    VALUES (${id},${sha256(token)},${amount},${cause},${frequency},${body.lang},${JSON.stringify(
      consent,
    )}::jsonb)`;
  const reference = `ALMA-${id}-0`;
  await sql`INSERT INTO donation_attempts(reference,intent_id) VALUES (${reference},${id})`;
  const resultPath = `/${body.lang}/donation/result?donation=${id}`;
  if (frequency === "monthly")
    return {
      id,
      token,
      environment: "sandbox",
      publicKey: c.publicKey,
      contracts: {
        policy: contracts!.policy.permalink,
        personal: contracts!.personal.permalink,
      },
      acceptance: {
        policy: contracts!.policy.acceptance_token,
        personal: contracts!.personal.acceptance_token,
      },
      resultPath,
    };
  const expires = new Date(Date.now() + 30 * 60000).toISOString();
  const checkout = new URL("https://checkout.wompi.co/p/");
  checkout.search = new URLSearchParams({
    "public-key": c.publicKey,
    currency: "COP",
    "amount-in-cents": String(amount * 100),
    reference,
    "signature:integrity": integritySignature(
      reference,
      amount * 100,
      c.integritySecret,
      expires,
    ),
    "expiration-time": expires,
    "redirect-url": new URL(resultPath, origin).href,
  }).toString();
  return {
    id,
    token,
    environment: "sandbox",
    checkoutUrl: checkout.href,
    resultPath,
  };
}

export async function applyTransaction(
  transaction: Record<string, any>,
  timestamp = 0,
) {
  const {
    id,
    reference,
    status,
    amount_in_cents: cents,
    currency,
  } = transaction;
  if (
    typeof id !== "string" ||
    typeof reference !== "string" ||
    currency !== "COP" ||
    !Number.isSafeInteger(cents) ||
    !["PENDING", "APPROVED", "DECLINED", "ERROR", "VOIDED"].includes(status)
  )
    throw new PaymentError("invalid_transaction", 400);
  const sql = database();
  const rows =
    await sql`UPDATE donation_attempts a SET transaction_id=${id}, status=${status}, event_timestamp=GREATEST(event_timestamp,${timestamp})
    FROM donation_intents d WHERE a.intent_id=d.id AND a.reference=${reference} AND d.amount*100::bigint=${cents}
    AND (a.transaction_id IS NULL OR a.transaction_id=${id}) AND (${timestamp}=0 OR a.event_timestamp<=${timestamp})
    AND (a.status NOT IN ('APPROVED','VOIDED','DECLINED','ERROR') OR a.status=${status} OR (a.status='APPROVED' AND ${status}='VOIDED'))
    RETURNING a.intent_id,a.cycle,a.due_at`;
  if (!rows.length) return;
  const intentRows =
    await sql`SELECT * FROM donation_intents WHERE id=${rows[0].intent_id}`;
  const d = intentRows[0];
  if (d.frequency !== "monthly") return;
  if (status === "APPROVED") {
    const due = new Date(rows[0].due_at),
      anchor = d.anchor_day ?? colombiaDateParts(due).day;
    const next = nextMonthlyDate(due, anchor).toISOString();
    await sql`UPDATE donation_intents SET subscription_state='active',anchor_day=${anchor},next_charge_at=${next}
      WHERE id=${d.id} AND cancelled_at IS NULL AND subscription_state IN ('pending','active')
      AND (next_charge_at IS NULL OR next_charge_at<=${next}::timestamptz)`;
  } else if (["DECLINED", "ERROR", "VOIDED"].includes(status)) {
    await sql`UPDATE donation_intents SET subscription_state='paused' WHERE id=${d.id} AND cancelled_at IS NULL`;
  }
}
export async function reconcile(transactionId: string) {
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(transactionId))
    throw new PaymentError("invalid_transaction", 400);
  const transaction = await provider(
    `/transactions/${encodeURIComponent(transactionId)}`,
  );
  await applyTransaction(transaction);
  return transaction;
}
export async function charge(intent: Record<string, any>, reference: string) {
  const c = config(),
    sql = database();
  const claimed =
    await sql`UPDATE donation_attempts a SET status='PROCESSING' FROM donation_intents d
    WHERE a.reference=${reference} AND a.intent_id=d.id AND a.status='CREATED' AND d.cancelled_at IS NULL
    AND d.payment_source_id IS NOT NULL RETURNING a.reference`;
  if (!claimed.length) return;
  let phase = "contracts";
  try {
    const contracts = await merchantContracts();
    if (
      !sameContract(
        intent.consent.policyToken,
        contracts.policy.acceptance_token,
      ) ||
      !sameContract(
        intent.consent.personalToken,
        contracts.personal.acceptance_token,
      )
    ) {
      await sql`UPDATE donation_intents SET subscription_state='paused' WHERE id=${intent.id} AND cancelled_at IS NULL`;
      throw new PaymentError("consent_update_required", 409);
    }
    phase = "request";
    const transaction = await provider("/transactions", {
      amount_in_cents: intent.amount * 100,
      currency: "COP",
      reference,
      signature: integritySignature(
        reference,
        intent.amount * 100,
        c.integritySecret,
      ),
      customer_email: intent.email,
      payment_source_id: Number(intent.payment_source_id),
      acceptance_token: contracts.policy.acceptance_token,
      accept_personal_auth: contracts.personal.acceptance_token,
      ...(intent.payment_source_type === "CARD"
        ? { payment_method: { installments: 1 }, recurrent: true }
        : {}),
    });
    phase = "record";
    await applyTransaction(transaction);
  } catch (e) {
    console.error("wompi_charge_unconfirmed", {
      phase,
      reason:
        e instanceof PaymentError
          ? e.code
          : e instanceof Error
            ? e.name
            : "unknown",
      sqlCode:
        e &&
        typeof e === "object" &&
        "code" in e &&
        /^[A-Z0-9]{5}$/.test(String(e.code))
          ? String(e.code)
          : undefined,
    });
    // A timeout may hide an accepted charge. Never automatically repeat it.
    await sql`UPDATE donation_attempts SET status='REVIEW' WHERE reference=${reference} AND status='PROCESSING'`;
    throw new PaymentError("confirmation_pending", 502);
  }
}
export async function finalizeMonthly(
  request: Request,
  body: Record<string, unknown>,
) {
  const intent = await ownedIntent(request, body.id);
  if (
    intent.frequency !== "monthly" ||
    intent.cancelled_at ||
    new Date(intent.created_at).getTime() < Date.now() - 3600000
  )
    throw new PaymentError("expired_intent", 400);
  if (
    typeof body.email !== "string" ||
    body.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ||
    body.agreeMonthly !== true ||
    body.agreePolicy !== true ||
    body.agreePersonal !== true ||
    body.agreeFoundation !== true
  )
    throw new PaymentError("consent_required", 400);
  if (
    typeof body.paymentToken !== "string" ||
    !/^(tok_test_|nequi_test_)[a-zA-Z0-9_-]+$/.test(body.paymentToken) ||
    !["CARD", "NEQUI"].includes(String(body.paymentType)) ||
    (body.paymentType === "CARD") !== body.paymentToken.startsWith("tok_test_")
  )
    throw new PaymentError("invalid_payment_source", 400);
  // Use the versions displayed before authorization, not newly accepted contracts.
  if (
    typeof body.policyToken !== "string" ||
    typeof body.personalToken !== "string" ||
    body.policyToken !== intent.consent?.policyToken ||
    body.personalToken !== intent.consent?.personalToken
  )
    throw new PaymentError("consent_required", 400);
  const sql = database();
  const lock =
    await sql`UPDATE donation_intents SET source_state='creating',email=${body.email},consent=${JSON.stringify(
      {
        policyToken: body.policyToken,
        personalToken: body.personalToken,
        policy: intent.consent.policy,
        personal: intent.consent.personal,
        foundation: `/${intent.lang}/${intent.lang === "es" ? "condiciones" : "terms"}`,
        monthlyAmount: intent.amount,
        currency: "COP",
        acceptedAt: new Date().toISOString(),
        version: "sandbox-2026-10-06",
      },
    )}::jsonb WHERE id=${intent.id} AND source_state='new' AND cancelled_at IS NULL RETURNING id`;
  if (!lock.length) throw new PaymentError("already_processing", 409);
  try {
    const source = await provider("/payment_sources", {
      type: body.paymentType,
      token: body.paymentToken,
      customer_email: body.email,
      acceptance_token: body.policyToken,
      accept_personal_auth: body.personalToken,
    });
    if (
      source.status !== "AVAILABLE" ||
      !Number.isSafeInteger(source.id) ||
      source.id <= 0 ||
      source.customer_email !== body.email ||
      source.type !== body.paymentType
    )
      throw new PaymentError("invalid_payment_source", 400);
    await sql`UPDATE donation_intents SET payment_source_id=${source.id},payment_source_type=${source.type},source_state='ready' WHERE id=${intent.id}`;
    const updated = (
      await sql`SELECT * FROM donation_intents WHERE id=${intent.id}`
    )[0];
    await charge(updated, `ALMA-${intent.id}-0`);
  } catch (e) {
    await sql`UPDATE donation_intents SET source_state='review' WHERE id=${intent.id} AND source_state='creating'`;
    throw e;
  }
  return {
    resultPath: `/${intent.lang}/donation/result?donation=${intent.id}`,
  };
}
export async function intentStatus(
  request: Request,
  body: Record<string, unknown>,
) {
  const intent = await ownedIntent(request, body.id, body.access);
  const sql = database();
  const attempts =
    await sql`SELECT reference,status,transaction_id FROM donation_attempts WHERE intent_id=${intent.id} ORDER BY cycle DESC LIMIT 1`;
  const attempt = attempts[0];
  // The Wompi browser redirect supplies only an ID; verify it server-side.
  if (
    body.transactionId &&
    typeof body.transactionId === "string" &&
    !attempt.transaction_id
  ) {
    if (!/^[a-zA-Z0-9-]{1,100}$/.test(body.transactionId))
      throw new PaymentError("invalid_transaction", 400);
    const canonical = await provider(
      `/transactions/${encodeURIComponent(body.transactionId)}`,
    );
    if (
      canonical.reference !== attempt.reference ||
      canonical.amount_in_cents !== intent.amount * 100 ||
      canonical.currency !== "COP"
    )
      throw new PaymentError("invalid_transaction", 400);
    await applyTransaction(canonical);
  } else if (
    attempt.transaction_id &&
    ["PENDING", "PROCESSING", "REVIEW"].includes(attempt.status)
  ) {
    await reconcile(attempt.transaction_id);
  }
  const fresh = (
    await sql`SELECT d.*,a.status FROM donation_intents d JOIN donation_attempts a ON a.intent_id=d.id WHERE d.id=${intent.id} ORDER BY a.cycle DESC LIMIT 1`
  )[0];
  return {
    id: intent.id,
    amount: intent.amount,
    cause: intent.cause,
    frequency: intent.frequency,
    environment: "sandbox",
    status: fresh.status,
    subscriptionState: fresh.subscription_state,
    nextCharge: fresh.cancelled_at ? null : fresh.next_charge_at,
    cancelled: Boolean(fresh.cancelled_at),
  };
}
export async function cancelIntent(
  request: Request,
  body: Record<string, unknown>,
) {
  const intent = await ownedIntent(request, body.id, body.access);
  if (intent.frequency !== "monthly")
    throw new PaymentError("invalid_frequency", 400);
  const sql = database();
  await sql`UPDATE donation_intents SET cancelled_at=COALESCE(cancelled_at,now()),subscription_state='cancelled',next_charge_at=NULL WHERE id=${intent.id}`;
  const pending =
    await sql`SELECT reference FROM donation_attempts WHERE intent_id=${intent.id} AND status IN ('PROCESSING','PENDING','REVIEW')`;
  return { cancelled: true, inFlight: pending.length > 0 };
}
