import type { Lang } from "./i18n.ts";

export function giftResultPath(
  lang: Lang,
  provider: "wompi" | "paypal",
  id: string,
) {
  return `/${lang}/gracias-donacion?${new URLSearchParams({ provider, donation: id })}`;
}
