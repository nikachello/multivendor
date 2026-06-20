import { minimalTheme } from "./minimal";
import { maisonTheme } from "./maison";
import { ThemeDefinition, SectionRegistry } from "./types";

const themes: Record<string, ThemeDefinition> = {
  minimal: minimalTheme,
  maison: maisonTheme,
};

export const THEMES = themes;

export function getThemeRegistry(themeId: string): SectionRegistry {
  return (themes[themeId] ?? themes.minimal).sections;
}

export function getAllThemes(): ThemeDefinition[] {
  return Object.values(themes);
}
