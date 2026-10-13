"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  Square,
  Save,
  Download,
  Upload,
  Share2,
  Maximize2,
  Minimize2,
  Settings,
  ChevronDown,
  Sparkles,
  Info,
  Check,
} from "lucide-react";
import { ProgrammingTool } from "@/types";
import { PROGRAMMING_TOOLS } from "@/data/tools";
import { ToolIcon } from "@/components/tool-icons";

interface TopToolbarProps {
  projectName: string;
  currentTool: ProgrammingTool;
  onToolChange: (tool: ProgrammingTool) => void;
  onSave: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onOpenSettings: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isSaving?: boolean;
}

export function TopToolbar({
  projectName,
  currentTool,
  onToolChange,
  onSave,
  onExport,
  onImport,
  onOpenSettings,
  isFullscreen,
  onToggleFullscreen,
  isSaving,
}: TopToolbarProps) {
  const [toolMenuOpen, setToolMenuOpen] = useState(false);
  const [showExecutionNotice, setShowExecutionNotice] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = "";
    }
  };

  return (
    <div className="h-12 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-750 px-3 flex items-center justify-between select-none z-20 shrink-0">
      {/* Left: Brand / Project Title & Environment Selector */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white hover:text-brand-500 transition-colors mr-1"
        >
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white text-[10px]">
            1C
          </div>
          <span className="hidden sm:inline">OneCompilerHub</span>
        </Link>

        <span className="text-slate-300 dark:text-navy-700 hidden sm:inline">/</span>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setToolMenuOpen(!toolMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200/80 dark:hover:bg-navy-750 text-slate-900 dark:text-white text-xs font-semibold border border-slate-200 dark:border-navy-700 transition-colors"
          >
            <ToolIcon name={currentTool.iconName} className="w-3.5 h-3.5" />
            <span>{currentTool.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {toolMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setToolMenuOpen(false)}
              />
              <div className="absolute left-0 mt-1 w-56 max-h-72 overflow-y-auto bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-xl shadow-xl z-40 p-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Environment (18 Tools)
                </div>
                {PROGRAMMING_TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      onToolChange(tool);
                      setToolMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      tool.id === currentTool.id
                        ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800"
                    }`}
                  >
                    <ToolIcon name={tool.iconName} className="w-3.5 h-3.5" />
                    <span className="flex-1 truncate">{tool.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{tool.fileExtension}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Project Name Breadcrumb */}
        <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline truncate max-w-[180px]">
          {projectName}
        </span>
      </div>

      {/* Center: Execution Buttons (Disabled in Step 3 as requested) */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowExecutionNotice(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/40 text-emerald-300/80 hover:bg-emerald-600/50 cursor-pointer text-xs font-semibold shadow-sm transition-all border border-emerald-500/30"
            title="Remote code execution scheduled for Step 4"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-950/60 text-emerald-300 font-normal ml-0.5">
              Step 4
            </span>
          </button>
        </div>

        <button
          type="button"
          disabled
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-400 dark:text-slate-500 text-xs font-medium cursor-not-allowed border border-slate-200 dark:border-navy-700"
          title="Stop execution (active only during remote runs in Step 4)"
        >
          <Square className="w-3 h-3 fill-current" />
          <span className="hidden sm:inline">Stop</span>
        </button>
      </div>

      {/* Right: Save, Import/Export, Share, Settings, Fullscreen */}
      <div className="flex items-center gap-1">
        {/* Save button */}
        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-navy-700 transition-colors"
          title="Save project to browser storage"
        >
          <Save className="w-3.5 h-3.5 text-brand-500" />
          <span className="hidden lg:inline">{isSaving ? "Saving..." : "Save"}</span>
        </button>

        {/* Export JSON */}
        <button
          type="button"
          onClick={onExport}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          title="Export project as JSON"
          aria-label="Export project"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* Import JSON */}
        <label
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors cursor-pointer"
          title="Import project from JSON"
          aria-label="Import project"
        >
          <Upload className="w-3.5 h-3.5" />
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>

        {/* Share Link */}
        <button
          type="button"
          onClick={handleShare}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          title="Share workspace link"
          aria-label="Share workspace link"
        >
          {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
        </button>

        {/* Settings Modal Toggle */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          title="IDE Settings"
          aria-label="Open settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Execution Modal Notice for Step 3 */}
      {showExecutionNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-xs space-y-4">
            <div className="flex items-center gap-2.5 text-amber-500 font-bold text-sm">
              <Sparkles className="w-5 h-5" />
              <span>Step 3 IDE Architecture Status</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
              You are currently in <strong>Step 3: Professional Online IDE & Monaco Coding Workspace</strong>.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-750 space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
              <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-brand-500" />
                What is fully functional in Step 3:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Monaco Editor with full syntax highlighting across 18 languages</li>
                <li>Frontend File Explorer (create, rename, delete files & folders)</li>
                <li>Multiple tabs, unsaved dirty state, and tab switching</li>
                <li>Persistent storage with browser IndexedDB + localStorage fallback</li>
                <li>Project JSON export & import</li>
                <li>Configurable IDE preferences (font size, wrap, minimap)</li>
              </ul>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Real remote compiler container execution, native interactive shells, and execution backends will be connected in <strong>Step 4</strong>.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowExecutionNotice(false)}
                className="px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
