import test from "node:test";
import assert from "node:assert/strict";
import { getSiteUrl } from "../src/lib/site-url.ts";

test("the approved site URL overrides provider-generated domains", () => {
  assert.equal(
    getSiteUrl({
      NEXT_PUBLIC_SITE_URL: "https://fundacionalmaarcoiris.org",
      VERCEL_PROJECT_PRODUCTION_URL: "project.vercel.app",
    }).origin,
    "https://fundacionalmaarcoiris.org",
  );
});

test("Vercel metadata uses the stable HTTPS project domain", () => {
  assert.equal(
    getSiteUrl({
      VERCEL_PROJECT_PRODUCTION_URL: "project.vercel.app",
      VERCEL_URL: "project-unique.vercel.app",
    }).origin,
    "https://project.vercel.app",
  );
});

test("deployment URL and local fallback work without a configured origin", () => {
  assert.equal(
    getSiteUrl({ VERCEL_URL: "project-unique.vercel.app" }).origin,
    "https://project-unique.vercel.app",
  );
  assert.equal(getSiteUrl({}).origin, "http://localhost:3000");
});
