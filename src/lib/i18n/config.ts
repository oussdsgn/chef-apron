export const LOCALES = ["en", "fr", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
/** Languages content can be translated into (English is the source). */
export type TranslatedLocale = Exclude<Locale, "en">;
export const TRANSLATED: TranslatedLocale[] = ["fr", "ar"];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "apron_lang";

export const LOCALE_NAMES: Record<Locale, string> = { en: "English", fr: "Français", ar: "العربية" };
export const LOCALE_SHORT: Record<Locale, string> = { en: "EN", fr: "FR", ar: "ع" };

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (LOCALES as readonly string[]).includes(v);
export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");

/** Picks the best supported language from an Accept-Language header. */
export function fromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const prefs = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.slice(0, 2).toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return prefs.find((p) => isLocale(p.lang))?.lang as Locale | undefined ?? DEFAULT_LOCALE;
}
