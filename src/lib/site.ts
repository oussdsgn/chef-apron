export const site = {
  name: "Apron",
  tagline: "Workwear and tools for people who cook for a living.",
  description:
    "Apron makes chef's uniforms, aprons and kitchen utensils built for long shifts, hot lines and home kitchens alike.",
  email: "hello@apron.store",
  phone: "+1 (555) 014-2290",
  address: ["Apron Workshop", "Your street address", "City, Country"],
  currency: "USD",
  locale: "en-US",
  freeShippingThreshold: 150,
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
  },
};

export function formatPrice(amount: number) {
  return new Intl.NumberFormat(site.locale, {
    style: "currency",
    currency: site.currency,
  }).format(amount);
}
