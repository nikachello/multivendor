"use client";

import { ShopSection } from "@/lib/types/store-section";
import { sectionRegistry } from "@/lib/section-registry";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";
import { NavbarSectionProps } from "@/lib/types/sections";

type Props = {
  sections: ShopSection[];
  shopId: string;
  shopSlug: string;
  shopName: string;
  currency: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

// Returns a hint string when a section has empty/default props that would render
// nothing useful. Used only in the editor preview — section components themselves
// stay unaware of the editor context.
function getUnconfiguredHint(section: ShopSection): string | null {
  switch (section.type) {
    case "collection": {
      const { categoryId } = section.props as { categoryId: string };
      if (!categoryId) return "No category selected — choose one in the settings panel →";
      return null;
    }
    case "testimonials": {
      const { testimonials } = section.props as { testimonials: unknown[] };
      if (!testimonials?.length) return "No testimonials yet — add them via the settings panel";
      return null;
    }
    case "pros": {
      const { pros } = section.props as { pros: unknown[] };
      if (!pros?.length) return "No features yet — add them via the settings panel";
      return null;
    }
    default:
      return null;
  }
}

export default function StorefrontPreview({
  sections,
  shopId,
  shopSlug,
  shopName,
  currency,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto bg-white min-w-0">
      {sections.map((section) => {
        const Component = sectionRegistry[section.type] as React.ComponentType<
          Record<string, unknown>
        >;
        if (!Component) return null;

        // Build props the same way the storefront page does
        const baseProps: Record<string, unknown> = {
          ...section.props,
          shopId,
          shopSlug,
          shopName,
          currency,
        };

        if (section.type === "navbar") {
          baseProps.items = resolveNavItems(
            (section.props as NavbarSectionProps).items ?? [],
            shopSlug
          );
        }

        const isSelected = selectedId === section.id;
        const hint = getUnconfiguredHint(section);

        return (
          <div
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={`relative cursor-pointer outline outline-2 outline-offset-[-2px] transition-colors ${
              isSelected
                ? "outline-blue-500"
                : "outline-transparent hover:outline-blue-200"
            }`}
          >
            {hint ? (
              <div className="mx-4 my-3 flex items-center justify-center border-2 border-dashed border-neutral-200 py-10 text-sm text-neutral-400">
                {hint}
              </div>
            ) : (
              <Component {...baseProps} />
            )}

            {/* Click-capture overlay — sits above all section content so links and
                buttons never receive pointer events. Clicks bubble up to the parent
                div's onClick, selecting the section without triggering navigation. */}
            <div className="absolute inset-0 z-[100]" />

            {/* Selection label — rendered above the overlay */}
            {isSelected && (
              <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 font-medium tracking-wide z-[101] pointer-events-none">
                {section.type}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
