import test from "node:test";
import assert from "node:assert/strict";
import {
  donationMessage,
  validNotice,
  donationEmailSettings,
  deliverDonationEmail,
  type DonationNotice,
} from "../src/lib/donation-messages.ts";

const gift: DonationNotice = {
  provider: "wompi",
  reference: "ALMA-test-0",
  amountMinor: 990000,
  currency: "COP",
  frequency: "monthly",
  cause: "el-cairo",
  lang: "es",
  environment: "sandbox",
  email: "donante@example.org",
  occurredAt: "2026-11-03T18:00:00.000Z",
};
const env = {
  DONATION_EMAILS_ENABLED: "sandbox",
  RESEND_API_KEY: "fake-api-key-for-tests",
  DONATION_EMAIL_FROM: "donaciones@fundacionalmaarcoiris.org",
  DONATION_TEST_RECIPIENT: "webmaster@fundacionalmaarcoiris.org",
  DONATION_EMAIL_START_AT: "2026-11-03T17:00:00.000Z",
};

test("mail is opt-in and requires an activation date and a separate test recipient", () => {
  assert.equal(
    donationEmailSettings({ ...env, DONATION_EMAILS_ENABLED: "" }),
    null,
  );
  assert.equal(
    donationEmailSettings({ ...env, DONATION_EMAILS_ENABLED: "production" }),
    null,
  );
  assert.equal(
    donationEmailSettings({ ...env, DONATION_TEST_RECIPIENT: "" }),
    null,
  );
  assert.equal(
    donationEmailSettings({ ...env, DONATION_EMAIL_START_AT: "invalid" }),
    null,
  );
  assert.equal(
    donationEmailSettings({
      ...env,
      DONATION_EMAIL_FROM: "mail@example.org\r\nBcc:other@example.org",
    }),
    null,
  );
});
test("only whitelisted, validated sandbox receipt fields are retained", () => {
  assert.equal(validNotice({ ...gift, environment: "production" }), null);
  assert.equal(validNotice({ ...gift, amountMinor: NaN }), null);
  assert.equal(validNotice({ ...gift, provider: "paypal" }), null);
  assert.equal(
    validNotice({ ...gift, email: "x@example.org\r\nBcc:y@example.org" }),
    null,
  );
  assert.equal(validNotice({ ...gift, reference: "<script>" }), null);
  const result = validNotice({
    ...gift,
    access_token: "never retain",
    card_number: "never retain",
  });
  assert.deepEqual(result, gift);
});
test("bilingual messages identify Sandbox and do not certify registration or tax issuance", () => {
  const es = donationMessage(gift, "donor"),
    en = donationMessage({ ...gift, lang: "en" }, "donor");
  assert.match(es.text, /PRUEBA SANDBOX/);
  assert.match(es.text, /no es un certificado tributario/);
  assert.match(en.text, /no real money has moved/);
  assert.match(en.text, /current form is in Spanish/);
  assert.match(es.text, /https:\/\/forms.gle\/7DTsXPsm93ZMJby17/);
  assert.match(
    donationMessage(gift, "foundation").text,
    /no acredita que el formulario esté completado/,
  );
  assert.match(es.html, /<html lang="es">/);
  assert.match(en.html, /<html lang="en">/);
});
test("delivery redirects both audiences to the test recipient and has a stable idempotency key", async () => {
  const sent: { body: any; key: string | null }[] = [];
  const mock: typeof fetch = async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    sent.push({
      body: JSON.parse(String(options?.body)),
      key: new Headers(options?.headers).get("Idempotency-Key"),
    });
    return Response.json({ id: "fake-resend-id" });
  };
  assert.equal(
    (await deliverDonationEmail(gift, "donor", env, mock)).status,
    "sent",
  );
  await deliverDonationEmail(gift, "donor", env, mock);
  await deliverDonationEmail(gift, "foundation", env, mock);
  for (const item of sent)
    assert.deepEqual(item.body.to, [env.DONATION_TEST_RECIPIENT]);
  assert.equal(sent[0].key, sent[1].key);
  assert.notEqual(sent[0].key, sent[2].key);
  assert.equal(sent[0].body.reply_to, "contacto@fundacionalmaarcoiris.org");
  assert.ok(!JSON.stringify(sent).includes(gift.email!));
});
test("disabled delivery, old payments and missing donor email never make a request", async () => {
  const noRequest: typeof fetch = async () => {
    throw new Error("unexpected_network_request");
  };
  assert.equal(
    (await deliverDonationEmail(gift, "donor", {}, noRequest)).status,
    "disabled",
  );
  assert.equal(
    (
      await deliverDonationEmail(
        { ...gift, occurredAt: "2026-11-02T00:00:00Z" },
        "donor",
        env,
        noRequest,
      )
    ).status,
    "disabled",
  );
  assert.equal(
    (
      await deliverDonationEmail(
        { ...gift, email: null },
        "donor",
        env,
        noRequest,
      )
    ).status,
    "skipped",
  );
});
test("an unsuccessful provider request never reports delivery or exposes its response", async () => {
  const mock: typeof fetch = async () =>
    Response.json({ message: "sensitive provider details" }, { status: 429 });
  await assert.rejects(
    deliverDonationEmail(gift, "donor", env, mock),
    /^Error: donation_email_delivery_failed$/,
  );
});
