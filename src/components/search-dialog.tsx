"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, Filter } from "lucide-react";
import { PROGRAMMING_TOOLS, searchTools } from "@/data/tools";
import { ToolIcon } from "@/components/tool-icons";
import { ProgrammingTool } from "@/types";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool?: (tool: ProgrammingTool) => void;
}

export function SearchDialog({ isOpen, onClose, onSelectTool }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const searchSuggestions = [
    { label: "Python", query: "py" },
    { label: "JavaScript & React", query: "javascript" },
    { label: "Databases", query: "database" },
    { label: "C++", query: "cpp" },
    { label: "Backend", query: "backend" },
    { label: "Web", query: "web" },
  ];

  const filtered = query.trim() ? searchTools(query, "all") : PROGRAMMING_TOOLS;

  const handleSelect = React.useCallback(
    (tool: ProgrammingTool) => {
      if (onSelectTool) {
        onSelectTool(tool);
      }
      router.push(`/tools/${tool.slug}`);
      onClose();
    },
    [onSelectTool, router, onClose]
  );

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, handleSelect]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper function to highlight match in text
  const highlightMatch = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.trim()})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-brand-500/20 text-brand-600 dark:text-brand-400 font-semibold rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="smart-search-input"
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-slate-200 dark:border-navy-700 flex items-center px-4">
          <Search className="w-5 h-5 text-brand-500 shrink-0" />
          <input
            id="smart-search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 18 tools by name, alias, keyword (e.g. 'py', 'database', 'backend')..."
            className="w-full py-4 pl-3 pr-10 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close search"
          >
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 font-mono text-[11px]">
              ESC
            </kbd>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-navy-900/60 border-b border-slate-100 dark:border-navy-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-500" /> Suggestions:
          </span>
          {searchSuggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setQuery(s.query)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-500 text-xs shrink-0 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Filter className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                No developer tools matched &ldquo;{query}&rdquo;
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Try searching for aliases like &ldquo;py&rdquo;, &ldquo;js&rdquo;, &ldquo;sql&rdquo;, &ldquo;backend&rdquo;, or &ldquo;nosql&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="px-3.5 py-1.5 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors"
              >
                Clear Search Query
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Tools ({filtered.length})</span>
                <span className="text-[10px] text-slate-400">Use ↑ ↓ arrows to navigate</span>
              </div>
              {filtered.map((tool, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleSelect(tool)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${
                      isSelected
                        ? "bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/40"
                        : "hover:bg-slate-100 dark:hover:bg-navy-800 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shrink-0">
                        <ToolIcon name={tool.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {highlightMatch(tool.name, query)}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-750 text-slate-500 dark:text-slate-400">
                            {tool.category}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-750 text-slate-400">
                            .{tool.fileExtension}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {highlightMatch(tool.shortDescription, query)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected ? (
                        <div className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                          <span className="hidden sm:inline">Open</span>
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-navy-900 border-t border-slate-200 dark:border-navy-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-navy-800 border border-slate-300 dark:border-navy-700 font-mono text-[10px]">↵ Enter</kbd> to view details</span>
          </span>
          <span className="font-mono">18 Developer Environments</span>
        </div>
      </div>
    </div>
  );
}
