import { maisonConfig } from "./maison/config";
import { minimalConfig } from "./minimal/config";
import { soloConfig } from "./solo/config";
import { marketConfig } from "./market/config";
import { formaConfig } from "./forma/config";
import { roasterConfig } from "./roaster/config";
import { ecruConfig } from "./ecru/config";
import { dewConfig } from "./dew/config";
import type { ThemeConfig } from "@/themes/types";

const themeConfigs: Record<string, ThemeConfig> = {
  maison: maisonConfig,
  minimal: minimalConfig,
  solo: soloConfig,
  market: marketConfig,
  forma: formaConfig,
  roaster: roasterConfig,
  ecru: ecruConfig,
  dew: dewConfig,
};

export function getThemeConfig(themeId: string): ThemeConfig {
  return themeConfigs[themeId] ?? minimalConfig;
}
