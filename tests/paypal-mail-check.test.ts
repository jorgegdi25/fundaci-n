import test from "node:test";
import assert from "node:assert/strict";
import { sendPayPalMailCheck } from "../src/lib/paypal-mail-check.ts";

test("connection check sends two clearly identified languages to webmaster only, with stable retry keys and no invented receipt", async () => {
  const env = {
    VERCEL_ENV: "production",
    PAYPAL_LIVE_EMAILS_ENABLED: "review",
    PAYPAL_LIVE_RESEND_API_KEY: "fixture",
    PAYPAL_LIVE_EMAIL_FROM: "webmaster@fundacionalmaarcoiris.org",
    PAYPAL_LIVE_TEST_RECIPIENT: "webmaster@fundacionalmaarcoiris.org",
    PAYPAL_LIVE_EMAIL_START_AT: "2026-11-19T01:07:49Z",
  };
  const calls: { body: any; headers: Headers }[] = [];
  const fetcher: typeof fetch = async (url, init) => {
    assert.equal(url, "https://api.resend.com/emails");
    calls.push({
      body: JSON.parse(String(init?.body)),
      headers: new Headers(init?.headers),
    });
    return Response.json({ id: `fixture-${calls.length}` });
  };
  assert.equal((await sendPayPalMailCheck(env, fetcher)).donation, false);
  assert.equal(calls.length, 2);
  for (const call of calls) {
    assert.deepEqual(call.body.to, [env.PAYPAL_LIVE_TEST_RECIPIENT]);
    assert.match(call.body.subject, /^\[(PRUEBA|TEST)\]/);
    assert.doesNotMatch(call.body.text, /APPROVED|COMPLETED|\$|€|certificado/i);
  }
  assert.match(calls[0].body.text, /no confirma ningún cobro/);
  assert.match(calls[1].body.text, /does not confirm any payment/);
  assert.notEqual(
    calls[0].headers.get("Idempotency-Key"),
    calls[1].headers.get("Idempotency-Key"),
  );
  await sendPayPalMailCheck(env, fetcher);
  assert.equal(
    calls[0].headers.get("Idempotency-Key"),
    calls[2].headers.get("Idempotency-Key"),
  );
  for (const change of [
    { VERCEL_ENV: "preview" },
    { PAYPAL_LIVE_EMAILS_ENABLED: "public" },
    { PAYPAL_LIVE_TEST_RECIPIENT: "other@example.com" },
    { PAYPAL_LIVE_RESEND_API_KEY: "" },
  ])
    await assert.rejects(
      sendPayPalMailCheck({ ...env, ...change }, fetcher),
      /mail_review_only/,
    );
  assert.equal(calls.length, 4);
});
