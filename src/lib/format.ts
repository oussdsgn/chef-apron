import type { Settings } from "./types";

/** Formats an amount in Algerian dinars: "4 500 DA" (English/French) or "4 500 د.ج" (Arabic). */
export function formatPrice(amount: number, locale: string = "en") {
  const n = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })
    .format(Math.round(amount))
    .replace(/[\u202f\u00a0]/g, " ");
  return locale === "ar" ? `${n} د.ج` : `${n} DA`;
}

export function shippingFor(shipping: Settings["shipping"], subtotal: number, wilayaCode?: number) {
  if (subtotal <= 0) return 0;
  if (shipping.freeThreshold > 0 && subtotal >= shipping.freeThreshold) return 0;
  if (wilayaCode && shipping.southWilayas.includes(wilayaCode)) return shipping.southFee;
  return shipping.fee;
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
