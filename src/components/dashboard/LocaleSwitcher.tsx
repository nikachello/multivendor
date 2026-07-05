"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/context";
import { LOCALES, type Locale } from "@/i18n/locales";

function setLocaleCookie(locale: Locale) {
  document.cookie = `locale=${locale};path=/;max-age=31536000`;
}

export default function LocaleSwitcher() {
  const router = useRouter();
  const current = useLocale();

  function switchLocale(locale: Locale) {
    setLocaleCookie(locale);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 px-2.5 py-1.5">
      {LOCALES.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-200 text-[11px]">|</span>}
          <button
            onClick={() => switchLocale(locale)}
            className={`text-[12px] font-medium uppercase transition-colors ${
              locale === current
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {locale}
          </button>
        </span>
      ))}
    </div>
  );
}
