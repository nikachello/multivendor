"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    fetch("/api/log-client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "reactBoundary",
        message: error.message,
        stack: error.stack,
        digest: error.digest ?? null,
        route: typeof window !== "undefined" ? window.location.pathname : "unknown",
      }),
      keepalive: true,
    }).catch(() => {});
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-6 text-center">
      <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
        Error
      </p>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-3">
        Something went wrong
      </h1>
      <p className="text-sm text-neutral-500 mb-8 max-w-sm">
        {error.message || "An unexpected error occurred in the dashboard."}
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
