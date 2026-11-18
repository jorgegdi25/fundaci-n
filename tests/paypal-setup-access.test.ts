import test from "node:test";
import assert from "node:assert/strict";
import { paypalSetupAllowed } from "../src/lib/paypal-setup-access.ts";

test("operator provisioning requires token, same origin, immutable Production host, JSON and unexpired window", () => {
  const host = "alma-private-review.vercel.app",
    token = "a".repeat(64);
  const env = {
    VERCEL_ENV: "production",
    VERCEL_URL: host,
    PAYPAL_LIVE_SETUP_TOKEN: token,
  };
  const headers = {
    host,
    origin: `https://${host}`,
    "content-type": "application/json",
    authorization: `Bearer ${token}`,
  };
  const request = (overrides = {}) =>
    new Request(`https://${host}/api/paypal/live/setup`, {
      method: "POST",
      headers: { ...headers, ...overrides },
    });
  const now = Date.parse("2026-11-18T23:00:00Z");
  assert.equal(paypalSetupAllowed(request(), env, now), true);
  for (const override of [
    { authorization: "Bearer " + "b".repeat(64) },
    { authorization: "" },
    { origin: "https://evil.example" },
    { host: "fundacionalmaarcoiris.org" },
    { "content-type": "text/plain" },
  ])
    assert.equal(paypalSetupAllowed(request(override), env, now), false);
  assert.equal(
    paypalSetupAllowed(request(), { ...env, VERCEL_ENV: "preview" }, now),
    false,
  );
  assert.equal(
    paypalSetupAllowed(request(), { ...env, PAYPAL_LIVE_SETUP_TOKEN: "" }, now),
    false,
  );
  assert.equal(
    paypalSetupAllowed(request(), env, Date.parse("2026-11-19T22:30:00Z")),
    false,
  );
});
