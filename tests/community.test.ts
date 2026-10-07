import test from "node:test";
import assert from "node:assert/strict";
import { validateCommunitySignup } from "../src/lib/community.ts";
const valid = {
  contact: "Persona@Ejemplo.org",
  name: "Persona",
  consent: true,
  lang: "es",
  source: "footer",
};
test("community sign-up requires explicit consent and a valid contact", () => {
  assert.equal(validateCommunitySignup({ ...valid, consent: false }), null);
  assert.equal(
    validateCommunitySignup({ ...valid, contact: "=IMPORTXML(...)" }),
    null,
  );
  assert.equal(validateCommunitySignup({ ...valid, contact: "hola" }), null);
  assert.equal(validateCommunitySignup({ ...valid, lang: "fr" }), null);
  assert.equal(
    validateCommunitySignup({ ...valid, source: "untrusted" }),
    null,
  );
  assert.equal(validateCommunitySignup(valid)?.contact, "persona@ejemplo.org");
  assert.equal(
    validateCommunitySignup({ ...valid, contact: "+57 304 498 9707" })?.contact,
    "+573044989707",
  );
});
