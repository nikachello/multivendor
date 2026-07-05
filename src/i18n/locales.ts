// Client-safe locale constants — no "server-only"/"next/headers" imports here,
// so client components (e.g. LocaleSwitcher) can import this without pulling
// server-only code into the browser bundle.

const dictionaryLoaders = {
  ka: () => import("./ka.json").then((m) => m.default),
  en: () => import("./en.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaryLoaders;
export type Dictionary = Awaited<ReturnType<(typeof dictionaryLoaders)["ka"]>>;

export const DEFAULT_LOCALE: Locale = "ka";
export const LOCALES = Object.keys(dictionaryLoaders) as Locale[];

export function hasLocale(s: string): s is Locale {
  return s in dictionaryLoaders;
}

export const dictionaries = dictionaryLoaders;
