"use client";

import React from "react";
import { Database, Check, Clock, Code2, ShieldCheck } from "lucide-react";

interface StatusBarProps {
  cursorPosition: { line: number; column: number };
  language: string;
  isSaving: boolean;
  fileCount: number;
  wordCount: number;
}

export function StatusBar({
  cursorPosition,
  language,
  isSaving,
  fileCount,
  wordCount,
}: StatusBarProps) {
  return (
    <footer
      aria-label="Editor Status Bar"
      className="h-6 bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-navy-800 px-3 flex items-center justify-between text-[11px] font-mono select-none shrink-0 z-10 transition-colors"
    >
      {/* Left side items */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <Database className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="hidden sm:inline text-slate-500 dark:text-slate-400">IndexedDB</span>
          {isSaving ? (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              <Clock className="w-2.5 h-2.5 animate-spin" />
              <span>Saving...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <Check className="w-2.5 h-2.5" />
              <span>Synced</span>
            </span>
          )}
        </div>

        <span className="text-slate-300 dark:text-navy-750">|</span>

        <span className="text-slate-500 dark:text-slate-400">
          {fileCount} {fileCount === 1 ? "file" : "files"}
        </span>

        <span className="text-slate-300 dark:text-navy-750 hidden md:inline">|</span>

        <span className="text-slate-500 dark:text-slate-400 hidden md:inline">
          {wordCount} words
        </span>

        <span className="text-slate-300 dark:text-navy-750 hidden lg:inline">|</span>

        <div className="hidden lg:flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-3 h-3" />
          <span>Sandbox Ready</span>
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-2.5">
        <span className="text-slate-600 dark:text-slate-300">
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </span>

        <span className="text-slate-300 dark:text-navy-750">|</span>

        <span className="hidden sm:inline text-slate-500 dark:text-slate-400">UTF-8</span>

        <span className="text-slate-300 dark:text-navy-750 hidden sm:inline">|</span>

        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-semibold">
          <Code2 className="w-3 h-3 text-brand-500" />
          <span className="capitalize">{language}</span>
        </div>
      </div>
    </footer>
  );
}
