import "server-only";
import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, fromAcceptLanguage, isLocale, type Locale } from "./config";
import { translator } from "./messages";

/** The visitor's language: their saved choice, otherwise their browser language. */
export async function getLocale(): Promise<Locale> {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;
  return fromAcceptLanguage((await headers()).get("accept-language"));
}

export async function getT() {
  const locale = await getLocale();
  return { locale, t: translator(locale) };
}
