import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Compass,
  Sparkles,
  BookOpen,
  ArrowRight,
  Code2,
  Globe,
  Database,
  Layers,
} from "lucide-react";
import {
  PROGRAMMING_TOOLS,
  getFeaturedTools,
  getPopularTools,
  getBeginnerTools,
} from "@/data/tools";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ToolIcon } from "@/components/tool-icons";
import { getBreadcrumbJsonLd, getCanonicalUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Explore Developer Tools & Learning Stacks — OneCompilerHub",
  description:
    "Discover featured languages, popular web stacks, beginner-friendly starting points, and databases curated by our editorial team.",
  alternates: {
    canonical: getCanonicalUrl("/explore"),
  },
  openGraph: {
    title: "Explore Developer Tools & Learning Stacks — OneCompilerHub",
    description:
      "Discover featured languages, popular web stacks, beginner-friendly starting points, and databases curated by our editorial team.",
    url: getCanonicalUrl("/explore"),
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Developer Tools & Learning Stacks — OneCompilerHub",
    description:
      "Discover featured languages, popular web stacks, beginner-friendly starting points, and databases curated by our editorial team.",
  },
};

export default function ExplorePage() {
  const featured = getFeaturedTools();
  const popular = getPopularTools();
  const beginner = getBeginnerTools();

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
  ]);

  const categories = [
    {
      title: "Programming Languages",
      desc: "Core systems, algorithms, enterprise apps, and scripting engines.",
      icon: <Code2 className="w-6 h-6 text-brand-500" />,
      href: "/compilers",
      count: PROGRAMMING_TOOLS.filter((t) => t.category === "programming").length,
    },
    {
      title: "Web Development",
      desc: "Client interfaces, styling, asynchronous scripting, and web runtimes.",
      icon: <Globe className="w-6 h-6 text-accent-500" />,
      href: "/web-development",
      count: PROGRAMMING_TOOLS.filter((t) => t.category === "web").length,
    },
    {
      title: "Databases",
      desc: "Relational SQL stores, document NoSQL, and procedural query logic.",
      icon: <Database className="w-6 h-6 text-sky-500" />,
      href: "/databases",
      count: PROGRAMMING_TOOLS.filter((t) => t.category === "database").length,
    },
    {
      title: "Frameworks & Engines",
      desc: "Microservices, UI component libraries, and 2D game loops.",
      icon: <Layers className="w-6 h-6 text-emerald-500" />,
      href: "/#tools",
      count: PROGRAMMING_TOOLS.filter((t) => t.category === "framework").length,
    },
  ];

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
        {/* Header Hero */}
        <section className="relative py-16 sm:py-20 bg-slate-50/60 dark:bg-navy-950/60 border-b border-slate-200/80 dark:border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Compass className="w-4 h-4" />
              <span>Editorial Curations</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Developer Stacks
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Find the ideal technology for your next project, course, or programming experiment.
            </p>
          </div>
        </section>

        {/* Category Architecture Cards */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group p-6 rounded-2xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 hover:border-brand-500 hover:shadow-card-hover transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {c.icon}
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                  {c.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {c.desc}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs font-semibold text-brand-500">
                  <span>{c.count} Technologies</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 1: Featured Technologies */}
        <section className="py-12 bg-slate-50/40 dark:bg-navy-950/40 border-y border-slate-200/60 dark:border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Technologies
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Modern Full-Stack Highlights
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((tool) => (
                <div
                  key={tool.id}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 flex flex-col justify-between hover:shadow-card-hover transition-all"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 flex items-center justify-center p-2.5">
                        <ToolIcon name={tool.iconName} className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {tool.name}
                        </h3>
                        <span className="text-[10px] uppercase font-semibold text-slate-400">
                          {tool.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
                      {tool.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-400">.{tool.fileExtension}</span>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-brand-500 hover:underline"
                    >
                      <span>Explore {tool.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Beginner-Friendly Starting Points */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              Friendly Starting Points
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Recommended for Beginners
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Languages and frameworks with gentle learning curves and high immediate rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beginner.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group p-5 rounded-2xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 hover:border-emerald-500/50 hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 flex items-center justify-center p-2">
                    <ToolIcon name={tool.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {tool.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Beginner Friendly
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {tool.beginnerExplanation}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Popular Languages */}
        <section className="py-16 bg-slate-50/50 dark:bg-navy-950/50 border-t border-slate-200/80 dark:border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-600 dark:text-accent-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Industry Standards
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Most Popular Environments
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {popular.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="p-4 rounded-xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 text-center hover:border-brand-500 hover:shadow-card-hover transition-all group flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200/80 dark:border-navy-750 flex items-center justify-center p-2.5 mb-2 group-hover:scale-110 transition-transform">
                    <ToolIcon name={tool.iconName} className="w-7 h-7" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                    {tool.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    .{tool.fileExtension}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
