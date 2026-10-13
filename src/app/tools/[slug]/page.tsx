import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ChevronRight,
  Home,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Terminal,
  Clock,
  Play,
} from "lucide-react";
import { PROGRAMMING_TOOLS, getToolBySlug, getRelatedTools } from "@/data/tools";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ToolIcon } from "@/components/tool-icons";
import { Workspace } from "@/components/workspace";

interface ToolPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return PROGRAMMING_TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return {
      title: "Tool Not Found — OneCompilerHub",
      description: "The requested programming environment could not be found.",
    };
  }

  const title = `${tool.name} Online Playground & Docs — OneCompilerHub`;
  const description = `${tool.shortDescription} Explore features, starter code, and interactive developer workspace for ${tool.name}.`;
  const canonicalUrl = `https://one-compiler-hub.vercel.app/tools/${tool.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "OneCompilerHub",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    notFound();
  }

  const relatedTools = getRelatedTools(tool);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-navy-900 transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="bg-slate-50 dark:bg-navy-950/70 border-b border-slate-200 dark:border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Link
                href="/"
                className="hover:text-brand-500 flex items-center gap-1 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link
                href="/#tools"
                className="hover:text-brand-500 transition-colors capitalize"
              >
                {tool.category} Tools
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900 dark:text-white">
                {tool.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Hero Banner for Tool */}
        <section className="relative py-12 sm:py-16 bg-gradient-to-b from-slate-50/50 to-white dark:from-navy-950/50 dark:to-navy-900 border-b border-slate-200/80 dark:border-navy-800 overflow-hidden">
          {/* Subtle Accent Glow */}
          <div
            className="absolute -top-24 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ backgroundColor: tool.accentColor }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Column: Icon + Name + Description */}
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 flex items-center justify-center p-3 sm:p-4 shadow-lg shrink-0">
                  <ToolIcon name={tool.iconName} className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                      {tool.category}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Demo Workspace Active
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400">
                      .{tool.fileExtension}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {tool.name}
                  </h1>

                  <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    {tool.longDescription}
                  </p>
                </div>
              </div>

              {/* Right Column: Quick Navigation Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/editor/${tool.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-brand-500 hover:bg-brand-600 shadow-md shadow-brand-500/25 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Open Playground</span>
                </Link>

                <Link
                  href="/#tools"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-850 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                >
                  <span>All 18 Tools</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights & Beginner Guide */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Features (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Core Capabilities
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Why Developers Choose {tool.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tool.features.map((feat, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-slate-200 dark:border-navy-750 bg-slate-50/50 dark:bg-navy-850/60 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {feat}
                    </p>
                  </div>
                ))}
              </div>

              {/* Step 2 Roadmap Callout */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold mb-0.5">Execution Status: Frontend Sandbox</div>
                  <p className="leading-relaxed">
                    You can test code syntax and formatting in the Monaco editor below. Isolated containerized compilers for <strong>{tool.name}</strong> will be implemented in Step 3.
                  </p>
                </div>
              </div>
            </div>

            {/* Beginner-Friendly Explanation (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-navy-750 bg-slate-50 dark:bg-navy-850 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-600 dark:text-accent-400 uppercase tracking-wider mb-2">
                  <BookOpen className="w-4 h-4" />
                  Beginner-Friendly Guide
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Getting Started with {tool.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {tool.beginnerExplanation}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-navy-800 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">File Extension:</span>{" "}
                <code className="font-mono bg-white dark:bg-navy-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-navy-700">
                  .{tool.fileExtension}
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Embedded Interactive Coding Workspace */}
        <div className="border-t border-slate-200 dark:border-navy-800 bg-slate-50/40 dark:bg-navy-950/40 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-brand-500" />
              <span>Interactive {tool.name} Workspace Preview</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Edit the sample snippet, test themes, or simulate execution right here.
            </p>
          </div>

          <Workspace selectedTool={tool} />
        </div>

        {/* Related Tools Section */}
        {relatedTools.length > 0 && (
          <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-navy-800">
            <div className="mb-8">
              <div className="text-xs uppercase font-bold text-brand-500 tracking-wider mb-1">
                Complementary Stack
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Related Technologies
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTools.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/tools/${rel.slug}`}
                  className="group p-5 rounded-2xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 hover:border-brand-500 hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                      <ToolIcon name={rel.iconName} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                        {rel.name}
                      </div>
                      <div className="text-[10px] uppercase font-semibold text-slate-400">
                        {rel.category}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {rel.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
