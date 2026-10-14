"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { sendPasswordReset } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await sendPasswordReset(email.trim().toLowerCase());
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(res.error || "Failed to send reset email. Please try again.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-brand-500/20">
      {/* Top Bar */}
      <header className="w-full border-b border-slate-200/80 dark:border-navy-800 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-500 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="relative bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/20 overflow-hidden">
            {/* Top decorative gradient glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-500/15 rounded-full blur-2xl pointer-events-none" />

            {submitted ? (
              /* Success State */
              <div className="text-center py-4 space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center border border-brand-500/20 shadow-inner">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Check your email
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    If an account exists for <span className="font-semibold text-slate-700 dark:text-slate-200">{email}</span>, we have sent instructions to reset your password.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-navy-900 border border-slate-200/80 dark:border-navy-750 rounded-xl p-4 text-left text-xs text-slate-600 dark:text-slate-300 space-y-2">
                  <p>
                    • Follow the link in the email within 60 minutes to choose a new password.
                  </p>
                  <p>
                    • If you don&apos;t see the message, check your spam or junk folder.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/login"
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-brand-500 hover:bg-brand-600 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <span>Return to Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              /* Request Form */
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-2">
                    <KeyRound className="w-3.5 h-3.5" />
                    Account Security
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Reset your password
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Enter the email address tied to your account and we&apos;ll send you a secure recovery link.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                    <div>
                      <p className="font-semibold">Reset Request Failed</p>
                      <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Account Email Address
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

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-brand-500 hover:bg-brand-600 active:scale-[0.99] transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending reset link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Password Reset Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  Remembered your password?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/60 dark:border-navy-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} OneCompilerHub. All rights reserved.
      </footer>
    </div>
  );
}
