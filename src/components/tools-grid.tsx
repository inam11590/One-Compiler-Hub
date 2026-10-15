"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Filter,
  ExternalLink,
  Play,
  Sparkles,
} from "lucide-react";
import { searchTools } from "@/data/tools";
import { ToolIcon } from "@/components/tool-icons";
import { ProgrammingTool, ToolCategory } from "@/types";
import { trackEvent } from "@/lib/analytics";

interface ToolsGridProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedCategory?: ToolCategory;
  onCategoryChange?: (category: ToolCategory) => void;
  onSelectToolForWorkspace?: (tool: ProgrammingTool) => void;
  activeCategoryFilter?: ToolCategory | string;
}

export function ToolsGrid({
  searchQuery = "",
  onSearchChange,
  selectedCategory = "all",
  onCategoryChange,
}: ToolsGridProps) {
  // Smart combined search + category filter
  const filteredTools = useMemo(() => {
    return searchTools(searchQuery, selectedCategory);
  }, [selectedCategory, searchQuery]);

  return (
    <section
      id="tools"
      className="py-12 sm:py-16 bg-slate-50/60 dark:bg-navy-900/40 border-y border-slate-200/60 dark:border-navy-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Programming Tool Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              All 18 Developer Tools &amp; Languages
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Select any technology to launch its dedicated online coding workspace.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <span>Showing</span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 font-bold text-slate-900 dark:text-white">
              {filteredTools.length}
            </span>
            <span>of 18 environments</span>
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
                  if (onCategoryChange) onCategoryChange("all");
                  if (onSearchChange) onSearchChange("");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-md shadow-brand-500/20"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredTools.map((tool) => {
              const isHtml = tool.slug === "html";

              return (
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
                        {isHtml ? (
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
                      href={`/editor/${tool.slug}`}
                      className="block group/title focus:outline-none"
                    >
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover/title:text-brand-500 dark:group-hover/title:text-brand-400 transition-colors flex items-center justify-between">
                        <span>{tool.name}</span>
                        <Play className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-brand-500 fill-current" />
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
                      className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
                    >
                      <span>Documentation</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    {/* Open in Editor */}
                    <Link
                      href={`/editor/${tool.slug}`}
                      onClick={() =>
                        trackEvent("tool_viewed", {
                          toolSlug: tool.slug,
                          category: tool.category,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20 active:scale-95 transition-all text-xs"
                      title={`Open ${tool.name} in Playground`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isHtml ? "Open Live IDE" : "Open Workspace"}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
