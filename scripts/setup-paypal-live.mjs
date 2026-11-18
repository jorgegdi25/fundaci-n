// Explicit operator command. Never runs during build, deployment or checkout.
// Credentials are read from a private temporary file and removed in finally.
import { readFile, writeFile, unlink, stat } from "node:fs/promises";

const credentialFile = process.argv[2];
const resultFile = process.argv[3];
const provisionWebhook = process.argv.includes("--webhook");
if (
  !credentialFile?.startsWith("/private/tmp/alma-paypal-live-") ||
  !resultFile
)
  throw new Error("private_credential_file_and_result_file_required");
import { setupPayPalLive } from "../src/lib/paypal-provisioning.ts";
try {
  const permissions = await stat(credentialFile);
  if ((permissions.mode & 0o077) !== 0)
    throw new Error("credential_file_not_private");
  const credentials = JSON.parse(await readFile(credentialFile, "utf8"));
  let previous;
  try {
    previous = JSON.parse(await readFile(resultFile, "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT")
      throw new Error("invalid_existing_setup_state");
  }
  const state = await setupPayPalLive(
    credentials,
    previous,
    provisionWebhook,
    (state) =>
      writeFile(resultFile, `${JSON.stringify(state, null, 2)}\n`, {
        mode: 0o600,
      }),
  );
  console.log(
    JSON.stringify({
      connected: true,
      environment: "production",
      plans: state.plans,
      productId: state.productId,
      webhookId: state.webhookId ?? null,
      liveCheckoutEnabled: false,
      charged: false,
    }),
  );
} catch (error) {
  console.error(
    error instanceof Error && /^[a-zA-Z0-9_]+$/.test(error.message)
      ? error.message
      : "paypal_live_setup_failed",
  );
  process.exitCode = 1;
} finally {
  await unlink(credentialFile).catch(() => {});
}
