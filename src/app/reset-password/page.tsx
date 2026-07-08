"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/auth/client";
import { useT } from "@/i18n/context";

function ResetPasswordForm() {
  const router = useRouter();
  const t = useT();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-100 px-4 py-3 rounded-sm text-sm text-red-600">
          {t("auth.reset_password.invalid_link")}
        </div>
        <Link
          href="/forgot-password"
          className="block text-center text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          {t("auth.reset_password.request_new")}
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError(t("auth.password_min"));
      return;
    }
    if (password !== confirm) {
      setError(t("auth.reset_password.mismatch"));
      return;
    }

    setLoading(true);
    const result = await resetPassword({ newPassword: password, token: token! });
    setLoading(false);

    if (result?.error) {
      setError(t("auth.reset_password.expired"));
    } else {
      router.push("/login?reset=1");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium tracking-widest uppercase text-zinc-500">
          {t("auth.reset_password.new_password_label")}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-sm"
          placeholder={t("auth.register.password_placeholder")}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-medium tracking-widest uppercase text-zinc-500">
          {t("auth.reset_password.confirm_password_label")}
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-sm"
          placeholder={t("auth.reset_password.confirm_placeholder")}
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
        disabled={loading || !password || !confirm}
        className="w-full py-2.5 text-[11px] tracking-widest uppercase font-medium bg-zinc-900 text-white hover:bg-zinc-700 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t("auth.reset_password.updating") : t("auth.reset_password.submit")}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const t = useT();
  return (
    <div className="min-h-screen flex items-center justify-center px-8 bg-white">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">{t("auth.reset_password.title")}</h1>
          <p className="text-sm text-zinc-500">{t("auth.reset_password.subtitle")}</p>
        </div>

        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
