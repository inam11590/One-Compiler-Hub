import React from "react";
import type { Metadata } from "next";
import { Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ToolsGrid } from "@/components/tools-grid";

export const metadata: Metadata = {
  title: "Web Development Playgrounds & Stacks — OneCompilerHub",
  description:
    "Test modern web technologies including HTML, JavaScript, React, Node.js, and PHP in OneCompilerHub.",
  alternates: {
    canonical: "https://one-compiler-hub.vercel.app/web-development",
  },
};

export default function WebDevPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-navy-900 transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="py-12 sm:py-16 bg-slate-50/60 dark:bg-navy-950/60 border-b border-slate-200/80 dark:border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-500 mb-4 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Globe className="w-4 h-4" />
              <span>Web Development</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Web Development Playgrounds
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Build responsive frontend components and server-side runtimes with HTML, JavaScript, React, Node.js, and PHP.
            </p>
          </div>
        </section>

        {/* Filtered Tools Grid pre-filtered to "web" */}
        <ToolsGrid activeCategoryFilter="web" />
      </main>

      <Footer />
    </div>
  );
}
