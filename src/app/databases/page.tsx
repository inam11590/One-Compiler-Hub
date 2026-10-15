import React from "react";
import type { Metadata } from "next";
import { Database, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ToolsGrid } from "@/components/tools-grid";
import { getBreadcrumbJsonLd, getCanonicalUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Online SQL & NoSQL Database Playgrounds — OneCompilerHub",
  description:
    "Practice and test database queries for MySQL, PostgreSQL, MongoDB, and PL/SQL on OneCompilerHub.",
  alternates: {
    canonical: getCanonicalUrl("/databases"),
  },
  openGraph: {
    title: "Online SQL & NoSQL Database Playgrounds — OneCompilerHub",
    description:
      "Practice and test database queries for MySQL, PostgreSQL, MongoDB, and PL/SQL on OneCompilerHub.",
    url: getCanonicalUrl("/databases"),
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online SQL & NoSQL Database Playgrounds — OneCompilerHub",
    description:
      "Practice and test database queries for MySQL, PostgreSQL, MongoDB, and PL/SQL on OneCompilerHub.",
  },
};

export default function DatabasesPage() {
  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Databases", path: "/databases" },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-navy-900 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
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
              <Database className="w-4 h-4" />
              <span>Data Systems</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Databases &amp; Query Workspaces
            </h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              Write relational SQL schemas and NoSQL queries for MySQL, PostgreSQL, MongoDB, and Oracle PL/SQL.
            </p>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-12">
          <ToolsGrid selectedCategory="database" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
