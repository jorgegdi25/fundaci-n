import test from "node:test";
import assert from "node:assert/strict";
import {
  paypalLiveConfig,
  paypalLiveCheckoutAllowed,
  paypalLiveAccountHost,
  separatePayPalDatabase,
} from "../src/lib/paypal-live.ts";
import {
  donationEmailSettings,
  deliverDonationEmail,
  donationMessage,
  validNotice,
  type DonationNotice,
} from "../src/lib/donation-messages.ts";

const env = {
  VERCEL_ENV: "production",
  VERCEL_URL: "fundacion-immutable.vercel.app",
  PAYPAL_LIVE_CLIENT_ID: "fixture",
  PAYPAL_LIVE_CLIENT_SECRET: "fixture",
  PAYPAL_LIVE_MERCHANT_ID: "fixture",
  PAYPAL_LIVE_PLAN_USD: "fixture",
  PAYPAL_LIVE_PLAN_EUR: "fixture",
  PAYPAL_LIVE_WEBHOOK_ID: "fixture",
  PAYPAL_LIVE_DATABASE_URL:
    "postgresql://live:fixture@ep-fixture.neon.tech/paypal_live",
  DATABASE_URL:
    "postgresql://sandbox:fixture@ep-fixture-pooler.neon.tech/sandbox",
};

test("Live requires a production deployment, dedicated resources and a separate database", () => {
  assert.equal(paypalLiveConfig(env)?.apiUrl, "https://api-m.paypal.com");
  for (const key of Object.keys(env).filter(
    (key) => key !== "DATABASE_URL" && key !== "VERCEL_URL",
  ))
    assert.equal(paypalLiveConfig({ ...env, [key]: "" }), null, key);
  assert.equal(paypalLiveConfig({ ...env, VERCEL_ENV: "preview" }), null);
  assert.equal(paypalLiveConfig({ ...env, VERCEL_ENV: "development" }), null);
  assert.equal(
    paypalLiveConfig({ ...env, PAYPAL_LIVE_DATABASE_URL: env.DATABASE_URL }),
    null,
  );
  assert.equal(
    paypalLiveCheckoutAllowed("fundacionalmaarcoiris.org", env),
    false,
  );
});

test("database isolation cannot be bypassed with pooled hostname, role, protocol, port or query changes", () => {
  const same =
    "postgres://other:fixture@ep-fixture.neon.tech:5432/sandbox?sslmode=require";
  assert.equal(separatePayPalDatabase(same, env.DATABASE_URL), false);
  assert.equal(
    separatePayPalDatabase(
      same.replace("/sandbox", "/%73andbox"),
      env.DATABASE_URL,
    ),
    false,
  );
  assert.equal(
    separatePayPalDatabase(env.PAYPAL_LIVE_DATABASE_URL, env.DATABASE_URL),
    true,
  );
  for (const invalid of [
    "",
    "https://ep-fixture.neon.tech/db",
    "postgres://db",
    "invalid",
  ])
    assert.equal(separatePayPalDatabase(invalid, env.DATABASE_URL), false);
});

test("review permits only the immutable production deployment and never enables the public domain", () => {
  const review = { ...env, PAYPAL_LIVE_CHECKOUT_STAGE: "review" };
  assert.equal(paypalLiveCheckoutAllowed(env.VERCEL_URL, review), true);
  for (const host of [
    null,
    "fundacionalmaarcoiris.org",
    "www.fundacionalmaarcoiris.org",
    "fundacion-alma-arcoiris.vercel.app",
    "localhost",
    "127.0.0.1",
    "evil.vercel.app",
    `${env.VERCEL_URL}:443`,
    `${env.VERCEL_URL}/path`,
    ` ${env.VERCEL_URL}`,
    `${env.VERCEL_URL}@evil.example`,
  ])
    assert.equal(paypalLiveCheckoutAllowed(host, review), false, String(host));
  assert.equal(
    paypalLiveCheckoutAllowed(env.VERCEL_URL, {
      ...review,
      VERCEL_ENV: "preview",
    }),
    false,
  );
  assert.equal(
    paypalLiveCheckoutAllowed("fundacionalmaarcoiris.org", {
      ...review,
      PAYPAL_LIVE_CHECKOUT_STAGE: "public",
    }),
    true,
  );
  assert.equal(
    paypalLiveCheckoutAllowed(env.VERCEL_URL, {
      ...review,
      PAYPAL_LIVE_CHECKOUT_STAGE: "public",
    }),
    false,
  );
  // An existing donor retains status/cancellation access when new checkout is off.
  assert.equal(paypalLiveAccountHost("fundacionalmaarcoiris.org", env), true);
});

const gift: DonationNotice = {
  provider: "paypal",
  reference: "2GG279541U471931P",
  amountMinor: 333,
  currency: "EUR",
  frequency: "monthly",
  cause: "general",
  lang: "es",
  environment: "production",
  email: "donor@example.test",
  occurredAt: "2026-11-18T20:00:00Z",
};
const emailEnv = {
  ...env,
  PAYPAL_LIVE_RESEND_API_KEY: "fixture",
  PAYPAL_LIVE_EMAIL_FROM: "donaciones@fundacionalmaarcoiris.org",
  PAYPAL_LIVE_EMAIL_START_AT: "2026-11-18T19:00:00Z",
};

test("Live emails are independently opt-in; review redirects both audiences to the foundation test address", async () => {
  assert.equal(donationEmailSettings(emailEnv, "production"), null);
  const review = {
    ...emailEnv,
    PAYPAL_LIVE_EMAILS_ENABLED: "review",
    PAYPAL_LIVE_TEST_RECIPIENT: "webmaster@fundacionalmaarcoiris.org",
  };
  assert.ok(donationEmailSettings(review, "production"));
  assert.equal(
    donationEmailSettings({ ...review, VERCEL_ENV: "preview" }, "production"),
    null,
  );
  assert.equal(
    donationEmailSettings(
      { ...review, PAYPAL_LIVE_TEST_RECIPIENT: gift.email! },
      "production",
    ),
    null,
  );
  const sent: any[] = [];
  const mock: typeof fetch = async (_url, options) => {
    sent.push(JSON.parse(String(options?.body)));
    return Response.json({ id: "fixture" });
  };
  for (const audience of ["donor", "foundation"] as const)
    await deliverDonationEmail(gift, audience, review, mock);
  assert.equal(sent.length, 2);
  assert.ok(
    sent.every(
      (message) => message.to[0] === review.PAYPAL_LIVE_TEST_RECIPIENT,
    ),
  );
  assert.ok(!JSON.stringify(sent).includes(gift.email!));
});

test("public Live mail uses the confirmed donor and internal address, with no fictitious payment or tax claims", async () => {
  const sent: any[] = [],
    keys: string[] = [];
  const mock: typeof fetch = async (_url, options) => {
    sent.push(JSON.parse(String(options?.body)));
    keys.push(new Headers(options?.headers).get("Idempotency-Key")!);
    return Response.json({ id: "fixture" });
  };
  const publicEnv = { ...emailEnv, PAYPAL_LIVE_EMAILS_ENABLED: "public" };
  for (const audience of ["donor", "foundation"] as const)
    await deliverDonationEmail(gift, audience, publicEnv, mock);
  assert.deepEqual(sent[0].to, [gift.email]);
  assert.deepEqual(sent[1].to, ["misiones@fundacionalmaarcoiris.org"]);
  assert.ok(keys.every((key) => key.includes("paypal/production/")));
  for (const lang of ["es", "en"] as const) {
    const message = donationMessage({ ...gift, lang }, "donor");
    assert.doesNotMatch(message.subject, /Sandbox|test gift|prueba/);
    assert.doesNotMatch(message.text, /no real money|no se ha movido/);
    assert.match(message.text, /SARLAFT/);
    assert.match(message.text, /no es un certificado|not a tax certificate/i);
  }
  assert.equal(
    validNotice({ ...gift, provider: "wompi", currency: "COP" }),
    null,
  );
});
