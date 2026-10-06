import test from "node:test";
import assert from "node:assert/strict";
import { matchesOrigin } from "../src/lib/request-security.ts";
test("validates the browser Origin against the routed Host rather than the Next server bind hostname", () => {
  assert.equal(
    matchesOrigin(
      "http://localhost:3002/api/paypal",
      "127.0.0.1:3002",
      "http://127.0.0.1:3002",
    ),
    true,
  );
  assert.equal(
    matchesOrigin(
      "https://deployment.vercel.app/api/paypal",
      "fundacion-alma-arcoiris.vercel.app",
      "https://fundacion-alma-arcoiris.vercel.app",
    ),
    true,
  );
  for (const origin of [
    "https://evil.example",
    "null",
    "http://fundacion-alma-arcoiris.vercel.app",
    "https://fundacion-alma-arcoiris.vercel.app/",
    "https://fundacion-alma-arcoiris.vercel.app:8443",
  ])
    assert.equal(
      matchesOrigin(
        "https://deployment.vercel.app/api/paypal",
        "fundacion-alma-arcoiris.vercel.app",
        origin,
      ),
      false,
    );
  assert.equal(
    matchesOrigin(
      "http://localhost:3002/api/paypal",
      null,
      "http://localhost:3002",
    ),
    false,
  );
});
