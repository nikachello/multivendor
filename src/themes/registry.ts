import { minimalTheme } from "./minimal";
import { maisonTheme } from "./maison";
import { dewTheme } from "./dew";
import { pipelineTheme } from "./pipeline";
import { creatorTheme } from "./creator";
import { ThemeDefinition, SectionRegistry } from "./types";

const themes: Record<string, ThemeDefinition> = {
  minimal: minimalTheme,
  maison: maisonTheme,
  dew: dewTheme,
  pipeline: pipelineTheme,
  creator: creatorTheme,
};

export const THEMES = themes;

export function getThemeRegistry(themeId: string): SectionRegistry {
  return (themes[themeId] ?? themes.minimal).sections;
}

export function getAllThemes(): ThemeDefinition[] {
  return Object.values(themes);
}
