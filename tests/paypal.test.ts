import test from "node:test";
import assert from "node:assert/strict";
import {
  decimalCents,
  validatePayPalGift,
  paypalConfig,
  samePayPalOrder,
  samePayPalSubscription,
  webhookHeaders,
  eventPaymentId,
} from "../src/lib/paypal-security.ts";
test("refund events find only known-format payment IDs without following arbitrary links", () => {
  const id = "2GG279541U471931P";
  const resource = {
    id: "1JU08902781691411",
    links: [
      {
        rel: "up",
        href: `https://api-m.paypal.com/v2/payments/captures/${id}`,
      },
    ],
  };
  assert.equal(eventPaymentId(resource), id);
  assert.equal(
    eventPaymentId({
      ...resource,
      links: [
        { rel: "up", href: `https://evil.example/v2/payments/captures/${id}` },
      ],
    }),
    resource.id,
  );
  assert.equal(eventPaymentId({ sale_id: id }), id);
  assert.equal(eventPaymentId({ id: "invalid" }), null);
});
test("PayPal decimal amounts reject rounding, exponent notation and unsupported currencies", () => {
  assert.equal(decimalCents("2.13"), 213);
  assert.equal(decimalCents("1.1"), 110);
  assert.equal(decimalCents("0.01"), 1);
  for (const bad of [
    "1e3",
    "2.131",
    "1,00",
    "-1",
    "NaN",
    "Infinity",
    1,
    {},
    " 1",
    "9999999",
  ])
    assert.equal(decimalCents(bad), null);
  const gift = {
    amount: "2.13",
    currency: "USD",
    frequency: "monthly",
    cause: "general",
    lang: "es",
    agreeFoundation: true,
    agreeMonthly: true,
  };
  assert.equal(validatePayPalGift(gift)?.amount, 213);
  for (const change of [
    { currency: "COP" },
    { currency: "GBP" },
    { amount: "0.99" },
    { amount: "10000.01" },
    { agreeFoundation: false },
    { agreeMonthly: false },
    { lang: "fr" },
    { cause: "unknown" },
  ])
    assert.equal(validatePayPalGift({ ...gift, ...change }), null);
  assert.ok(validatePayPalGift({ ...gift, currency: "EUR" }));
});
test("PayPal can only use the Sandbox API and requires all configured resources", () => {
  const env = {
    PAYPAL_ENVIRONMENT: "sandbox",
    PAYPAL_CLIENT_ID: "fixture",
    PAYPAL_CLIENT_SECRET: "fixture",
    PAYPAL_MERCHANT_ID: "fixture",
    PAYPAL_PLAN_USD: "fixture",
    PAYPAL_PLAN_EUR: "fixture",
    PAYPAL_WEBHOOK_ID: "fixture",
  };
  assert.equal(paypalConfig(env)?.apiUrl, "https://api-m.sandbox.paypal.com");
  assert.equal(paypalConfig({ ...env, PAYPAL_ENVIRONMENT: "live" }), null);
  for (const key of Object.keys(env))
    assert.equal(paypalConfig({ ...env, [key]: "" }), null);
});
test("approved orders must match the owner, exact amount, currency and recipient", () => {
  const gift = { id: "gift", order_id: "ORDER", amount: 213, currency: "USD" };
  const order = {
    id: "ORDER",
    intent: "CAPTURE",
    status: "APPROVED",
    purchase_units: [
      {
        custom_id: "gift",
        payee: { merchant_id: "MERCHANT" },
        amount: { value: "2.13", currency_code: "USD" },
      },
    ],
  };
  assert.ok(samePayPalOrder(order, gift, "MERCHANT"));
  for (const change of [
    { id: "OTHER" },
    { intent: "AUTHORIZE" },
    { purchase_units: [] },
    { purchase_units: [order.purchase_units[0], order.purchase_units[0]] },
  ])
    assert.equal(
      samePayPalOrder({ ...order, ...change }, gift, "MERCHANT"),
      false,
    );
  for (const change of [
    { custom_id: "other" },
    { payee: { merchant_id: "OTHER" } },
    { amount: { value: "2.14", currency_code: "USD" } },
    { amount: { value: "2.13", currency_code: "EUR" } },
  ])
    assert.equal(
      samePayPalOrder(
        {
          ...order,
          purchase_units: [{ ...order.purchase_units[0], ...change }],
        },
        gift,
        "MERCHANT",
      ),
      false,
    );
});
test("subscriptions match indefinite monthly frequency with no fees or extra outstanding charge", () => {
  const gift = {
    id: "gift",
    subscription_id: "SUB",
    plan_id: "PLAN",
    amount: 213,
    currency: "EUR",
  };
  const cycle = {
    tenure_type: "REGULAR",
    sequence: 1,
    total_cycles: 0,
    frequency: { interval_unit: "MONTH", interval_count: 1 },
    pricing_scheme: { fixed_price: { currency_code: "EUR", value: "2.13" } },
  };
  const sub = {
    id: "SUB",
    custom_id: "gift",
    plan_id: "PLAN",
    plan: {
      billing_cycles: [cycle],
      payment_preferences: { auto_bill_outstanding: false },
    },
  };
  assert.ok(samePayPalSubscription(sub, gift));
  for (const percentage of [undefined, null, "null", "0", "0.0", "0.00"])
    assert.ok(
      samePayPalSubscription(
        { ...sub, plan: { ...sub.plan, taxes: { percentage } } },
        gift,
      ),
    );
  for (const percentage of ["1.00", "0.01", "", "0e0", "false", "NaN"])
    assert.equal(
      samePayPalSubscription(
        { ...sub, plan: { ...sub.plan, taxes: { percentage } } },
        gift,
      ),
      false,
    );
  for (const change of [
    { total_cycles: 12 },
    { tenure_type: "TRIAL" },
    { frequency: { interval_unit: "WEEK", interval_count: 1 } },
    {
      pricing_scheme: { fixed_price: { currency_code: "USD", value: "2.13" } },
    },
    {
      pricing_scheme: { fixed_price: { currency_code: "EUR", value: "3.13" } },
    },
  ])
    assert.equal(
      samePayPalSubscription(
        {
          ...sub,
          plan: { ...sub.plan, billing_cycles: [{ ...cycle, ...change }] },
        },
        gift,
      ),
      false,
    );
  for (const change of [
    { custom_id: "other" },
    { plan_id: "other" },
    { quantity: "2" },
  ])
    assert.equal(samePayPalSubscription({ ...sub, ...change }, gift), false);
  assert.equal(
    samePayPalSubscription(
      {
        ...sub,
        plan: {
          ...sub.plan,
          payment_preferences: { auto_bill_outstanding: true },
        },
      },
      gift,
    ),
    false,
  );
  assert.equal(
    samePayPalSubscription(
      {
        ...sub,
        plan: {
          ...sub.plan,
          payment_preferences: {
            auto_bill_outstanding: false,
            setup_fee: { value: "1.00" },
          },
        },
      },
      gift,
    ),
    false,
  );
});
test("webhook verification accepts only official certificate hosts and complete signature headers", () => {
  const headers = new Headers({
    "paypal-auth-algo": "SHA256withRSA",
    "paypal-cert-url":
      "https://api.sandbox.paypal.com/v1/notifications/certs/CERT-fixture",
    "paypal-transmission-id": "fixture",
    "paypal-transmission-sig": "fixture",
    "paypal-transmission-time": "2026-10-06T20:00:00Z",
  });
  assert.ok(webhookHeaders(headers));
  for (const url of [
    "http://api.sandbox.paypal.com/v1/notifications/certs/x",
    "https://evil.example/v1/notifications/certs/x",
    "https://api.sandbox.paypal.com.evil.example/v1/notifications/certs/x",
    "https://api.sandbox.paypal.com/other",
    "https://user:pass@api.sandbox.paypal.com/v1/notifications/certs/x",
  ]) {
    const changed = new Headers(headers);
    changed.set("paypal-cert-url", url);
    assert.equal(webhookHeaders(changed), null);
  }
  headers.delete("paypal-transmission-sig");
  assert.equal(webhookHeaders(headers), null);
});
