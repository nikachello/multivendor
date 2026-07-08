"use client";

import { useEffect } from "react";

async function reportClientError(data: Record<string, unknown>) {
  try {
    await fetch("/api/log-client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      keepalive: true,
    });
  } catch {
    // swallow — logging must never break the app
  }
}

export function GlobalErrorReporter() {
  useEffect(() => {
    const onError = (e: ErrorEvent) =>
      reportClientError({
        type: "unhandledError",
        message: e.message,
        stack: (e.error as Error)?.stack,
        route: window.location.pathname,
      });

    const onUnhandledRejection = (e: PromiseRejectionEvent) =>
      reportClientError({
        type: "unhandledRejection",
        message: String(e.reason),
        stack: (e.reason as Error)?.stack,
        route: window.location.pathname,
      });

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
