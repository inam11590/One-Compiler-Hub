"use client";

import React from "react";
import { Database, Check, Clock, Code2 } from "lucide-react";

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
    <div className="h-6 bg-brand-700 dark:bg-navy-950 text-white/90 border-t border-brand-800 dark:border-navy-750 px-3 flex items-center justify-between text-[11px] font-mono select-none shrink-0 z-10">
      {/* Left side items */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-white">
          <Database className="w-3 h-3 text-emerald-300" />
          <span>IndexedDB</span>
          {isSaving ? (
            <span className="flex items-center gap-1 text-amber-300">
              <Clock className="w-2.5 h-2.5 animate-spin" />
              <span>Saving...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-300">
              <Check className="w-2.5 h-2.5" />
              <span>Synced</span>
            </span>
          )}
        </div>

        <span className="text-white/30">|</span>

        <span className="text-white/80">
          {fileCount} {fileCount === 1 ? "file" : "files"}
        </span>

        <span className="text-white/30 hidden sm:inline">|</span>

        <span className="text-white/80 hidden sm:inline">
          {wordCount} words
        </span>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-3">
        <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>

        <span className="text-white/30">|</span>

        <span className="hidden sm:inline">UTF-8</span>

        <span className="text-white/30 hidden sm:inline">|</span>

        <div className="flex items-center gap-1 text-white">
          <Code2 className="w-3 h-3 text-brand-300" />
          <span className="capitalize">{language}</span>
        </div>
      </div>
    </div>
  );
}
