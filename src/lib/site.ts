export const site = {
  name: "Apron",
  tagline: "Workwear and tools for people who cook for a living.",
  description:
    "Apron makes chef's uniforms, aprons and kitchen utensils built for long shifts, hot lines and home kitchens alike.",
  email: "hello@apron.store",
  phone: "+213 555 00 00 00",
  address: ["Apron Workshop", "Your street address", "Alger, Algérie"],
  currency: "DZD",
  /** Orders at or above this amount (in DA) ship free. */
  freeShippingThreshold: 15000,
  /** Home-delivery fee in DA when below the free-shipping threshold. */
  shippingFee: 600,
  /** Higher fee for far-south wilayas (by wilaya code). */
  shippingFeeSouth: 1200,
  southWilayas: [1, 8, 11, 33, 37, 49, 50, 52, 53, 54, 56, 58],
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
  },
};

/** Formats an amount in Algerian dinars, e.g. "4 500 DA". */
export function formatPrice(amount: number) {
  const n = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })
    .format(Math.round(amount))
    .replace(/[  ]/g, " ");
  return `${n} DA`;
}

export function shippingFor(subtotal: number, wilayaCode?: number) {
  if (subtotal <= 0 || subtotal >= site.freeShippingThreshold) return 0;
  if (wilayaCode && site.southWilayas.includes(wilayaCode)) return site.shippingFeeSouth;
  return site.shippingFee;
}
