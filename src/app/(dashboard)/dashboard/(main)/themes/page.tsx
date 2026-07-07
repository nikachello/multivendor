import type { Metadata } from "next";
import { getShop } from "@/lib/auth/get-shop";
import { isProShop } from "@/lib/subscription";
import { getDict } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return { title: d.dashboard.themes.title };
}
import ThemesClient from "./ThemesClient";

export default async function ThemesPage() {
  const [shop, d] = await Promise.all([getShop(), getDict()]);
  const themeId = (shop as { themeId?: string }).themeId ?? "minimal";
  const isPro = isProShop(shop.subscriptionPaidUntil);
  const t = d.dashboard.themes;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {t.subtitle}{" "}
          <a href="/dashboard/editor" className="underline hover:text-gray-700 transition-colors">
            {d.dashboard.editor.title}
          </a>
          .
        </p>
      </div>

      <ThemesClient shopId={shop.id} activeThemeId={themeId} isPro={isPro} />
    </div>
  );
}
