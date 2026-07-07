"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signUp } from "@/lib/auth/client";
import { useT } from "@/i18n/context";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 8) return "weak";
    if (password.length < 12 || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) return "fair";
    return "strong";
  })();

  const strengthConfig = {
    weak:   { color: "bg-red-400",    width: "w-1/3" },
    fair:   { color: "bg-yellow-400", width: "w-2/3" },
    strong: { color: "bg-green-500",  width: "w-full" },
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError(t("auth.register.name_required"));
      return;
    }
    if (!email.includes("@")) {
      setError(t("auth.invalid_email"));
      return;
    }
    if (password.length < 8) {
      setError(t("auth.password_min"));
      return;
    }

    setLoading(true);
    const result = await signUp.email({
      name,
      email,
      password,
      callbackURL: "/dashboard",
    });
    setLoading(false);

    if (result?.error) {
      setError(result.error.message ?? "Something went wrong. Please try again.");
    } else if (!result?.data?.token) {
      setVerificationSent(true);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-12">
        <div className="text-white text-sm font-semibold tracking-widest uppercase">
          MultiStore
        </div>
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-zinc-200 text-2xl font-light leading-snug">
              {t("auth.register.panel_title")}
            </p>
            <p className="text-zinc-500 text-sm leading-relaxed">
              {t("auth.register.panel_desc")}
            </p>
          </div>
          <ul className="space-y-3 text-sm text-zinc-400">
            {[t("auth.register.feature_1"), t("auth.register.feature_2"), t("auth.register.feature_3")].map((f) => (
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
        {verificationSent ? (
          <div className="w-full max-w-sm space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-zinc-900">{t("auth.register.verify_title")}</h2>
            <p className="text-sm text-zinc-500">
              {t("auth.register.verify_desc", { email })}
            </p>
            <p className="text-xs text-zinc-400">{t("auth.register.verify_spam")}</p>
          </div>
        ) : (
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
              {t("auth.register.title")}
            </h1>
            <p className="text-sm text-zinc-500">
              {t("auth.register.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => signIn.social({ provider: "google", callbackURL: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 border border-zinc-200 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors rounded-sm"
          >
            <GoogleIcon />
            {t("auth.google")}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-100" />
            <span className="text-[11px] text-zinc-400">{t("auth.or")}</span>
            <div className="flex-1 h-px bg-zinc-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium tracking-widest uppercase text-zinc-500">
                {t("auth.register.name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                autoFocus
                className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-sm"
                placeholder={t("auth.register.name_placeholder")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium tracking-widest uppercase text-zinc-500">
                {t("auth.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-sm"
                placeholder={t("auth.register.email_placeholder")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium tracking-widest uppercase text-zinc-500">
                {t("auth.password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full border border-zinc-200 px-3 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-sm"
                  placeholder={t("auth.register.password_placeholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>

              {passwordStrength && (
                <div className="space-y-1">
                  <div className="h-0.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strengthConfig[passwordStrength].color} ${strengthConfig[passwordStrength].width}`} />
                  </div>
                  <p className={`text-[10px] tracking-wide ${
                    passwordStrength === "weak" ? "text-red-400" :
                    passwordStrength === "fair" ? "text-yellow-500" : "text-green-600"
                  }`}>
                    {t(`auth.register.strength_${passwordStrength}`)}
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div role="alert" className="flex items-center gap-2 text-[11px] text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-sm">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-[11px] tracking-widest uppercase font-medium bg-zinc-900 text-white hover:bg-zinc-700 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("auth.register.submitting") : t("auth.register.submit")}
            </button>

            <p className="text-[10px] text-center text-zinc-400 leading-relaxed">
              {t("auth.register.terms")}{" "}
              <span className="text-zinc-600 hover:underline cursor-pointer underline-offset-4">{t("auth.register.terms_tos")}</span>{" "}
              {t("auth.register.terms_and")}{" "}
              <span className="text-zinc-600 hover:underline cursor-pointer underline-offset-4">{t("auth.register.terms_privacy")}</span>.
            </p>
          </form>

          <p className="text-[11px] text-center text-zinc-400">
            {t("auth.register.have_account")}{" "}
            <Link href="/login" className="text-zinc-900 font-medium hover:underline underline-offset-4">
              {t("auth.register.sign_in")}
            </Link>
          </p>
        </div>
        )}
      </div>
    </div>
  );
}
