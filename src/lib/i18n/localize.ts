import type { Category, Product, Settings } from "../types";
import type { Locale } from "./config";
import { contentTranslations } from "./content";

/**
 * Translates admin-written text. Priority: the dashboard translation (if filled in), then the
 * built-in translation of the starter content (matched paragraph by paragraph), then English.
 */
export function tx(text: string, locale: Locale, override?: string): string {
  if (locale === "en" || !text) return text;
  if (override && override.trim()) return override;
  const whole = contentTranslations[text.trim()]?.[locale];
  if (whole) return whole;
  return text
    .split(/(\n\s*\n)/)
    .map((part) => {
      const key = part.trim();
      return key ? (contentTranslations[key]?.[locale] ?? part) : part;
    })
    .join("");
}

export function localizeProduct(p: Product, locale: Locale): Product {
  if (locale === "en") return p;
  const o = p.i18n?.[locale] ?? {};
  return {
    ...p,
    name: tx(p.name, locale, o.name),
    short: tx(p.short, locale, o.short),
    description: tx(p.description, locale, o.description),
    details: o.details?.length ? o.details : p.details.map((d) => tx(d, locale)),
    colors: p.colors.map((c) => ({ ...c, label: tx(c.name, locale) })),
    sizeLabels: p.sizes ? Object.fromEntries(p.sizes.map((s) => [s, tx(s, locale)])) : undefined,
  };
}

export function localizeCategory(c: Category, locale: Locale): Category {
  if (locale === "en") return c;
  const o = c.i18n?.[locale] ?? {};
  return { ...c, name: tx(c.name, locale, o.name), title: tx(c.title, locale, o.title), blurb: tx(c.blurb, locale, o.blurb) };
}

/** Fields of the settings that hold visitor-facing text (everything else, like fees, isn't translated). */
export const TRANSLATABLE_SETTINGS: Record<"store" | "home" | "about" | "pages", string[]> = {
  store: ["name", "tagline", "description", "address"],
  home: [
    "heroTitle",
    "heroEyebrow",
    "heroCta",
    "arrivalsTitle",
    "arrivalsText",
    "testimonialQuote",
    "testimonialAuthor",
    "collectionsTitle",
    "collectionsText",
    "newsletterTitle",
    "newsletterText",
  ],
  about: ["eyebrow", "title", "body", "values"],
  pages: ["shipping", "returns", "privacy"],
};

export function parseValues(text: string) {
  return text
    .split("\n")
    .map((l) => l.split("|").map((x) => x.trim()))
    .filter(([t]) => t)
    .map(([title, ...rest]) => ({ title, text: rest.join(" | ") }));
}

export function localizeSettings(s: Settings, locale: Locale): Settings {
  if (locale === "en") return s;
  const o = s.translations?.[locale] ?? {};
  const out: Settings = JSON.parse(JSON.stringify(s));
  for (const [section, keys] of Object.entries(TRANSLATABLE_SETTINGS) as [keyof typeof TRANSLATABLE_SETTINGS, string[]][]) {
    const target = out[section] as Record<string, unknown>;
    for (const key of keys) {
      const override = o[`${section}.${key}`];
      if (section === "about" && key === "values") {
        out.about.values = override?.trim()
          ? parseValues(override)
          : s.about.values.map((v) => ({ title: tx(v.title, locale), text: tx(v.text, locale) }));
        continue;
      }
      // Names and addresses are only replaced by an explicit dashboard translation.
      const value = String(target[key] ?? "");
      target[key] = key === "name" || key === "address" ? (override?.trim() ? override : value) : tx(value, locale, override);
    }
  }
  return out;
}
