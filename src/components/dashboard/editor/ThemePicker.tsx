"use client";

import { useState } from "react";
import { THEMES_META } from "@/themes/meta";
import { updateShopTheme } from "@/lib/actions/shop";
import { toast } from "sonner";

type Props = {
  shopId: string;
  activeThemeId: string;
  onSwitch: (newThemeId: string) => void;
};

function ThemePreview({ themeId }: { themeId: string }) {
  if (themeId === "minimal") {
    return (
      <div className="w-full h-full bg-white flex flex-col p-1 gap-0.5">
        <div className="w-full h-2.5 bg-neutral-900 rounded-sm" />
        <div className="w-full h-8 bg-neutral-100 rounded-sm mt-0.5" />
        <div className="w-3/4 h-1 bg-neutral-300 rounded-full mt-1" />
        <div className="w-1/2 h-1 bg-neutral-200 rounded-full mt-0.5" />
        <div className="flex gap-1 mt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-5 bg-neutral-100 rounded-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (themeId === "bold") {
    return (
      <div className="w-full h-full bg-neutral-950 flex flex-col p-1 gap-0.5">
        <div className="w-full h-2.5 bg-white/15 rounded-sm" />
        <div className="w-full h-10 bg-white/5 border border-white/10 rounded-sm mt-0.5 flex items-end p-1">
          <div className="w-1/2 h-1.5 bg-white rounded-full" />
        </div>
        <div className="w-3/4 h-1.5 bg-white/30 rounded-full mt-1" />
        <div className="w-1/3 h-1.5 bg-white/15 rounded-full mt-0.5" />
      </div>
    );
  }

  if (themeId === "magazine") {
    return (
      <div className="w-full h-full bg-white flex flex-col p-1 gap-0.5">
        <div className="w-full h-2 bg-neutral-800 rounded-sm" />
        <div className="flex gap-0.5 mt-0.5 flex-1">
          <div className="flex-[2] bg-neutral-100 rounded-sm" />
          <div className="flex flex-col flex-1 gap-0.5">
            <div className="flex-1 bg-neutral-200 rounded-sm" />
            <div className="flex-1 bg-neutral-100 rounded-sm" />
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 h-3 bg-neutral-100 rounded-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (themeId === "soft") {
    return (
      <div className="w-full h-full bg-amber-50 flex flex-col p-1 gap-0.5">
        <div className="w-full h-2.5 bg-amber-200 rounded-full" />
        <div className="w-full h-8 bg-rose-100 rounded-lg mt-0.5" />
        <div className="w-3/4 h-1 bg-amber-200 rounded-full mt-1" />
        <div className="w-1/2 h-1 bg-amber-100 rounded-full mt-0.5" />
        <div className="flex gap-1 mt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-4 bg-rose-50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return <div className="w-full h-full bg-neutral-100" />;
}

export default function ThemePicker({ shopId, activeThemeId, onSwitch }: Props) {
  const [pending, setPending] = useState<string | null>(null);

  async function handleSelect(themeId: string) {
    if (themeId === activeThemeId || pending) return;
    setPending(themeId);
    try {
      await updateShopTheme(shopId, themeId);
      onSwitch(themeId);
    } catch {
      toast.error("Failed to switch theme");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
        Design System
      </p>
      <div className="grid grid-cols-2 gap-2">
        {THEMES_META.map((theme) => {
          const isActive = theme.id === activeThemeId;
          const isSaving = pending === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => theme.available && handleSelect(theme.id)}
              disabled={!theme.available || isSaving}
              className={`relative flex flex-col rounded border-2 overflow-hidden transition-all text-left ${
                isActive
                  ? "border-neutral-900"
                  : theme.available
                  ? "border-neutral-200 hover:border-neutral-400 cursor-pointer"
                  : "border-neutral-100 cursor-not-allowed opacity-60"
              }`}
            >
              {/* Preview */}
              <div className="w-full aspect-[4/3] overflow-hidden">
                <ThemePreview themeId={theme.id} />
              </div>

              {/* Label */}
              <div className="px-2 py-1.5 bg-white border-t border-neutral-100">
                <p className="text-[11px] font-semibold text-neutral-800 leading-none">
                  {theme.name}
                </p>
                {!theme.available && (
                  <p className="text-[9px] text-neutral-400 mt-0.5">Coming soon</p>
                )}
              </div>

              {/* Active checkmark */}
              {isActive && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-neutral-900 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Saving spinner */}
              {isSaving && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
