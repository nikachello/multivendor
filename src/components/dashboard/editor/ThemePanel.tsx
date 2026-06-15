"use client";

import { useEffect, useRef, useState } from "react";
import { saveTheme, ThemeData } from "@/lib/actions/theme";
import { toast } from "sonner";

const FONT_OPTIONS = [
  { value: "sans", label: "Sans-serif" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Monospace" },
];

const RADIUS_OPTIONS = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

type Props = {
  shopId: string;
  initialTheme: ThemeData;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
};

export default function ThemePanel({ shopId, initialTheme, iframeRef }: Props) {
  const [theme, setTheme] = useState<ThemeData>(initialTheme);
  const latestTheme = useRef<ThemeData>(initialTheme);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function update(key: keyof ThemeData, value: string) {
    const next = { ...latestTheme.current, [key]: value };
    latestTheme.current = next;
    setTheme(next);

    iframeRef.current?.contentWindow?.postMessage({ type: "UPDATE_THEME", theme: next }, "*");

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const result = await saveTheme(shopId, latestTheme.current);
      if (result && !result.ok) toast.error("Failed to save theme");
    }, 800);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Primary color */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
          Primary Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => update("primaryColor", e.target.value)}
            className="w-10 h-10 rounded border border-neutral-200 cursor-pointer p-0.5"
          />
          <span className="text-sm font-mono text-neutral-500">{theme.primaryColor}</span>
        </div>
      </div>

      {/* Secondary color */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
          Secondary Color
        </label>
        <p className="text-xs text-neutral-400 -mt-1">Text on primary backgrounds</p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={theme.secondaryColor}
            onChange={(e) => update("secondaryColor", e.target.value)}
            className="w-10 h-10 rounded border border-neutral-200 cursor-pointer p-0.5"
          />
          <span className="text-sm font-mono text-neutral-500">{theme.secondaryColor}</span>
        </div>
      </div>

      {/* Page background */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
          Page Background
        </label>
        <p className="text-xs text-neutral-400 -mt-1">Overall page color</p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={theme.pageBackground}
            onChange={(e) => update("pageBackground", e.target.value)}
            className="w-10 h-10 rounded border border-neutral-200 cursor-pointer p-0.5"
          />
          <span className="text-sm font-mono text-neutral-500">{theme.pageBackground}</span>
        </div>
      </div>

      {/* Font */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
          Font
        </label>
        <select
          value={theme.fontFamily}
          onChange={(e) => update("fontFamily", e.target.value)}
          className="border border-neutral-200 px-3 py-2 text-sm text-neutral-700 outline-none focus:border-neutral-400 transition-colors"
        >
          {FONT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Border radius */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
          Border Radius
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {RADIUS_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => update("borderRadius", o.value)}
              className={`py-2 text-xs border transition-colors ${
                theme.borderRadius === o.value
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview swatch */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
          Preview
        </label>
        <div
          className="w-full p-4 transition-all"
          style={{ backgroundColor: theme.pageBackground, borderRadius: "4px", border: "1px solid #e5e5e5" }}
        >
          <p className="text-xs text-neutral-400 mb-2">Page background</p>
          <div
            className="w-full py-3 text-center text-sm font-medium transition-all"
            style={{
              backgroundColor: theme.primaryColor,
              color: theme.secondaryColor,
              borderRadius: { none: "0px", sm: "4px", md: "8px", lg: "16px" }[theme.borderRadius] ?? "0px",
            }}
          >
            Button preview
          </div>
        </div>
      </div>
    </div>
  );
}
