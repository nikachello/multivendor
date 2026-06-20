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
        <div className="w-full h-4 bg-neutral-900 rounded" />
        <div className="w-full h-20 bg-neutral-100 rounded mt-1" />
        <div className="w-2/3 h-2 bg-neutral-300 rounded-full mt-2" />
        <div className="w-1/2 h-2 bg-neutral-200 rounded-full mt-1" />
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-12 bg-neutral-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (themeId === "bold") {
    return (
      <div className="w-full h-full bg-neutral-950 flex flex-col p-3 gap-1">
        <div className="w-full h-4 bg-white/10 rounded" />
        <div className="w-full h-24 bg-white/5 border border-white/10 rounded mt-1 flex items-end p-2">
          <div className="flex flex-col gap-1">
            <div className="w-24 h-3 bg-white rounded-full" />
            <div className="w-16 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 h-10 bg-white/5 border border-white/10 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (themeId === "magazine") {
    return (
      <div className="w-full h-full bg-white flex flex-col p-3 gap-1">
        <div className="w-full h-3 bg-neutral-800 rounded" />
        <div className="flex gap-2 mt-1 flex-1">
          <div className="flex-[2] bg-neutral-100 rounded" />
          <div className="flex flex-col flex-1 gap-1">
            <div className="flex-1 bg-neutral-200 rounded" />
            <div className="flex-1 bg-neutral-100 rounded" />
            <div className="flex-1 bg-neutral-200 rounded" />
          </div>
        </div>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 h-6 bg-neutral-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (themeId === "soft") {
    return (
      <div className="w-full h-full bg-amber-50 flex flex-col p-3 gap-1">
        <div className="w-full h-4 bg-amber-200 rounded-full" />
        <div className="w-full h-20 bg-rose-100 rounded-2xl mt-1" />
        <div className="w-2/3 h-2 bg-amber-200 rounded-full mt-2" />
        <div className="w-1/2 h-2 bg-amber-100 rounded-full mt-1" />
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-12 bg-rose-50 rounded-2xl" />
          ))}
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
