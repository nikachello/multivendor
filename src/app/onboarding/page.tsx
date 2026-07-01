"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createShop } from "@/lib/actions/shop";
import { getStorefrontUrl } from "@/lib/storefront-url";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) setSlug(toSlug(value));
  }

  function handleSlugChange(value: string) {
    setSlugEdited(true);
    setSlug(toSlug(value));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) { setError("Shop name is required."); return; }
    if (!slug.trim()) { setError("Slug is required."); return; }
    if (slug.length < 3) { setError("Slug must be at least 3 characters."); return; }

    setLoading(true);
    const result = await createShop(name.trim(), slug.trim());
    setLoading(false);

    if (!result) { setError("Something went wrong."); return; }
    if (!result.ok) { setError(result.error.message); return; }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-12">
        <div className="text-white text-sm font-semibold tracking-widest uppercase">
          MultiStore
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-zinc-200 text-2xl font-light leading-snug">
              One last step.
            </p>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Give your store a name and a URL. You can change these later from your settings.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-zinc-400">
            {[
              "Your store is live instantly",
              "Custom domain support",
              "Full control over design & content",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
              Create your store
            </h1>
            <p className="text-sm text-zinc-500">
              This takes 10 seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium tracking-widest uppercase text-zinc-500">
                Store name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                autoFocus
                className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-sm"
                placeholder="Niko Watches"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium tracking-widest uppercase text-zinc-500">
                Store URL
              </label>
              <div className="flex items-stretch border border-zinc-200 focus-within:border-zinc-900 transition-colors rounded-sm overflow-hidden">
                <span className="flex items-center px-3 bg-zinc-50 text-zinc-400 text-sm border-r border-zinc-200 whitespace-nowrap">
                  slug.
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  required
                  className="flex-1 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none bg-white font-mono"
                  placeholder="niko-watches"
                />
              </div>
              {slug && (
                <p className="text-[10px] text-zinc-400">
                  Your store will be at{" "}
                  <span className="text-zinc-700 font-mono">{getStorefrontUrl(slug)}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-[11px] text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-sm">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !name || !slug}
              className="w-full py-2.5 text-[11px] tracking-widest uppercase font-medium bg-zinc-900 text-white hover:bg-zinc-700 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create store →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
