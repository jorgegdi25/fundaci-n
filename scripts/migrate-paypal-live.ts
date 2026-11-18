// Explicit migration for an empty, dedicated Live database. Never runs in build.
import { readFile, stat, unlink } from "node:fs/promises";
import { migratePayPalLive } from "../src/lib/paypal-migration.ts";
import { separatePayPalDatabase } from "../src/lib/paypal-live.ts";

const file = process.argv[2];
if (!/^\/private\/tmp\/alma-paypal-live-db-[a-f0-9-]+\.json$/.test(file ?? ""))
  throw new Error("private_live_database_file_required");
let stage = "credentials";
try {
  if (((await stat(file)).mode & 0o077) !== 0)
    throw new Error("private_file_required");
  const credentials = JSON.parse(await readFile(file, "utf8"));
  const connection = new URL(credentials.liveUrl);
  if (
    !connection.hostname.endsWith(".neon.tech") ||
    connection.hostname.includes("-pooler.") ||
    !["/alma_paypal_live", "/neondb"].includes(connection.pathname) ||
    !credentials.sandboxUrl ||
    !separatePayPalDatabase(connection.href, credentials.sandboxUrl)
  )
    throw new Error("dedicated_direct_live_database_required");
  stage = "schema_and_rollback_verification";
  const source = await readFile(
    new URL("./paypal-live-schema.sql", import.meta.url),
    "utf8",
  );
  const result = await migratePayPalLive(
    connection.href,
    credentials.sandboxUrl,
    source,
  );
  console.log(JSON.stringify(result));
} catch {
  console.error(JSON.stringify({ migrated: false, stage }));
  process.exitCode = 1;
} finally {
  await unlink(file).catch(() => {});
}
