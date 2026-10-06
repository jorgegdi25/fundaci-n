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
