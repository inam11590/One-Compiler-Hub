"use client";

import React from "react";
import { X, Play, Clock } from "lucide-react";
import { ProgrammingTool } from "@/types";
import { ToolIcon } from "@/components/tool-icons";

interface ToolDetailModalProps {
  tool: ProgrammingTool | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenWorkspace: (tool: ProgrammingTool) => void;
}

export function ToolDetailModal({
  tool,
  isOpen,
  onClose,
  onOpenWorkspace,
}: ToolDetailModalProps) {
  if (!isOpen || !tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tool-modal-title"
      >
        {/* Glow accent */}
        <div 
          className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: tool.accentColor }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon and Name */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 flex items-center justify-center p-2.5 shadow-sm shrink-0">
            <ToolIcon name={tool.iconName} className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                {tool.category}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-750 text-slate-500 dark:text-slate-400 font-mono">
                .{tool.fileExtension}
              </span>
            </div>
            <h2 id="tool-modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">
              {tool.name}
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
          {tool.longDescription}
        </p>

        {/* Coming Soon Notice */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 mb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
            <Clock className="w-4 h-4" />
            <span>Compiler Engine Status: Step 1 UI Placeholder</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Real compiler execution containers for <strong>{tool.name}</strong> will be implemented in Step 2. You can explore the starter template in our interactive demo workspace right now.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              onOpenWorkspace(tool);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-brand-500 hover:bg-brand-600 shadow-md shadow-brand-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch in Demo Workspace</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-navy-700 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
