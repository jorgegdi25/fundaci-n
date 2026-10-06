import test from "node:test";
import assert from "node:assert/strict";
import {
  sandboxConfig,
  integritySignature,
  authenticEvent,
  sha256,
  nextMonthlyDate,
  sameContract,
} from "../src/lib/wompi-security.ts";

const sandbox = {
  WOMPI_ENVIRONMENT: "sandbox",
  WOMPI_PUBLIC_KEY: "pub_test_fixture",
  WOMPI_PRIVATE_KEY: "prv_test_fixture",
  WOMPI_INTEGRITY_SECRET: "test_integrity_fixture",
  WOMPI_EVENTS_SECRET: "test_events_fixture",
};
test("blocks missing, production and mixed-environment payment credentials", () => {
  assert.equal(sandboxConfig(sandbox)?.environment, "sandbox");
  for (const change of [
    { WOMPI_ENVIRONMENT: "production" },
    { WOMPI_PUBLIC_KEY: "pub_prod_fixture" },
    { WOMPI_PRIVATE_KEY: "prv_prod_fixture" },
    { WOMPI_INTEGRITY_SECRET: "prod_integrity_fixture" },
    { WOMPI_EVENTS_SECRET: "prod_events_fixture" },
    { WOMPI_PRIVATE_KEY: "" },
    { WOMPI_PRIVATE_KEY: "prv_test_" },
  ])
    assert.equal(sandboxConfig({ ...sandbox, ...change }), null);
});
test("matches Wompi's published signature example and signs expiration", () => {
  const signature = integritySignature(
    "sk8-438k4-xmxm392-sn2m",
    2490000,
    "prod_integrity_Z5mMke9x0k8gpErbDqwrJXMqsI6SFli6",
  );
  assert.equal(
    signature,
    "37c8407747e595535433ef8f6a811d853cd943046624a0ec04662b17bbf33bf5",
  );
  assert.notEqual(
    integritySignature("ref", 100000, "test_integrity_fixture"),
    integritySignature(
      "ref",
      100000,
      "test_integrity_fixture",
      "2026-10-06T18:00:00.000Z",
    ),
  );
});
test("checks dynamic webhook paths and rejects tampering and production events", () => {
  const secret = "test_events_fixture";
  const event = {
    environment: "test",
    timestamp: 1791310000,
    data: {
      transaction: {
        id: "test-123",
        status: "APPROVED",
        amount_in_cents: 5000000,
        reference: "test-ref",
      },
    },
    signature: {
      properties: [
        "transaction.reference",
        "transaction.amount_in_cents",
        "transaction.status",
        "transaction.id",
      ],
      checksum: "",
    },
  };
  event.signature.checksum = sha256(
    `test-ref5000000APPROVEDtest-123${event.timestamp}${secret}`,
  );
  assert.equal(authenticEvent(event, secret), true);
  assert.equal(
    authenticEvent(event, secret, event.signature.checksum.toUpperCase()),
    true,
  );
  assert.equal(
    authenticEvent({ ...event, environment: "prod" }, secret),
    false,
  );
  assert.equal(
    authenticEvent({ ...event, timestamp: 1791310001 }, secret),
    false,
  );
  assert.equal(
    authenticEvent(
      {
        ...event,
        data: {
          transaction: { ...event.data.transaction, amount_in_cents: 1 },
        },
      },
      secret,
    ),
    false,
  );
  assert.equal(
    authenticEvent(
      {
        ...event,
        signature: {
          ...event.signature,
          properties: ["transaction.__proto__"],
        },
      },
      secret,
    ),
    false,
  );
  assert.equal(authenticEvent(null, secret), false);
});
test("preserves the monthly anchor after short months and leap years", () => {
  assert.equal(
    nextMonthlyDate(new Date("2027-01-31T15:00:00Z"), 31).toISOString(),
    "2027-02-28T15:00:00.000Z",
  );
  assert.equal(
    nextMonthlyDate(new Date("2027-02-28T15:00:00Z"), 31).toISOString(),
    "2027-03-31T15:00:00.000Z",
  );
  assert.equal(
    nextMonthlyDate(new Date("2028-01-31T15:00:00Z"), 31).toISOString(),
    "2028-02-29T15:00:00.000Z",
  );
  // UTC has changed month but the donor's date in Colombia is still January 31.
  assert.equal(
    nextMonthlyDate(new Date("2027-02-01T02:00:00Z"), 31).toISOString(),
    "2027-02-28T15:00:00.000Z",
  );
});
test("refreshes acceptance tokens only for the same approved contract version", () => {
  const token = (value: unknown) =>
    `fixture.${Buffer.from(JSON.stringify(value)).toString("base64url")}.fixture`;
  const claims = {
    contract_id: 1,
    file_hash: "original",
    permalink: "https://wompi.co/policy.pdf",
  };
  assert.equal(
    sameContract(token({ ...claims, exp: 1 }), token({ ...claims, exp: 2 })),
    true,
  );
  assert.equal(
    sameContract(token(claims), token({ ...claims, file_hash: "changed" })),
    false,
  );
  assert.equal(sameContract(token({}), token({})), false);
  assert.equal(sameContract("malformed", "malformed"), false);
});
