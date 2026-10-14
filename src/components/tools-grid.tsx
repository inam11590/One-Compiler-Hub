"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  Filter,
  Code2,
  Database,
  Globe,
  Layers,
  X,
  Play,
  ExternalLink,
} from "lucide-react";
import { searchTools } from "@/data/tools";
import { ToolIcon } from "@/components/tool-icons";
import { ProgrammingTool, ToolCategory } from "@/types";
import { ToolDetailModal } from "@/components/tool-detail-modal";

interface ToolsGridProps {
  onSelectToolForWorkspace?: (tool: ProgrammingTool) => void;
  activeCategoryFilter?: ToolCategory | string;
}

export function ToolsGrid({ onSelectToolForWorkspace, activeCategoryFilter }: ToolsGridProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>(
    (activeCategoryFilter as ToolCategory) || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState<ProgrammingTool | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Sync category filter if prop changes
  React.useEffect(() => {
    if (activeCategoryFilter) {
      setSelectedCategory(activeCategoryFilter as ToolCategory);
    }
  }, [activeCategoryFilter]);

  const categories: { label: string; value: ToolCategory; icon: React.ReactNode }[] = [
    { label: "All Tools", value: "all", icon: <Layers className="w-3.5 h-3.5" /> },
    { label: "Popular", value: "popular", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: "Programming Languages", value: "programming", icon: <Code2 className="w-3.5 h-3.5" /> },
    { label: "Web Development", value: "web", icon: <Globe className="w-3.5 h-3.5" /> },
    { label: "Databases", value: "database", icon: <Database className="w-3.5 h-3.5" /> },
    { label: "Frameworks", value: "framework", icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  // Smart combined search + category filter
  const filteredTools = useMemo(() => {
    return searchTools(searchQuery, selectedCategory);
  }, [selectedCategory, searchQuery]);

  const searchChips = [
    { label: "Python", val: "py" },
    { label: "JavaScript", val: "js" },
    { label: "C++", val: "cpp" },
    { label: "Databases", val: "database" },
    { label: "Backend", val: "backend" },
  ];

  const handleCardClick = (tool: ProgrammingTool) => {
    setSelectedTool(tool);
    setModalOpen(true);
  };

  return (
    <section id="tools" className="py-16 sm:py-24 bg-slate-50/60 dark:bg-navy-900/40 border-y border-slate-200/60 dark:border-navy-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>18 Developer Environments &amp; Tools</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comprehensive Coding Ecosystem
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Search by technology name, alias, category, or keyword across all 18 developer environments.
          </p>
        </div>

        {/* Filter Bar & Smart Client Search Controls */}
        <div className="mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? "bg-brand-500 text-white shadow-md shadow-brand-500/25"
                      : "bg-white dark:bg-navy-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-750 hover:bg-slate-100 dark:hover:bg-navy-800"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Smart Search Box */}
          <div className="w-full lg:w-80 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 18 tools (e.g. py, backend, sql)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Search Chips & Live Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 mb-8 px-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-400">Quick filters:</span>
            {searchChips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setSearchQuery(chip.val)}
                className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-850 hover:border-brand-500 hover:text-brand-500 transition-colors text-[11px]"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div>
            Showing <strong className="text-slate-900 dark:text-white">{filteredTools.length}</strong> of 18 tools
          </div>
        </div>

        {/* 18 Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-navy-850 rounded-2xl border border-slate-200 dark:border-navy-750 p-8 space-y-3">
            <Filter className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No developer tools matching &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find any tools matching your search criteria in the selected category.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-md shadow-brand-500/20"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top Row: Icon + Badges */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200/80 dark:border-navy-750 flex items-center justify-center p-2.5 shadow-sm group-hover:scale-110 group-hover:bg-brand-500/10 transition-all duration-300">
                      <ToolIcon name={tool.iconName} className="w-7 h-7" />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {tool.isPopular && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                          Popular
                        </span>
                      )}
                      {tool.slug === "html" ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Live Preview
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-700">
                          Workspace Ready
                        </span>
                      )}
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-750 text-slate-500 dark:text-slate-400">
                        .{tool.fileExtension}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="block group/title focus:outline-none"
                  >
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover/title:text-brand-500 dark:group-hover/title:text-brand-400 transition-colors">
                      {tool.name}
                    </h3>
                  </Link>

                  {/* Short Description */}
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {tool.shortDescription}
                  </p>
                </div>

                {/* Bottom Row: Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs">
                  {/* Dedicated Page Link */}
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    <span>View Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  {/* Open in Playground / Modal */}
                  <button
                    type="button"
                    onClick={() => handleCardClick(tool)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold bg-slate-100 dark:bg-navy-800 hover:bg-brand-500 hover:text-white text-slate-700 dark:text-slate-300 transition-all text-xs"
                    title={`Open ${tool.name} in Playground`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Playground</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail / Coming Soon Modal */}
      <ToolDetailModal
        tool={selectedTool}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onOpenWorkspace={(tool) => {
          if (onSelectToolForWorkspace) {
            onSelectToolForWorkspace(tool);
          } else {
            router.push(`/tools/${tool.slug}`);
          }
        }}
      />
    </section>
  );
}
