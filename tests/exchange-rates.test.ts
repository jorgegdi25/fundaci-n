import test from "node:test";
import assert from "node:assert/strict";
import {
  parseEcbEuroReference,
  readEuroReferenceRate,
  convertUsdToEur,
} from "../src/lib/exchange-rates.ts";

const now = new Date("2026-10-06T23:00:00Z");
const quote = { date: "2026-10-06", usdPerEuro: 1.1269 };

test("ECB quotes USD per EUR: convert by division and round gifts to cents", () => {
  const xml = `<Cube><Cube time='2026-10-06'><Cube currency='USD' rate='1.1269'/></Cube></Cube>`;
  assert.deepEqual(parseEcbEuroReference(xml, now), quote);
  assert.equal(convertUsdToEur(77, quote), 68.33);
  assert.equal(convertUsdToEur(46, quote), 40.82);
  assert.equal(convertUsdToEur(15, quote), 13.31);
  assert.equal(convertUsdToEur(234, quote), 207.65);
  assert.equal(convertUsdToEur(156, quote), 138.43);
  assert.deepEqual(parseEcbEuroReference(xml.replaceAll("'", '"'), now), quote);
});

test("a recent non-business-day quote is usable; stale, future and malformed quotes are not", () => {
  assert.ok(readEuroReferenceRate({ ...quote, date: "2026-10-02" }, now));
  for (const value of [
    null,
    { ...quote, date: "2026-09-28" },
    { ...quote, date: "2026-10-07" },
    { ...quote, date: "2026-02-31" },
    { ...quote, usdPerEuro: 0 },
    { ...quote, usdPerEuro: -1 },
    { ...quote, usdPerEuro: Infinity },
    { ...quote, usdPerEuro: "1.1269" },
  ])
    assert.equal(readEuroReferenceRate(value, now), null);
  for (const xml of [
    "<html>Service unavailable</html>",
    `<Cube time='2026-10-06'><Cube currency='GBP' rate='0.8488'/></Cube>`,
    `<Cube time='2026-10-06'><Cube currency='USD' rate='1.2oops'/></Cube>`,
  ])
    assert.equal(parseEcbEuroReference(xml, now), null);
});
