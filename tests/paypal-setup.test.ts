import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  writeFileSync,
  readFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

test("Live provisioning creates only two monthly base plans, verifies both, reuses resources and never starts a payment", () => {
  const directory = mkdtempSync("/private/tmp/paypal-setup-test-");
  const credentialFile = `/private/tmp/alma-paypal-live-test-${randomUUID()}.json`;
  const mockFile = `${directory}/mock.mjs`,
    stateFile = `${directory}/state.json`,
    callsFile = `${directory}/calls.json`;
  const secret = "S".repeat(82);
  const mock = `
    import { readFileSync, writeFileSync } from 'node:fs';
    const callsFile = ${JSON.stringify(callsFile)};
    let calls = [];
    const productId = 'PROD-AAAAAAAAAAAAAAAAA';
    const plan = currency => ({
      id: 'P-' + currency + 'A'.repeat(17), product_id: productId, status: 'ACTIVE',
      name: 'Alma Arcoíris mensual ' + currency,
      billing_cycles: [{frequency:{interval_unit:'MONTH',interval_count:1},tenure_type:'REGULAR',sequence:1,total_cycles:0,pricing_scheme:{fixed_price:{currency_code:currency,value:'1.0'}}}],
      payment_preferences: {auto_bill_outstanding:false}, taxes:{percentage:'null'}
    });
    globalThis.fetch = async (url, options={}) => {
      const parsed = new URL(url);
      if (parsed.origin !== 'https://api-m.paypal.com') throw Error('unexpected_provider');
      const path = parsed.pathname, method = options.method || 'GET';
      const body = options.body && options.headers['Content-Type'] === 'application/json' ? JSON.parse(options.body) : null;
      calls.push({path,method,body}); writeFileSync(callsFile,JSON.stringify(calls));
      if (path === '/v1/oauth2/token') return Response.json({access_token:'fixture',scope:'https://uri.paypal.com/services/subscriptions'});
      const reused = process.env.FIXTURE_REUSE === 'true';
      if (path === '/v1/catalogs/products') return Response.json(method === 'GET' ? {products:reused?[{id:productId,name:'Fundación Alma Arcoíris — aporte mensual'}]:[]} : {id:productId});
      if (path === '/v1/billing/plans') return Response.json(method === 'GET' ? {plans:reused?[plan('USD'),plan('EUR')]:[]} : plan(body.billing_cycles[0].pricing_scheme.fixed_price.currency_code));
      if (path.startsWith('/v1/billing/plans/P-')) return Response.json(plan(path.includes('USD')?'USD':'EUR'));
      throw Error('unexpected_payment_or_subscription_request');
    };
  `;
  writeFileSync(mockFile, mock);
  function run(reuse = false) {
    writeFileSync(
      credentialFile,
      JSON.stringify({ clientId: "C".repeat(82), secret }),
      { mode: 0o600, flag: "wx" },
    );
    return spawnSync(
      process.execPath,
      [
        "--import",
        mockFile,
        fileURLToPath(
          new URL("../scripts/setup-paypal-live.mjs", import.meta.url),
        ),
        credentialFile,
        stateFile,
      ],
      {
        encoding: "utf8",
        env: { ...process.env, FIXTURE_REUSE: String(reuse) },
      },
    );
  }
  try {
    const first = run();
    assert.equal(first.status, 0, first.stderr);
    assert.equal(existsSync(credentialFile), false);
    assert.ok(!(first.stdout + first.stderr).includes(secret));
    const calls = JSON.parse(readFileSync(callsFile, "utf8"));
    const plans = calls.filter(
      (call: any) =>
        call.method === "POST" && call.path === "/v1/billing/plans",
    );
    assert.equal(plans.length, 2);
    assert.deepEqual(
      plans.map(
        (call: any) =>
          call.body.billing_cycles[0].pricing_scheme.fixed_price.currency_code,
      ),
      ["USD", "EUR"],
    );
    assert.ok(
      calls.every(
        (call: any) => !/orders|subscriptions|capture/.test(call.path),
      ),
    );
    assert.equal(JSON.parse(first.stdout).charged, false);
    rmSync(stateFile);
    const reused = run(true);
    assert.equal(reused.status, 0, reused.stderr);
    const secondCalls = JSON.parse(readFileSync(callsFile, "utf8"));
    assert.ok(
      secondCalls.every(
        (call: any) =>
          call.method === "GET" || call.path === "/v1/oauth2/token",
      ),
    );
    assert.equal(existsSync(credentialFile), false);
  } finally {
    rmSync(credentialFile, { force: true });
    rmSync(directory, { recursive: true, force: true });
  }
});
