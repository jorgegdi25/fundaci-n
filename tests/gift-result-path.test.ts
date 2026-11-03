import test from "node:test";
import assert from "node:assert/strict";
import { giftResultPath } from "../src/lib/gift-result-path.ts";

test("payment returns use the bilingual status page and keep the provider", () => {
  for (const lang of ["es", "en"] as const) {
    for (const provider of ["wompi", "paypal"] as const) {
      const url = new URL(
        giftResultPath(lang, provider, "test-reference"),
        "https://review.example",
      );
      assert.equal(url.pathname, `/${lang}/gracias-donacion`);
      assert.equal(url.searchParams.get("provider"), provider);
      assert.equal(url.searchParams.get("donation"), "test-reference");
      assert.equal(url.searchParams.has("approved"), false);
    }
  }
});

test("a return reference cannot inject query parameters or change the return host", () => {
  const id = "reference&approved=true#https://other.example";
  const url = new URL(
    giftResultPath("es", "wompi", id),
    "https://review.example",
  );
  assert.equal(url.host, "review.example");
  assert.equal(url.searchParams.get("donation"), id);
  assert.equal(url.searchParams.size, 2);
  assert.equal(url.hash, "");
});
