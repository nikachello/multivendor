export { getThemeRegistry, getAllThemes, THEMES } from "@/themes/registry";

// Legacy default export — resolves to the minimal theme.
// Prefer getThemeRegistry(shop.themeId) in new code.
import { getThemeRegistry } from "@/themes/registry";
export const sectionRegistry = getThemeRegistry("minimal");
