"use client";

import { useState } from "react";

export function useAnalyticsSession(): string {
  const [sessionId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const key = "_msid";
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  });
  return sessionId;
}
