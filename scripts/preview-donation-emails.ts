import { mkdir, writeFile } from "node:fs/promises";
import {
  donationMessage,
  type DonationNotice,
} from "../src/lib/donation-messages.ts";

const folder = new URL("../tmp/noviembre-2026/correos/", import.meta.url);
await mkdir(folder, { recursive: true });
for (const lang of ["es", "en"] as const) {
  for (const audience of ["donor", "foundation"] as const) {
    const gift: DonationNotice = {
      provider: "wompi",
      reference: "ALMA-EJEMPLO-SIN-PAGO",
      amountMinor: 990000,
      currency: "COP",
      frequency: "monthly",
      cause: "el-cairo",
      lang,
      environment: "sandbox",
      email: "ejemplo@example.org",
      occurredAt: "2026-11-03T18:00:00Z",
    };
    const message = donationMessage(gift, audience);
    await writeFile(new URL(`${audience}-${lang}.html`, folder), message.html);
  }
}
console.log("Four local email previews generated; no email was sent.");
