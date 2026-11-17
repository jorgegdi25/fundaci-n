import test from "node:test";
import assert from "node:assert/strict";
import {
  consentCommand,
  linkMeasurement,
  measurementHost,
  measurementPath,
  parseMeasurementConsent,
  trackCompletedDonation,
  trackEvent,
} from "../src/lib/measurement.ts";

test("measurement excludes previews and private route and query data", () => {
  assert.equal(measurementHost("fundacionalmaarcoiris.org"), true);
  assert.equal(measurementHost("www.fundacionalmaarcoiris.org"), true);
  assert.equal(measurementHost("fundacion-alma-arcoiris.vercel.app"), false);
  assert.equal(measurementHost("localhost"), false);
  assert.equal(
    measurementPath("/es/proyectos/el-cairo"),
    "/es/proyectos/el-cairo",
  );
  assert.equal(measurementPath("/es/donation/manage/private-token"), "/es");
  assert.equal(measurementPath("/en/paypal/result"), "/en");
  assert.equal(measurementPath("/es/donar?email=private@example.test"), "/es");
  assert.equal(
    parseMeasurementConsent({ analytics: "yes", marketing: true }),
    null,
  );
  assert.deepEqual(consentCommand({ analytics: true, marketing: false }), {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
});

test("contact events describe actions without retaining contact or message values", () => {
  const phone = linkMeasurement("tel:+573044989707", null);
  const email = linkMeasurement(
    "mailto:private@example.test?body=private",
    null,
  );
  assert.deepEqual(phone, { event: "phone_click" });
  assert.deepEqual(email, { event: "email_click" });
  assert.deepEqual(
    linkMeasurement("https://wa.me/573044989707?text=private", null),
    {
      event: "whatsapp_click",
      fields: { link_context: "direct" },
    },
  );
  assert.deepEqual(
    linkMeasurement("https://chat.whatsapp.com/private-invite", null),
    {
      event: "whatsapp_click",
      fields: { link_context: "community" },
    },
  );
  assert.deepEqual(
    linkMeasurement("mailto:x@example.test", "volunteer_application"),
    {
      event: "volunteer_application",
    },
  );
  assert.equal(
    linkMeasurement("https://checkout.wompi.co/p/?reference=private", null),
    null,
  );
  assert.equal(linkMeasurement("https://example.test", null), null);
  assert.equal(linkMeasurement("https://[", null), null);
  assert.deepEqual(
    linkMeasurement("https://checkout.wompi.co/l/bfXo9h", null),
    {
      event: "donation_started",
      fields: { payment_provider: "wompi", donation_frequency: "once" },
    },
  );
});

test("measurement requires consent and counts only verified real gifts once", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
  const browser = {
    location: {
      hostname: "fundacionalmaarcoiris.org",
      pathname: "/es",
      origin: "https://fundacionalmaarcoiris.org",
    },
    dataLayer: [] as unknown[],
  };
  Object.assign(globalThis, {
    window: browser,
    localStorage: storage,
    sessionStorage: storage,
  });
  try {
    assert.equal(trackEvent("donation_started"), false);
    storage.setItem(
      "alma-consent-v1",
      JSON.stringify({ analytics: true, marketing: false }),
    );
    const gift = {
      id: "verified-reference",
      amount: 49900,
      currency: "COP" as const,
      frequency: "once",
      cause: "general",
      provider: "wompi" as const,
    };
    trackCompletedDonation({ ...gift, environment: "sandbox" });
    assert.equal(browser.dataLayer.length, 0);
    trackCompletedDonation({ ...gift, environment: "production" });
    trackCompletedDonation({ ...gift, environment: "production" });
    assert.equal(browser.dataLayer.length, 1);
    assert.equal(
      (browser.dataLayer[0] as { event: string }).event,
      "donation_completed",
    );
    assert.equal((browser.dataLayer[0] as { value: number }).value, 49900);
    trackCompletedDonation({
      ...gift,
      provider: "paypal",
      id: "paypal-verified",
      amount: 3.33,
      currency: "USD",
      environment: "production",
    });
    assert.equal((browser.dataLayer[1] as { value: number }).value, 3.33);
    trackCompletedDonation({
      ...gift,
      id: "invalid-currency",
      currency: "invalid",
      environment: "production",
    });
    assert.equal(browser.dataLayer.length, 2);
    trackEvent("email_click", { email: "private@example.test" } as never);
    assert.ok(
      !JSON.stringify(browser.dataLayer).includes("private@example.test"),
    );
    storage.setItem(
      "alma-consent-v1",
      JSON.stringify({ analytics: false, marketing: false }),
    );
    assert.equal(trackEvent("donation_started"), false);
    storage.setItem(
      "alma-consent-v1",
      JSON.stringify({ analytics: true, marketing: false }),
    );
    browser.location.hostname = "fundacion-alma-arcoiris.vercel.app";
    assert.equal(trackEvent("donation_started"), false);
    browser.location.hostname = "fundacionalmaarcoiris.org";
    Object.defineProperty(browser.dataLayer, "push", {
      value: () => {
        throw new Error("tag-error");
      },
    });
    assert.equal(trackEvent("newsletter_signup"), false);
  } finally {
    Reflect.deleteProperty(globalThis, "window");
    Reflect.deleteProperty(globalThis, "localStorage");
    Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});
