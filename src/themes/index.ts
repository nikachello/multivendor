import { THEMES } from "./registry";
import type { ThemeConfig } from "@/themes/types";
import { minimalConfig } from "./minimal/config";

export function getThemeConfig(themeId: string): ThemeConfig {
  return THEMES[themeId]?.config ?? minimalConfig;
}
