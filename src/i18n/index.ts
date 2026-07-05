import "server-only";
import { cookies } from "next/headers";
import { dictionaries, hasLocale, DEFAULT_LOCALE, type Locale } from "./locales";

export type { Locale, Dictionary } from "./locales";
export { DEFAULT_LOCALE, LOCALES, hasLocale } from "./locales";

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const locale = store.get("locale")?.value;
  return hasLocale(locale ?? "") ? (locale as Locale) : DEFAULT_LOCALE;
}

export async function getDict() {
  return getDictionary(await getLocale());
}
