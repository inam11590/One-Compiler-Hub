import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy — OneCompilerHub",
  description: "Privacy policy and data handling practices of OneCompilerHub.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-brand-500/20">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-navy-800 pb-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 mt-1">Last updated: October 2026</p>
          </div>

          <section className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">1. Information We Collect</h2>
            <p>
              When you register for an account, we collect your email address, display name, and optional profile metadata (such as bio and avatar). Workspace code files in Step 3 are stored strictly in your local browser storage (IndexedDB) unless explicitly submitted.
            </p>
          </section>

          <section className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">2. How We Protect Your Data</h2>
            <p>
              Authentication is managed with encrypted session cookies and PostgreSQL Row Level Security (RLS). We never sell your personal data or expose your private profile information to third parties.
            </p>
          </section>

          <section className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">3. Cookies and Local Storage</h2>
            <p>
              We use secure, HTTP-only session cookies strictly necessary to maintain your logged-in state. Local storage and IndexedDB are used to persist editor settings and local project files.
            </p>
          </section>

          <section className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">4. Your Rights</h2>
            <p>
              You have the right to access, edit, or delete your account information at any time via your account settings page.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
