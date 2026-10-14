"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Database,
  Globe,
  Layers,
  X,
  Play,
} from "lucide-react";
import { ToolCategory } from "@/types";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: ToolCategory) => void;
  onStartCoding?: () => void;
  onExploreLanguages?: () => void;
}

export function Hero({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: HeroProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories: { label: string; value: ToolCategory; icon: React.ReactNode }[] = [
    { label: "All Tools", value: "all", icon: <Layers className="w-3.5 h-3.5" /> },
    { label: "Popular", value: "popular", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: "Languages", value: "programming", icon: <Code2 className="w-3.5 h-3.5" /> },
    { label: "Web Dev", value: "web", icon: <Globe className="w-3.5 h-3.5" /> },
    { label: "Databases", value: "database", icon: <Database className="w-3.5 h-3.5" /> },
    { label: "Frameworks", value: "framework", icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  const popularChips = [
    { name: "HTML & CSS", slug: "html", tag: "Live Preview" },
    { name: "Python", slug: "python", tag: "Python 3" },
    { name: "JavaScript", slug: "javascript", tag: "ES2024" },
    { name: "C++", slug: "cpp", tag: "C++20" },
    { name: "Java", slug: "java", tag: "OpenJDK 21" },
    { name: "MySQL", slug: "mysql", tag: "SQL" },
  ];

  return (
    <section id="hero" className="relative pt-12 pb-14 sm:pt-20 sm:pb-20 overflow-hidden">
      {/* Background radial glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Highlighted brand badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-semibold tracking-wide mb-6">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>18 Online Compilers &amp; Web Playgrounds</span>
        </div>

        {/* Main Centered Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.14]">
          Code Online with{" "}
          <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            OneCompilerHub
          </span>
          .
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Write, run, and explore programming languages in one powerful developer workspace.
        </p>

        {/* Wide Language Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-500 rounded-2xl blur-md opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-brand-500/50 transition-all p-1.5 sm:p-2">
              <Search className="w-5 h-5 text-brand-500 ml-3 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search languages, tools, or stacks (e.g. Python, HTML, Java, C++)..."
                className="w-full px-3 py-2.5 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                aria-label="Search programming languages"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange("");
                    searchInputRef.current?.focus();
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg mr-1 transition-colors"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 rounded-md text-[11px] bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400 font-mono mr-2 border border-slate-200 dark:border-navy-700">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>

          {/* Quick Popular Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick launch:</span>
            {popularChips.map((chip) => (
              <Link
                key={chip.slug}
                href={`/editor/${chip.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-navy-800/80 hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200 dark:border-navy-700/80 text-slate-700 dark:text-slate-300 transition-colors font-medium"
              >
                <Play className="w-2.5 h-2.5 fill-current text-brand-500" />
                <span>{chip.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          {categories.map((cat) => {
            const active = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onCategoryChange(cat.value)}
                className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/25 scale-[1.02]"
                    : "bg-white dark:bg-navy-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-750 hover:bg-slate-100 dark:hover:bg-navy-800 hover:border-slate-300"
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Value Highlights / Trust Indicators */}
        <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-navy-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>18 Development Environments</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span>Client-Side Isolated Sandbox</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Zero Local Setup Required</span>
          </div>
        </div>
      </div>
    </section>
  );
}
