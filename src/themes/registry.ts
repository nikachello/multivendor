import { minimalTheme } from "./minimal";
import { ThemeDefinition, SectionRegistry } from "./types";

const themes: Record<string, ThemeDefinition> = {
  minimal: minimalTheme,
};

export const THEMES = themes;

export function getThemeRegistry(themeId: string): SectionRegistry {
  return (themes[themeId] ?? themes.minimal).sections;
}

export function getAllThemes(): ThemeDefinition[] {
  return Object.values(themes);
}
