// Explicit operator command. Never runs during build, deployment or checkout.
// Credentials are read from a private temporary file and removed in finally.
import { readFile, writeFile, unlink, stat } from "node:fs/promises";

const credentialFile = process.argv[2];
const resultFile = process.argv[3];
const provisionWebhook = process.argv.includes("--webhook");
if (
  !credentialFile?.startsWith("/private/tmp/alma-paypal-live-") ||
  !resultFile
)
  throw new Error("private_credential_file_and_result_file_required");
const base = "https://api-m.paypal.com";
const webhookUrl = "https://fundacionalmaarcoiris.org/api/paypal/live/events";
const productName = "Fundación Alma Arcoíris — aporte mensual";
const eventTypes = [
  "CHECKOUT.ORDER.APPROVED",
  "CHECKOUT.ORDER.COMPLETED",
  "PAYMENT.CAPTURE.COMPLETED",
  "PAYMENT.CAPTURE.PENDING",
  "PAYMENT.CAPTURE.DENIED",
  "PAYMENT.CAPTURE.REFUNDED",
  "PAYMENT.CAPTURE.REVERSED",
  "BILLING.SUBSCRIPTION.ACTIVATED",
  "BILLING.SUBSCRIPTION.UPDATED",
  "BILLING.SUBSCRIPTION.CANCELLED",
  "BILLING.SUBSCRIPTION.SUSPENDED",
  "BILLING.SUBSCRIPTION.EXPIRED",
  "BILLING.SUBSCRIPTION.PAYMENT.FAILED",
  "PAYMENT.SALE.COMPLETED",
  "PAYMENT.SALE.REFUNDED",
  "PAYMENT.SALE.REVERSED",
];
let state;
try {
  const permissions = await stat(credentialFile);
  if ((permissions.mode & 0o077) !== 0)
    throw new Error("credential_file_not_private");
  const credentials = JSON.parse(await readFile(credentialFile, "utf8"));
  for (const name of ["clientId", "secret"])
    if (!/^[A-Za-z0-9_-]{60,120}$/.test(credentials[name] ?? ""))
      throw new Error("invalid_credentials_format");
  const authResponse = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${credentials.clientId}:${credentials.secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    signal: AbortSignal.timeout(20000),
  });
  const auth = await authResponse.json();
  if (!authResponse.ok || typeof auth.access_token !== "string")
    throw new Error(`paypal_auth_${authResponse.status}`);
  if (!auth.scope?.includes("/subscriptions"))
    throw new Error("paypal_subscriptions_permission_missing");
  async function api(path, body, requestId) {
    const response = await fetch(`${base}${path}`, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...(requestId ? { "PayPal-Request-Id": requestId } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(20000),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        `paypal_${response.status}_${/^[A-Z_]+$/.test(data.name ?? "") ? data.name : "request_failed"}`,
      );
    return data;
  }
  try {
    state = JSON.parse(await readFile(resultFile, "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT")
      throw new Error("invalid_existing_setup_state");
    state = {
      environment: "production",
      application: "Alma Arcoiris Web Live",
      plans: {},
    };
  }
  if (state.environment !== "production")
    throw new Error("wrong_result_environment");
  const save = () =>
    writeFile(resultFile, `${JSON.stringify(state, null, 2)}\n`, {
      mode: 0o600,
    });
  state.connected = true;
  state.subscriptionsPermission = true;
  if (!state.productId) {
    const matches = [];
    for (let page = 1; page <= 20; page++) {
      const list = await api(`/v1/catalogs/products?page_size=20&page=${page}`);
      matches.push(
        ...(list.products ?? []).filter((p) => p.name === productName),
      );
      if (!(list.links ?? []).some((link) => link.rel === "next")) break;
      if (page === 20) throw new Error("product_catalog_pagination_limit");
    }
    if (matches.length > 1)
      throw new Error("ambiguous_existing_monthly_product");
    const product =
      matches[0] ??
      (await api(
        "/v1/catalogs/products",
        {
          name: productName,
          type: "SERVICE",
          home_url: "https://fundacionalmaarcoiris.org/es/donar",
        },
        "alma-live-monthly-product-20261118",
      ));
    if (!/^PROD-[A-Z0-9]{17}$/.test(product.id))
      throw new Error("invalid_product_id");
    state.productId = product.id;
    await save();
  }
  for (const currency of ["USD", "EUR"]) {
    if (!state.plans[currency]) {
      const name = `Alma Arcoíris mensual ${currency}`;
      const matches = [];
      for (let page = 1; page <= 20; page++) {
        const list = await api(
          `/v1/billing/plans?product_id=${state.productId}&page_size=20&page=${page}`,
        );
        matches.push(
          ...(list.plans ?? []).filter(
            (p) =>
              p.name === name &&
              (!p.product_id || p.product_id === state.productId),
          ),
        );
        if (!(list.links ?? []).some((link) => link.rel === "next")) break;
        if (page === 20) throw new Error("plan_catalog_pagination_limit");
      }
      if (matches.length > 1)
        throw new Error("ambiguous_existing_monthly_plan");
      // This is a reusable base. Checkout must override its fixed price with
      // the donor's selected amount and verify that canonical contract.
      const plan =
        matches[0] ??
        (await api(
          "/v1/billing/plans",
          {
            product_id: state.productId,
            name,
            status: "ACTIVE",
            billing_cycles: [
              {
                frequency: { interval_unit: "MONTH", interval_count: 1 },
                tenure_type: "REGULAR",
                sequence: 1,
                total_cycles: 0,
                pricing_scheme: {
                  fixed_price: { currency_code: currency, value: "1.00" },
                },
              },
            ],
            payment_preferences: {
              auto_bill_outstanding: false,
              payment_failure_threshold: 1,
            },
          },
          `alma-live-monthly-${currency}-20261118`,
        ));
      if (!/^P-[A-Z0-9]{10,30}$/.test(plan.id))
        throw new Error("invalid_plan_id");
      state.plans[currency] = plan.id;
      await save();
    }
    const plan = await api(`/v1/billing/plans/${state.plans[currency]}`);
    const cycles = plan.billing_cycles;
    const tax = plan.taxes?.percentage;
    const noTax = tax == null || tax === "null" || /^0(?:\.0{1,2})?$/.test(tax);
    if (
      plan.product_id !== state.productId ||
      plan.status !== "ACTIVE" ||
      cycles?.length !== 1 ||
      cycles[0].frequency?.interval_unit !== "MONTH" ||
      cycles[0].frequency.interval_count !== 1 ||
      cycles[0].tenure_type !== "REGULAR" ||
      cycles[0].total_cycles !== 0 ||
      cycles[0].pricing_scheme?.fixed_price?.currency_code !== currency ||
      !/^1(?:\.0{1,2})?$/.test(cycles[0].pricing_scheme.fixed_price.value) ||
      plan.payment_preferences?.auto_bill_outstanding !== false ||
      (plan.payment_preferences.setup_fee &&
        Number(plan.payment_preferences.setup_fee.value) !== 0) ||
      !noTax
    )
      throw new Error(`invalid_${currency}_monthly_contract`);
  }
  if (provisionWebhook) {
    const list = await api("/v1/notifications/webhooks");
    const matches = (list.webhooks ?? []).filter(
      (hook) => hook.url === webhookUrl,
    );
    if (matches.length > 1) throw new Error("ambiguous_webhook");
    const hook =
      matches[0] ??
      (await api("/v1/notifications/webhooks", {
        url: webhookUrl,
        event_types: eventTypes.map((name) => ({ name })),
      }));
    const subscribed = new Set(
      (hook.event_types ?? []).map((event) => event.name),
    );
    if (
      hook.url !== webhookUrl ||
      eventTypes.some((event) => !subscribed.has(event))
    )
      throw new Error("invalid_live_webhook_contract");
    state.webhookId = hook.id;
    state.webhookUrl = hook.url;
    state.events = eventTypes;
  }
  state.verifiedAt = new Date().toISOString();
  state.liveCheckoutEnabled = false;
  await save();
  console.log(
    JSON.stringify({
      connected: true,
      environment: "production",
      plans: state.plans,
      productId: state.productId,
      webhookId: state.webhookId ?? null,
      liveCheckoutEnabled: false,
      charged: false,
    }),
  );
} catch (error) {
  console.error(
    error instanceof Error && /^[a-zA-Z0-9_]+$/.test(error.message)
      ? error.message
      : "paypal_live_setup_failed",
  );
  process.exitCode = 1;
} finally {
  await unlink(credentialFile).catch(() => {});
}
