"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth/client";
import { useT } from "@/i18n/context";

export default function ForgotPasswordPage() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    setLoading(false);

    if (result?.error) {
      setError(t("auth.forgot_password.error"));
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-8 bg-white">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">{t("auth.forgot_password.title")}</h1>
          <p className="text-sm text-zinc-500">
            {t("auth.forgot_password.subtitle")}
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-100 px-4 py-3 rounded-sm text-sm text-green-700">
              {t("auth.forgot_password.sent")}
            </div>
            <Link
              href="/login"
              className="block text-center text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              {t("auth.forgot_password.back_to_sign_in")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium tracking-widest uppercase text-zinc-500">
                {t("auth.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-sm"
                placeholder="you@example.com"
              />
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
              disabled={loading || !email}
              className="w-full py-2.5 text-[11px] tracking-widest uppercase font-medium bg-zinc-900 text-white hover:bg-zinc-700 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("auth.forgot_password.sending") : t("auth.forgot_password.submit")}
            </button>

            <p className="text-center">
              <Link
                href="/login"
                className="text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                {t("auth.forgot_password.back_to_sign_in")}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
