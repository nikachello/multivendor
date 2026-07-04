import { getShop } from "@/lib/auth/get-shop";
import ThemesClient from "./ThemesClient";

export default async function ThemesPage() {
  const shop = await getShop();
  const themeId = (shop as { themeId?: string }).themeId ?? "minimal";

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Themes</h1>
        <p className="text-sm text-gray-500 mt-1">
          Choose a design system for your store. Customize colors and fonts in the{" "}
          <a href="/dashboard/editor" className="underline hover:text-gray-700 transition-colors">
            Editor
          </a>
          .
        </p>
      </div>

      <ThemesClient shopId={shop.id} activeThemeId={themeId} />
    </div>
  );
}
