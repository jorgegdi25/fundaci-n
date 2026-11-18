// Explicit migration for an empty, dedicated Live database. Never runs in build.
import { readFile, stat, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
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
    connection.pathname !== "/alma_paypal_live" ||
    !credentials.sandboxUrl ||
    !separatePayPalDatabase(connection.href, credentials.sandboxUrl)
  )
    throw new Error("dedicated_direct_live_database_required");
  const sql = neon(connection.href);
  stage = "database_identity";
  const tables =
    await sql`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
  const expected = [
    "paypal_environment",
    "paypal_gifts",
    "paypal_payments",
    "paypal_events",
    "donation_rate_limits",
    "donation_communications",
  ];
  if (tables.some((row) => !expected.includes(row.tablename)))
    throw new Error("database_is_not_dedicated");
  if (tables.length) {
    if (!tables.some((row) => row.tablename === "paypal_environment"))
      throw new Error("live_database_marker_missing");
    const marker =
      await sql`SELECT environment FROM paypal_environment WHERE singleton=true`;
    if (marker.length !== 1 || marker[0].environment !== "production")
      throw new Error("wrong_environment");
  }
  stage = "schema";
  const source = await readFile(
    new URL("./paypal-live-schema.sql", import.meta.url),
    "utf8",
  );
  const statements = source
    .split(";")
    .map((value) => value.trim())
    .filter(Boolean);
  await sql.transaction(statements.map((statement) => sql.query(statement)));
  const constraints =
    await sql`SELECT pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE contype='c' AND conrelid='public.paypal_gifts'::regclass`;
  if (
    !constraints.some(
      (row) =>
        row.definition.replace(/[\s()]/g, "") ===
        "CHECKenvironment='production'::text",
    )
  )
    throw new Error("live_constraint_missing");
  stage = "rollback_verification";
  const fixture = randomUUID(),
    rejected = randomUUID();
  // Generated UUIDs are the only interpolated identifiers. The deliberate
  // exception rolls back both the valid fixture and the invalid Sandbox trial.
  await sql.query(`DO $verification$
  BEGIN
    BEGIN
      INSERT INTO paypal_gifts(id,access_hash,amount,currency,frequency,cause,lang,environment,consent)
        VALUES('${fixture}',repeat('0',64),333,'EUR','monthly','general','es','production','{"verification":true}'::jsonb);
      BEGIN
        INSERT INTO paypal_gifts(id,access_hash,amount,currency,frequency,cause,lang,environment,consent)
          VALUES('${rejected}',repeat('0',64),333,'USD','monthly','general','es','sandbox','{}'::jsonb);
        RAISE EXCEPTION 'sandbox_row_accepted';
      EXCEPTION WHEN check_violation THEN NULL;
      END;
      RAISE EXCEPTION USING ERRCODE='P0004',MESSAGE='rollback_fixture';
    EXCEPTION WHEN SQLSTATE 'P0004' THEN NULL;
    END;
  END $verification$;`);
  if (
    (
      await sql`SELECT id FROM paypal_gifts WHERE id=${fixture} OR id=${rejected}`
    ).length
  )
    throw new Error("fixture_not_rolled_back");
  console.log(
    JSON.stringify({
      migrated: true,
      environment: "production",
      database: "alma_paypal_live",
      sandboxRejected: true,
      fixturesRolledBack: true,
    }),
  );
} catch {
  console.error(JSON.stringify({ migrated: false, stage }));
  process.exitCode = 1;
} finally {
  await unlink(file).catch(() => {});
}
