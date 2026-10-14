import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Terms of Service — OneCompilerHub",
  description: "Terms and conditions for using OneCompilerHub online compiler and developer playground.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-brand-500/20">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-navy-800 pb-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-400 mt-1">Last updated: October 2026</p>
          </div>

          <section className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using OneCompilerHub, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">2. Developer Playground & Sandbox Usage</h2>
            <p>
              OneCompilerHub provides an online environment for writing, experimenting with, and testing code across 18 programming languages. You agree not to use the service for malicious activities, including but not limited to denial-of-service attacks, malware distribution, or unauthorized resource exploitation.
            </p>
          </section>

          <section className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">3. User Accounts & Security</h2>
            <p>
              When creating an account, you agree to provide accurate information and maintain the security of your authentication credentials. You are responsible for all activities that occur under your developer account.
            </p>
          </section>

          <section className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">4. Intellectual Property</h2>
            <p>
              You retain full ownership of all source code, projects, and snippets created within your OneCompilerHub workspaces. OneCompilerHub claims no intellectual property rights over code authored by users.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
