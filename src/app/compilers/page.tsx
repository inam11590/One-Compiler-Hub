import React from "react";
import type { Metadata } from "next";
import { Code2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ToolsGrid } from "@/components/tools-grid";

export const metadata: Metadata = {
  title: "Online Compilers & Languages — OneCompilerHub",
  description:
    "Explore in-browser compilers and interpreters for Python, C++, Java, C#, C, PHP, and Lua on OneCompilerHub.",
  alternates: {
    canonical: "https://one-compiler-hub.vercel.app/compilers",
  },
};

export default function CompilersPage() {
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

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Code2 className="w-4 h-4" />
              <span>Programming Languages</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Online Compilers &amp; Interpreters
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Compile, write, and test systems code, algorithms, and scripts across C, C++, Python, Java, C#, and Lua.
            </p>
          </div>
        </section>

        {/* Filtered Tools Grid pre-filtered to "programming" */}
        <ToolsGrid activeCategoryFilter="programming" />
      </main>

      <Footer />
    </div>
  );
}
