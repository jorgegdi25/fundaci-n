import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(
  new URL("../scripts/donation-google-sheets.gs", import.meta.url),
  "utf8",
);
const columns = [
  "ID evento",
  "Fecha pago",
  "Pasarela",
  "Referencia",
  "Valor",
  "Moneda",
  "Frecuencia",
  "Proyecto",
  "Correo",
  "Idioma",
  "Entorno",
  "Estado pago",
  "Estado SARLAFT",
];
function receiver(headers = columns) {
  const rows: unknown[][] = [];
  let opens = 0,
    locked = false;
  const sheet = {
    getRange(row: number) {
      return {
        getValues: () => [headers],
        createTextFinder(value: string) {
          return {
            matchEntireCell() {
              return this;
            },
            findNext: () => rows.find((r) => r[0] === value) ?? null,
          };
        },
      };
    },
    getLastRow: () => rows.length + 1,
    appendRow: (row: unknown[]) => rows.push(Array.from(row)),
  };
  const context = vm.createContext({
    ContentService: {
      MimeType: { JSON: "json" },
      createTextOutput: (text: string) => ({
        setMimeType: () => JSON.parse(text),
      }),
    },
    LockService: {
      getScriptLock: () => ({
        waitLock: () => {
          locked = true;
        },
        hasLock: () => locked,
        releaseLock: () => {
          locked = false;
        },
      }),
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (key: string) =>
          ({
            DONATION_SHEETS_SECRET: "x".repeat(40),
            DONATION_SHEET_ID: "client-owned-sheet",
            DONATION_SHEET_NAME: "Aportes Sandbox",
          })[key],
      }),
    },
    SpreadsheetApp: {
      openById: () => {
        opens++;
        return { getSheetByName: () => sheet };
      },
    },
  });
  vm.runInContext(source, context);
  return {
    rows,
    get opens() {
      return opens;
    },
    get locked() {
      return locked;
    },
    post: (body: unknown) =>
      context.doPost({ postData: { contents: JSON.stringify(body) } }),
  };
}
const payment = {
  secret: "x".repeat(40),
  eventId: "paypal/PAYMENT123",
  status: "approved",
  environment: "sandbox",
  provider: "paypal",
  reference: "PAYMENT123",
  amountMinor: 333,
  currency: "USD",
  frequency: "monthly",
  cause: "el-cairo",
  email: "persona@example.org",
  lang: "en",
  occurredAt: "2026-11-03T18:00:00Z",
};

test("Sheets rejects unauthenticated and unapproved events without opening the spreadsheet", () => {
  const r = receiver();
  assert.equal(r.post({ ...payment, secret: "wrong" }).ok, false);
  assert.equal(r.post({ ...payment, status: "pending" }).ok, false);
  assert.equal(r.post({ ...payment, environment: "production" }).ok, false);
  assert.equal(r.post({ ...payment, eventId: "paypal/DIFFERENT" }).ok, false);
  assert.equal(r.opens, 0);
  assert.equal(r.rows.length, 0);
});
test("Sheets does not overwrite an existing client template with unexpected columns", () => {
  const r = receiver(["Plantilla de la fundación"]);
  assert.equal(r.post(payment).ok, false);
  assert.equal(r.rows.length, 0);
  assert.equal(r.locked, false);
});
test("a retried payment produces one row and never marks SARLAFT as completed", () => {
  const r = receiver();
  assert.equal(
    r.post({ ...payment, sarlaftCompleted: true, access_token: "discard" }).ok,
    true,
  );
  assert.equal(r.post(payment).duplicate, true);
  assert.equal(r.rows.length, 1);
  assert.equal(r.rows[0][4], 3.33);
  assert.equal(r.rows[0][12], "Sin conciliar");
  assert.equal(r.rows[0].length, 13);
  assert.equal(r.locked, false);
});
test("valid-looking formula prefixes in donor emails are stored as text", () => {
  const r = receiver();
  assert.equal(r.post({ ...payment, email: "=2+2@example.org" }).ok, true);
  assert.equal(r.rows[0][8], "'=2+2@example.org");
});
