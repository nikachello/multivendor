"use client";

import { useRouter } from "next/navigation";

export default function CreatorBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      className="flex items-center gap-1.5 text-sm text-[var(--creator-muted)] hover:text-[var(--creator-on-surface)] transition-colors mb-5"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
      Back
    </button>
  );
}
