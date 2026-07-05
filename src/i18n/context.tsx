"use client";

import { createContext, useContext } from "react";
import type { Dictionary, Locale } from "./locales";

type I18nCtx = { dict: Dictionary; locale: Locale };

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({
  dict,
  locale,
  children,
}: {
  dict: Dictionary;
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ dict, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used inside I18nProvider");

  return (key: string, vars?: Record<string, string | number>): string => {
    const parts = key.split(".");
    let node: unknown = ctx.dict;
    for (const part of parts) {
      if (typeof node !== "object" || node === null) return key;
      node = (node as Record<string, unknown>)[part];
    }
    if (typeof node !== "string") return key;
    if (!vars) return node;
    return node.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
  };
}

export function useLocale(): Locale {
  return useContext(I18nContext)?.locale ?? "ka";
}
