"use client";

import { useState } from "react";
import MenuEditor from "@/components/dashboard/navigation/MenuEditor";
import { NavItem } from "@/lib/types/sections";

type Category = { id: string; name: string; slug: string };
type Page = { slug: string; title: string };

type Props = {
  shopId: string;
  shopSlug: string;
  initialNavItems: NavItem[];
  initialFooterItems: NavItem[];
  categories: Category[];
  pages: Page[];
};

export default function NavigationTabs({
  shopId,
  shopSlug,
  initialNavItems,
  initialFooterItems,
  categories,
  pages,
}: Props) {
  const [tab, setTab] = useState<"main" | "footer">("main");

  return (
    <div className="flex flex-col h-screen font-mono">
      {/* Tab bar */}
      <div className="flex border-b border-zinc-200 bg-white shrink-0">
        {(["main", "footer"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-[11px] tracking-widest uppercase transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-zinc-900 text-zinc-900 font-semibold"
                : "border-transparent text-zinc-400 hover:text-zinc-700"
            }`}
          >
            {t === "main" ? "Main Menu" : "Footer"}
          </button>
        ))}
      </div>

      {/* Editors — both mounted, only one visible, preserves unsaved state on tab switch */}
      <div className={tab === "main" ? "flex-1 min-h-0" : "hidden"}>
        <MenuEditor
          shopId={shopId}
          shopSlug={shopSlug}
          initialItems={initialNavItems}
          categories={categories}
          pages={pages}
          menuType="navbar"
        />
      </div>
      <div className={tab === "footer" ? "flex-1 min-h-0" : "hidden"}>
        <MenuEditor
          shopId={shopId}
          shopSlug={shopSlug}
          initialItems={initialFooterItems}
          categories={categories}
          pages={pages}
          menuType="footerNav"
        />
      </div>
    </div>
  );
}
