"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wasReset = searchParams.get("reset") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const result = await signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });
    setLoading(false);

    if (result?.error) {
      if (result.error.status === 403) {
        setError("Please verify your email first. Check your inbox for a verification link.");
      } else {
        setError("Invalid email or password.");
      }
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">Welcome back</h1>
        <p className="text-sm text-zinc-500">Sign in to your account to continue.</p>
      </div>

      {wasReset && (
        <div className="bg-green-50 border border-green-100 px-3 py-2.5 rounded-sm text-[11px] text-green-700">
          Password updated — sign in with your new password.
        </div>
      )}

      <button
        type="button"
        onClick={() => signIn.social({ provider: "google", callbackURL: "/dashboard" })}
        className="w-full flex items-center justify-center gap-3 border border-zinc-200 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors rounded-sm"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-100" />
        <span className="text-[11px] text-zinc-400">or</span>
        <div className="flex-1 h-px bg-zinc-100" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium tracking-widest uppercase text-zinc-500">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
            className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-sm"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium tracking-widest uppercase text-zinc-500">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-zinc-200 px-3 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
              tabIndex={-1}
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
          disabled={loading}
          className="w-full py-2.5 text-[11px] tracking-widest uppercase font-medium bg-zinc-900 text-white hover:bg-zinc-700 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-[11px] text-center text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-zinc-900 font-medium hover:underline underline-offset-4">
          Create one
        </Link>
      </p>
    </div>
  );
}

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

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-12">
        <div className="text-white text-sm font-semibold tracking-widest uppercase">
          MultiStore
        </div>
        <blockquote className="space-y-2">
          <p className="text-zinc-300 text-sm leading-relaxed">
            "Building our store took a weekend. The platform handles everything — products, categories, navigation — so we can focus on selling."
          </p>
          <footer className="text-zinc-500 text-xs tracking-wide">
            — Sarah K., founder of Maison Blanche
          </footer>
        </blockquote>
      </div>

      <div className="flex flex-col items-center justify-center px-8 py-12 bg-white">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
