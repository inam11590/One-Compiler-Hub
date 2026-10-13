import React from "react";
import type { Metadata } from "next";
import { Database, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ToolsGrid } from "@/components/tools-grid";

export const metadata: Metadata = {
  title: "Online SQL & NoSQL Database Playgrounds — OneCompilerHub",
  description:
    "Practice and test database queries for MySQL, PostgreSQL, MongoDB, and PL/SQL on OneCompilerHub.",
  alternates: {
    canonical: "https://one-compiler-hub.vercel.app/databases",
  },
};

export default function DatabasesPage() {
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

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Database className="w-4 h-4" />
              <span>Databases</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Relational &amp; Document Databases
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Explore SQL queries, database indexing, stored procedures, and document schemas across MySQL, PostgreSQL, MongoDB, and PL/SQL.
            </p>
          </div>
        </section>

        {/* Filtered Tools Grid pre-filtered to "database" */}
        <ToolsGrid activeCategoryFilter="database" />
      </main>

      <Footer />
    </div>
  );
}
