import { minimalTheme } from "./minimal";
import { maisonTheme } from "./maison";
import { soloTheme } from "./solo";
import { marketTheme } from "./market";
import { formaTheme } from "./forma";
import { roasterTheme } from "./roaster";
import { ecruTheme } from "./ecru";
import { dewTheme } from "./dew";
import { ThemeDefinition, SectionRegistry } from "./types";

const themes: Record<string, ThemeDefinition> = {
  minimal: minimalTheme,
  maison: maisonTheme,
  solo: soloTheme,
  market: marketTheme,
  forma: formaTheme,
  roaster: roasterTheme,
  ecru: ecruTheme,
  dew: dewTheme,
};

export const THEMES = themes;

export function getThemeRegistry(themeId: string): SectionRegistry {
  return (themes[themeId] ?? themes.minimal).sections;
}

export function getAllThemes(): ThemeDefinition[] {
  return Object.values(themes);
}
