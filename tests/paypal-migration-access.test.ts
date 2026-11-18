import test from "node:test";
import assert from "node:assert/strict";
import { migratePayPalLive } from "../src/lib/paypal-migration.ts";

test("Live schema setup rejects the Sandbox project even with another database, and rejects pooled or non-Neon hosts before connecting", async () => {
  const sandbox =
    "postgresql://fixture:fixture@ep-sandbox-pooler.neon.tech/neondb";
  for (const live of [
    "postgresql://fixture:fixture@ep-sandbox.neon.tech/alma_paypal_live",
    "postgresql://fixture:fixture@ep-live-pooler.neon.tech/neondb",
    "postgresql://fixture:fixture@other.example/neondb",
    "postgresql://fixture:fixture@ep-live.neon.tech/unknown",
  ])
    await assert.rejects(
      migratePayPalLive(live, sandbox, ""),
      /dedicated_live_project_required/,
    );
});
