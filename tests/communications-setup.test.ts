import test from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, existsSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = fileURLToPath(
  new URL("../scripts/verify-communications-sandbox.ts", import.meta.url),
);
let counter = 0;
function temporaryFile() {
  return `/private/tmp/alma-neon-communications-${Date.now()}${counter++}.json`;
}
function run(file: string) {
  return spawnSync(
    process.execPath,
    ["--experimental-strip-types", script, file],
    { encoding: "utf8" },
  );
}
test("database setup deletes its temporary credential file even when validation fails, without logging it", () => {
  const file = temporaryFile();
  const secret = "never-log-this-test-password";
  writeFileSync(
    file,
    JSON.stringify({ url: `postgresql://test:${secret}@invalid.example/test` }),
    { mode: 0o600, flag: "wx" },
  );
  try {
    const result = run(file);
    assert.notEqual(result.status, 0);
    assert.equal(existsSync(file), false);
    assert.ok(!(result.stdout + result.stderr).includes(secret));
    assert.match(result.stderr, /"stage":"credentials"/);
  } finally {
    if (existsSync(file)) unlinkSync(file);
  }
});
test("database setup refuses a credential file accessible to other users and removes it", () => {
  const file = temporaryFile();
  writeFileSync(file, JSON.stringify({ url: "not-a-real-connection" }), {
    mode: 0o644,
    flag: "wx",
  });
  try {
    const result = run(file);
    assert.notEqual(result.status, 0);
    assert.equal(existsSync(file), false);
    assert.match(result.stderr, /"stage":"credentials"/);
  } finally {
    if (existsSync(file)) unlinkSync(file);
  }
});
test("database setup does not read or delete arbitrary files passed as its argument", () => {
  const file = `/private/tmp/alma-unrelated-file-${Date.now()}.json`;
  writeFileSync(file, "protected test fixture", { mode: 0o600, flag: "wx" });
  try {
    assert.notEqual(run(file).status, 0);
    assert.equal(existsSync(file), true);
  } finally {
    unlinkSync(file);
  }
});
