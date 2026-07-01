"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { THEMES_META } from "@/themes/meta";
import { updateShopTheme } from "@/lib/actions/shop";
import { toast } from "sonner";

type Props = {
  shopId: string;
  activeThemeId: string;
};

function ThemePreview({ themeId }: { themeId: string }) {
  if (themeId === "minimal") {
    return (
      <div className="w-full h-full bg-white flex flex-col p-3 gap-1">
        <div className="w-full h-4 bg-zinc-900" />
        <div className="w-full h-20 bg-zinc-100 mt-1" />
        <div className="w-2/3 h-2 bg-zinc-300 mt-2" />
        <div className="w-1/2 h-2 bg-zinc-200 mt-1" />
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-12 bg-zinc-100" />
          ))}
        </div>
      </div>
    );
  }

  if (themeId === "maison") {
    return (
      <div className="w-full h-full flex flex-col p-3 gap-1" style={{ background: "#fbf7f0" }}>
        <div className="w-full h-4" style={{ background: "#1f1b16" }} />
        <div className="w-full h-20 mt-1" style={{ background: "#e8e0d2" }} />
        <div className="w-2/3 h-2 mt-2" style={{ background: "#8c8170" }} />
        <div className="w-1/2 h-2 mt-1" style={{ background: "#d6cfc3" }} />
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-12" style={{ background: "#f3ece0" }} />
          ))}
        </div>
      </div>
    );
  }

  if (themeId === "dew") {
    return (
      <div className="w-full h-full flex flex-col" style={{ background: "#F4ECE6" }}>
        {/* Announcement bar — periwinkle */}
        <div className="w-full h-[9px]" style={{ background: "#6C63E8" }} />
        {/* Navbar — 3 col, pill bag button */}
        <div
          className="flex items-center px-3 py-2"
          style={{ borderBottom: "1px solid #E7DBD2", display: "grid", gridTemplateColumns: "1fr auto 1fr" }}
        >
          <div className="flex gap-2">
            {[14, 10, 16].map((w, i) => (
              <div key={i} style={{ height: "6px", width: w, background: "#2C2530", borderRadius: "2px" }} />
            ))}
          </div>
          <div style={{ height: "8px", width: "24px", background: "#2C2530", borderRadius: "2px" }} />
          <div className="flex items-center gap-1.5 justify-end">
            <div style={{ height: "6px", width: "14px", background: "#9090A0", borderRadius: "2px" }} />
            <div style={{ height: "12px", width: "22px", background: "#6C63E8", borderRadius: "999px" }} />
          </div>
        </div>
        {/* Hero — radial-gradient blush/lavender */}
        <div
          className="flex items-center p-3"
          style={{
            background: "radial-gradient(ellipse 130% 120% at 80% 60%, #D9D2F2, #E7DCEF 40%, #F4ECE6)",
            minHeight: "56px",
          }}
        >
          <div className="flex flex-col gap-1">
            <div style={{ height: "5px", width: "28px", background: "#6C63E8", borderRadius: "2px" }} />
            <div style={{ height: "9px", width: "52px", background: "#2C2530", borderRadius: "2px" }} />
            <div style={{ height: "12px", width: "32px", background: "#6C63E8", borderRadius: "999px", marginTop: "2px" }} />
          </div>
        </div>
        {/* Product grid — rounded square cards */}
        <div className="px-3 pt-2 pb-1">
          <div className="h-2 w-16 mx-auto mb-2" style={{ background: "#2C2530", borderRadius: "2px" }} />
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-1">
                <div style={{ background: "#FCF8F3", aspectRatio: "1/1", borderRadius: "6px" }} />
                <div className="h-[5px] w-3/4" style={{ background: "#D7CDB9", borderRadius: "2px" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <div className="w-full h-full bg-neutral-100" />;
}

export default function ThemesClient({ shopId, activeThemeId }: Props) {
  const [currentThemeId, setCurrentThemeId] = useState(activeThemeId);
  const [pending, setPending] = useState<string | null>(null);
  const router = useRouter();

  async function handleActivate(themeId: string) {
    if (themeId === currentThemeId || pending) return;
    setPending(themeId);
    try {
      await updateShopTheme(shopId, themeId);
      setCurrentThemeId(themeId);
      toast.success("Theme activated");
      router.refresh();
    } catch {
      toast.error("Failed to activate theme");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {THEMES_META.map((theme) => {
        const isActive = theme.id === currentThemeId;
        const isSaving = pending === theme.id;

        return (
          <div
            key={theme.id}
            className={`rounded-lg border-2 overflow-hidden transition-all ${
              isActive
                ? "border-gray-900"
                : theme.available
                ? "border-gray-200 hover:border-gray-300"
                : "border-gray-100 opacity-60"
            }`}
          >
            {/* Preview */}
            <div className="w-full aspect-video overflow-hidden bg-gray-50">
              <ThemePreview themeId={theme.id} />
            </div>

            {/* Info + actions */}
            <div className="p-4 bg-white flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{theme.name}</p>
                  {isActive && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-900 text-white rounded">
                      Active
                    </span>
                  )}
                  {!theme.available && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded">
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {theme.description}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                {isActive ? (
                  <a
                    href="/dashboard/editor"
                    className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-colors whitespace-nowrap"
                  >
                    Customize
                  </a>
                ) : theme.available ? (
                  <button
                    onClick={() => handleActivate(theme.id)}
                    disabled={!!pending}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {isSaving ? "Activating…" : "Activate"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
