import {
  loadScript,
  type PayPalNamespace,
  type PayPalScriptOptions,
} from "@paypal/paypal-js";

// PayPal's script provider reloads a single namespace when currency/intent
// changes. Distinct namespaces keep multiple Zoid bootstraps alive and conflict.
const namespace = "almaPayPal";
let sequence: Promise<unknown> = Promise.resolve();
let current: { key: string; sdk: PayPalNamespace } | undefined;

export function loadPayPalSdk(
  options: Omit<PayPalScriptOptions, "dataNamespace">,
) {
  const key = JSON.stringify(options);
  const pending = sequence.then(async () => {
    if (current?.key === key) return current.sdk;
    // Remove only the script owned by this integration, following PayPal's
    // resetOptions lifecycle. Keep the same SDK namespace for the replacement.
    document
      .querySelectorAll(`script[data-namespace="${namespace}"]`)
      .forEach((script) => script.remove());
    current = undefined;
    const sdk = await loadScript({ ...options, dataNamespace: namespace });
    if (!sdk?.Buttons) throw new Error("paypal_unavailable");
    current = { key, sdk };
    return sdk;
  });
  // A failed load must not prevent a later retry or change of currency.
  sequence = pending.catch(() => {});
  return pending;
}
