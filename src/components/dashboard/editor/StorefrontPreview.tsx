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

        return (
          // Clicking any section in the preview selects it in the sidebar
          <div
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={`relative cursor-pointer outline outline-2 outline-offset-[-2px] transition-colors ${
              isSelected
                ? "outline-blue-500"
                : "outline-transparent hover:outline-blue-200"
            }`}
          >
            <Component {...baseProps} />

            {/* Selection label */}
            {isSelected && (
              <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 font-medium tracking-wide z-50 pointer-events-none">
                {section.type}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
