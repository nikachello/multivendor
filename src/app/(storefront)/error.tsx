"use client";

import Link from "next/link";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
        Error
      </p>
      <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
        Something went wrong
      </h1>
      <p className="text-sm text-neutral-500 mb-6 max-w-sm">
        {error.message || "We couldn't load this page. Please try again."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 border border-neutral-200 text-neutral-700 text-sm font-medium hover:border-neutral-400 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
