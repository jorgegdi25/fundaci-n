import test from "node:test";
import assert from "node:assert/strict";
import { donationChannel } from "../src/lib/donation-channel.ts";

test("public and unknown hosts never expose the integrated sandbox checkout", () => {
  for (const host of [
    null,
    "fundacionalmaarcoiris.org",
    "www.fundacionalmaarcoiris.org",
    "fundacionalmaarcoiris.org:3000",
    "unrelated.vercel.app",
    "fundacion-alma-arcoiris.vercel.app.evil.test",
    "fundacion-alma-arcoiris.vercel.app/path",
    "user@fundacion-alma-arcoiris.vercel.app",
    " fundacion-alma-arcoiris.vercel.app",
    "fundacion-alma-arcoiris.vercel.app:8443",
  ])
    assert.equal(donationChannel(host), "external", String(host));
  assert.equal(
    donationChannel("fundacionalmaarcoiris.org", ["fundacionalmaarcoiris.org"]),
    "external",
  );
});

test("only the known review alias, this deployment and local development enable sandbox", () => {
  for (const host of [
    "fundacion-alma-arcoiris.vercel.app",
    "LOCALHOST:3000",
    "127.0.0.1:3002",
    "[::1]:3000",
  ])
    assert.equal(donationChannel(host), "sandbox");
  assert.equal(
    donationChannel("alma-preview-123.vercel.app", [
      "alma-preview-123.vercel.app",
    ]),
    "sandbox",
  );
  assert.equal(
    donationChannel("another-preview.vercel.app", [
      "alma-preview-123.vercel.app",
    ]),
    "external",
  );
});
