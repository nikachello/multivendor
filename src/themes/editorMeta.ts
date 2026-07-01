// Client-safe: only imports plain metadata — no server components, no db queries.
// Used by SectionEditor and other client components that need section metadata.

import { standardSectionMeta, dewSectionMeta } from "./_shared/sectionMeta";
import { pipelineSectionMeta } from "./pipeline/sectionMeta";
import type { SectionMeta } from "./types";

export const THEME_SECTION_META: Record<string, SectionMeta[]> = {
  minimal: standardSectionMeta,
  maison: standardSectionMeta,
  dew: [...standardSectionMeta, ...dewSectionMeta],
  pipeline: pipelineSectionMeta,
};

export function getThemeSectionMeta(themeId: string): SectionMeta[] {
  return THEME_SECTION_META[themeId] ?? THEME_SECTION_META.minimal;
}
