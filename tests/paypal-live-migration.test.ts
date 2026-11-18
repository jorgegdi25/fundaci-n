import test from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, existsSync, rmSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(
  new URL("../scripts/migrate-paypal-live.ts", import.meta.url),
);
test("Live migration rejects Sandbox, unknown hosts and readable credentials before any connection, then removes its private file", () => {
  for (const [url, mode] of [
    [
      "postgresql://fixture:never-log-this@invalid.example/alma_paypal_live",
      0o600,
    ],
    ["postgresql://fixture:never-log-this@ep-fixture.neon.tech/sandbox", 0o600],
    [
      "postgresql://fixture:never-log-this@ep-fixture.neon.tech/alma_paypal_live",
      0o644,
    ],
  ] as const) {
    const file = `/private/tmp/alma-paypal-live-db-${randomUUID()}.json`;
    writeFileSync(file, JSON.stringify({ liveUrl: url, sandboxUrl: url }), {
      mode,
      flag: "wx",
    });
    try {
      const result = spawnSync(
        process.execPath,
        ["--experimental-strip-types", script, file],
        { encoding: "utf8" },
      );
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /"stage":"credentials"/);
      assert.doesNotMatch(result.stderr + result.stdout, /never-log-this/);
      assert.equal(existsSync(file), false);
    } finally {
      rmSync(file, { force: true });
    }
  }
});
