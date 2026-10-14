"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { isConfigured } = getSupabaseEnv();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    const errorParam = searchParams.get("error");
    const msgParam = searchParams.get("message");
    if (errorParam === "token_invalid_or_expired") {
      return msgParam || "Your verification or reset link has expired. Please request a new one.";
    }
    if (errorParam === "supabase_not_configured") {
      return "Supabase credentials have not been configured yet. Please check your environment variables.";
    }
    if (msgParam) return msgParam;
    return null;
  });

  const resetSuccess = searchParams.get("reset") === "success";

  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (!isConfigured) {
      setErrorMessage(
        "Supabase credentials are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment."
      );
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          setErrorMessage("Invalid email or password. Please verify your credentials and try again.");
        } else if (error.message.toLowerCase().includes("email not confirmed")) {
          setErrorMessage(
            "Your email address has not been verified yet. Please check your inbox for the confirmation link."
          );
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      if (data.user) {
        // Safe redirect: ensure returnUrl is relative and not an open redirect
        let target = "/dashboard";
        if (
          returnUrl.startsWith("/") &&
          !returnUrl.startsWith("//") &&
          !returnUrl.includes("://")
        ) {
          target = returnUrl;
        }

        router.push(target);
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred during sign in.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/20 overflow-hidden">
      {/* Top decorative gradient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Welcome Back
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign in to your account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Access your workspaces, recent coding sessions, and developer profile.
        </p>
      </div>

      {/* Success banner if redirected from reset password */}
      {resetSuccess && (
        <div
          role="status"
          className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
          <div>
            <p className="font-semibold">Password Reset Successful</p>
            <p className="mt-0.5">Your password has been updated. You can now log in with your new credentials.</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <div>
            <p className="font-semibold">Authentication Error</p>
            <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 hover:from-brand-500 hover:to-accent-600 active:scale-[0.99] transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          Create one now
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-brand-500/20">
      {/* Top Bar */}
      <header className="w-full border-b border-slate-200/80 dark:border-navy-800 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              Need an account?
            </span>
            <Link
              href="/signup"
              className="text-xs sm:text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 px-3.5 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              Sign Up
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <Suspense
            fallback={
              <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 rounded-2xl p-8 shadow-xl flex items-center justify-center min-h-[350px]">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/60 dark:border-navy-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} OneCompilerHub. All rights reserved.
      </footer>
    </div>
  );
}
