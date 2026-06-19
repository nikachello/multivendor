"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth/client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 8) return "weak";
    if (password.length < 12 || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) return "fair";
    return "strong";
  })();

  const strengthConfig = {
    weak:   { label: "Weak",   color: "bg-red-400",    width: "w-1/3" },
    fair:   { label: "Fair",   color: "bg-yellow-400", width: "w-2/3" },
    strong: { label: "Strong", color: "bg-green-500",  width: "w-full" },
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
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
              Your store, your rules.
            </p>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Set up your products, categories, and storefront in minutes. No code required.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-zinc-400">
            {["Full product & variant management", "Custom storefront themes", "Category & navigation editor"].map((f) => (
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
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-zinc-500">
              Start building your store today.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium tracking-widest uppercase text-zinc-500">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                autoFocus
                className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-sm"
                placeholder="Jane Smith"
              />
            </div>

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
                className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-sm"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium tracking-widest uppercase text-zinc-500">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full border border-zinc-200 px-3 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-sm"
                  placeholder="Min. 8 characters"
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

              {/* Password strength */}
              {passwordStrength && (
                <div className="space-y-1">
                  <div className="h-0.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strengthConfig[passwordStrength].color} ${strengthConfig[passwordStrength].width}`} />
                  </div>
                  <p className={`text-[10px] tracking-wide ${
                    passwordStrength === "weak" ? "text-red-400" :
                    passwordStrength === "fair" ? "text-yellow-500" : "text-green-600"
                  }`}>
                    {strengthConfig[passwordStrength].label} password
                  </p>
                </div>
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
              disabled={loading}
              className="w-full py-2.5 text-[11px] tracking-widest uppercase font-medium bg-zinc-900 text-white hover:bg-zinc-700 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-[10px] text-center text-zinc-400 leading-relaxed">
              By creating an account, you agree to our{" "}
              <span className="text-zinc-600 hover:underline cursor-pointer underline-offset-4">Terms of Service</span>{" "}
              and{" "}
              <span className="text-zinc-600 hover:underline cursor-pointer underline-offset-4">Privacy Policy</span>.
            </p>
          </form>

          <p className="text-[11px] text-center text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-zinc-900 font-medium hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
