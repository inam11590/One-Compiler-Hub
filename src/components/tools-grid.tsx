"use client";

import React, { useState, useMemo } from "react";
import { Search, ArrowRight, Sparkles, Filter, Code2, Database, Globe, Layers } from "lucide-react";
import { PROGRAMMING_TOOLS } from "@/data/tools";
import { ToolIcon } from "@/components/tool-icons";
import { ProgrammingTool, ToolCategory } from "@/types";
import { ToolDetailModal } from "@/components/tool-detail-modal";

interface ToolsGridProps {
  onSelectToolForWorkspace: (tool: ProgrammingTool) => void;
  activeCategoryFilter?: string;
}

export function ToolsGrid({ onSelectToolForWorkspace, activeCategoryFilter }: ToolsGridProps) {
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
    { label: "Programming", value: "programming", icon: <Code2 className="w-3.5 h-3.5" /> },
    { label: "Web Development", value: "web", icon: <Globe className="w-3.5 h-3.5" /> },
    { label: "Databases", value: "database", icon: <Database className="w-3.5 h-3.5" /> },
    { label: "Frameworks", value: "framework", icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  const filteredTools = useMemo(() => {
    return PROGRAMMING_TOOLS.filter((tool) => {
      // Category match
      const matchesCategory =
        selectedCategory === "all" ||
        tool.categories.includes(selectedCategory);

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.shortDescription.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.fileExtension.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
            <span>Supported Technologies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comprehensive Coding Ecosystem
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            From modern web frameworks to high-performance system runtimes and relational databases, explore our core 18 developer environments.
          </p>
        </div>

        {/* Filter Bar & Client Search Controls */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="w-full md:w-auto flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
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

          {/* Search Box */}
          <div className="w-full md:w-72 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter 18 tools..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6 px-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredTools.length}</strong> of 18 tools
          </span>
          <span className="font-mono text-[11px] text-brand-600 dark:text-brand-400">
            Click any tool to preview starter code
          </span>
        </div>

        {/* 18 Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-navy-850 rounded-2xl border border-slate-200 dark:border-navy-750 p-8">
            <Filter className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No tools found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search query or reset the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => handleCardClick(tool)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCardClick(tool);
                  }
                }}
                className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {/* Top Row: Icon + Badges */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200/80 dark:border-navy-750 flex items-center justify-center p-2.5 shadow-sm group-hover:scale-110 group-hover:bg-brand-500/10 transition-all duration-300">
                      <ToolIcon name={tool.iconName} className="w-7 h-7" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {tool.isPopular && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                          Popular
                        </span>
                      )}
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-750 text-slate-500 dark:text-slate-400">
                        .{tool.fileExtension}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                    {tool.name}
                  </h3>

                  {/* Short Description */}
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {tool.shortDescription}
                  </p>
                </div>

                {/* Bottom Row: Footer metadata & Arrow */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs">
                  <span className="capitalize text-slate-400 dark:text-slate-500 font-medium">
                    {tool.category}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-semibold text-brand-500 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                    <span>Open Playground</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
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
        onOpenWorkspace={onSelectToolForWorkspace}
      />
    </section>
  );
}
