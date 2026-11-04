// Run only with the explicitly authorized, temporary private connection file.
// This script never reads donor data or sends emails. Test writes are rolled back.
import { readFile, stat, unlink, mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const credentialFile = process.argv[2];
if (
  !credentialFile ||
  !/^\/private\/tmp\/alma-neon-communications-\d+\.json$/.test(credentialFile)
)
  throw new Error("A private temporary connection file is required");

let stage = "credentials";
try {
  const permissions = (await stat(credentialFile)).mode & 0o777;
  if ((permissions & 0o077) !== 0) throw new Error("private_file_required");
  const value = JSON.parse(await readFile(credentialFile, "utf8"));
  const connection = new URL(value.url);
  if (
    !["postgres:", "postgresql:"].includes(connection.protocol) ||
    !connection.hostname.endsWith(".neon.tech") ||
    connection.hostname.includes("-pooler.")
  )
    throw new Error("direct_neon_connection_required");
  const sql = neon(connection.href);

  stage = "sandbox_audit";
  const tables =
    await sql`SELECT to_regclass('public.donation_intents') IS NOT NULL AS wompi, to_regclass('public.paypal_gifts') IS NOT NULL AS paypal`;
  if (!tables[0].wompi || !tables[0].paypal)
    throw new Error("sandbox_tables_missing");
  const constraints =
    await sql`SELECT conrelid::regclass::text AS relation, pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE contype='c' AND conrelid IN ('public.donation_intents'::regclass,'public.paypal_gifts'::regclass)`;
  const sandboxCheck = (table: string) =>
    constraints.some(
      (row) =>
        row.relation.replace(/^public\./, "") === table &&
        row.definition.replace(/[\s()]/g, "") ===
          "CHECKenvironment='sandbox'::text",
    );
  if (!sandboxCheck("donation_intents") || !sandboxCheck("paypal_gifts"))
    throw new Error("sandbox_constraint_not_verified");
  const environments =
    await sql`SELECT EXISTS(SELECT 1 FROM donation_intents WHERE environment IS NULL OR environment<>'sandbox') OR EXISTS(SELECT 1 FROM paypal_gifts WHERE environment IS NULL OR environment<>'sandbox') AS invalid`;
  if (environments[0].invalid) throw new Error("non_sandbox_data_detected");

  stage = "schema";
  const existed = (
    await sql`SELECT to_regclass('public.donation_communications') IS NOT NULL AS existing`
  )[0].existing;
  const source = await readFile(
    new URL("./communications-schema.sql", import.meta.url),
    "utf8",
  );
  const statements = source
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
  await sql.transaction(statements.map((statement) => sql.query(statement)));
  const columns =
    await sql`SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='donation_communications'`;
  const expected = [
    "event_key",
    "payload",
    "donor_sent_at",
    "donor_skipped",
    "foundation_sent_at",
    "created_at",
    "lease_until",
    "lease_id",
    "first_attempt_at",
    "next_attempt_at",
    "attempts",
    "needs_review",
  ];
  if (
    !expected.every((name) => columns.some((row) => row.column_name === name))
  )
    throw new Error("communications_schema_mismatch");

  stage = "rollback_tests";
  // The forced exception creates a PostgreSQL subtransaction rollback. Only our
  // unique fixture is used; existing payment and communication rows are untouched.
  const fixture = `verification/${randomUUID()}`;
  await sql.query(`DO $verification$
  DECLARE
    v_key text := '${fixture}';
    v_lease uuid := '${randomUUID()}';
    v_count integer;
    v_claim text;
  BEGIN
    BEGIN
      INSERT INTO donation_communications(event_key,payload) VALUES(v_key,'{"environment":"sandbox","test":true}'::jsonb) ON CONFLICT(event_key) DO NOTHING;
      INSERT INTO donation_communications(event_key,payload) VALUES(v_key,'{"environment":"sandbox","test":true}'::jsonb) ON CONFLICT(event_key) DO NOTHING;
      SELECT count(*) INTO v_count FROM donation_communications WHERE event_key=v_key;
      IF v_count<>1 THEN RAISE EXCEPTION 'duplicate_notice'; END IF;

      UPDATE donation_communications SET lease_id=v_lease,lease_until=now()+interval '5 minutes',first_attempt_at=COALESCE(first_attempt_at,now()),attempts=attempts+1
      WHERE event_key IN (SELECT event_key FROM donation_communications WHERE event_key=v_key AND needs_review=false AND next_attempt_at<=now() AND (lease_until IS NULL OR lease_until<now()) AND ((donor_sent_at IS NULL AND donor_skipped=false) OR foundation_sent_at IS NULL) ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 5)
      RETURNING event_key INTO v_claim;
      IF v_claim IS DISTINCT FROM v_key THEN RAISE EXCEPTION 'lease_not_claimed'; END IF;

      UPDATE donation_communications SET attempts=attempts+1
      WHERE event_key=v_key AND (lease_until IS NULL OR lease_until<now());
      GET DIAGNOSTICS v_count=ROW_COUNT;
      IF v_count<>0 THEN RAISE EXCEPTION 'active_lease_reclaimed'; END IF;

      UPDATE donation_communications SET donor_skipped=true,foundation_sent_at=now() WHERE event_key=v_key AND lease_id=v_lease;
      SELECT count(*) INTO v_count FROM donation_communications WHERE event_key=v_key AND ((donor_sent_at IS NULL AND donor_skipped=false) OR foundation_sent_at IS NULL);
      IF v_count<>0 THEN RAISE EXCEPTION 'completed_notice_requeued'; END IF;

      UPDATE donation_communications SET donor_skipped=false,foundation_sent_at=NULL,first_attempt_at=now()-interval '24 hours' WHERE event_key=v_key;
      UPDATE donation_communications SET needs_review=true WHERE event_key=v_key AND first_attempt_at<now()-interval '23 hours' AND ((donor_sent_at IS NULL AND donor_skipped=false) OR foundation_sent_at IS NULL);
      SELECT count(*) INTO v_count FROM donation_communications WHERE event_key=v_key AND needs_review=true;
      IF v_count<>1 THEN RAISE EXCEPTION 'expired_attempt_not_reviewed'; END IF;

      RAISE EXCEPTION USING ERRCODE='ZA001', MESSAGE='verification_rollback';
    EXCEPTION WHEN SQLSTATE 'ZA001' THEN
      NULL;
    END;
  END $verification$;`);
  const leftovers =
    await sql`SELECT count(*)::int AS count FROM donation_communications WHERE event_key=${fixture}`;
  if (leftovers[0].count !== 0) throw new Error("test_data_not_rolled_back");
  const result = {
    date: new Date().toISOString(),
    sandboxConstraintsVerified: true,
    nonSandboxDataDetected: false,
    tableCreated: !existed,
    schemaVerified: true,
    tests: [
      "event deduplication",
      "exclusive lease",
      "active lease not reclaimed",
      "completed and skipped notices not requeued",
      "uncertain delivery requires manual review after 23 hours",
      "fixture rolled back",
    ],
    fixtureRowsRemaining: 0,
    emailSent: false,
    temporaryCredentialDeleted: true,
  };
  await mkdir(new URL("../tmp/noviembre-2026/", import.meta.url), {
    recursive: true,
  });
  await writeFile(
    new URL(
      "../tmp/noviembre-2026/communications-db-verification.json",
      import.meta.url,
    ),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result));
} catch (error) {
  const code =
    error &&
    typeof error === "object" &&
    "code" in error &&
    /^[A-Z0-9]{5}$/.test(String(error.code))
      ? String(error.code)
      : "verification_failed";
  // No connection strings, provider error messages or donor fields in logs.
  console.error(JSON.stringify({ ok: false, stage, code }));
  process.exitCode = 1;
} finally {
  await unlink(credentialFile);
}
