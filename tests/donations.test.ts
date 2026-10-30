import test from "node:test";
import assert from "node:assert/strict";
import { validateDonation, causes } from "../src/lib/donations.ts";
test("accepts single and monthly COP gifts to each allowed project", () => {
  for (const cause of causes)
    for (const frequency of ["once", "monthly"]) {
      const result = validateDonation({ amount: 50000, cause, frequency });
      assert.equal(result.ok, true);
      if (result.ok) assert.equal(result.donation.currency, "COP");
    }
});
test("rejects malformed, fractional, nonfinite and out-of-bounds amounts", () => {
  for (const amount of [
    NaN,
    Infinity,
    -1,
    0,
    1000,
    999,
    100000001,
    5000.5,
    "50000",
    null,
  ])
    assert.equal(
      validateDonation({ amount, cause: "general", frequency: "once" }).ok,
      false,
    );
});
test("rejects unknown frequencies and destinations", () => {
  assert.equal(validateDonation(null).ok, false);
  assert.equal(
    validateDonation({ amount: 50000, cause: "__proto__", frequency: "once" })
      .ok,
    false,
  );
  assert.equal(
    validateDonation({ amount: 50000, cause: "general", frequency: "weekly" })
      .ok,
    false,
  );
});

test("optional support preserves the base gift and rounds in the selected currency", async () => {
  const { donationTotal } = await import("../src/lib/donations.ts");
  assert.deepEqual(donationTotal(9900, 0, "COP"), {
    base: 9900,
    support: 0,
    total: 9900,
  });
  assert.deepEqual(donationTotal(9900, 5, "COP"), {
    base: 9900,
    support: 495,
    total: 10395,
  });
  assert.deepEqual(donationTotal(3.33, 5, "USD"), {
    base: 3.33,
    support: 0.17,
    total: 3.5,
  });
  assert.deepEqual(donationTotal(9.99, 15, "EUR"), {
    base: 9.99,
    support: 1.5,
    total: 11.49,
  });
  for (const args of [
    [NaN, 5, "COP"],
    [Infinity, 5, "COP"],
    [-1, 5, "COP"],
    [3.333, 5, "USD"],
    [9900.5, 5, "COP"],
    [9900, 20, "COP"],
    [10, 5, "GBP"],
  ] as const) {
    assert.equal(donationTotal(args[0], args[1], args[2]), null);
  }
});
