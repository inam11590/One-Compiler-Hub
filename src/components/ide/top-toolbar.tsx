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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600/20 text-brand-300 hover:bg-brand-600/30 cursor-pointer text-xs font-semibold shadow-sm transition-all border border-brand-500/40"
            title="Execution Backend & Sandbox Architecture Status"
          >
            <Play className="w-3.5 h-3.5 fill-current text-brand-400" />
            <span>Run</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-950/80 text-brand-300 font-mono ml-0.5 border border-brand-700/50">
              Sandbox
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

      {/* Execution Modal Notice for Step 5 */}
      {showExecutionNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-xs space-y-4">
            <div className="flex items-center gap-2.5 text-brand-500 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <span>Step 5: Backend Execution API & Sandbox Architecture</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
              Target environment: <strong>{currentTool.name}</strong> ({currentTool.category}).
            </p>
            <div className="p-3 bg-slate-50 dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-750 space-y-2 text-slate-600 dark:text-slate-300 text-[11px]">
              <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-brand-500" />
                Backend Security & Sandbox Architecture (Step 5):
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>FastAPI execution backend established with versioned REST contracts (<code>/api/v1</code>)</li>
                <li>Centralized Language Registry configured for all 18 tools</li>
                <li>Cryptographic Supabase JWT token verification & sliding-window rate limits</li>
                <li>7-layer sandbox threat model: non-root execution, cgroups v2 resource quotas, read-only root filesystems, and zero cloud metadata access</li>
                <li>Mock worker strictly forbidden from running in production environments</li>
              </ul>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] leading-relaxed">
              <strong>Production Safety Guard:</strong> Arbitrary code execution is intentionally disabled in production pending dedicated microVM / gVisor sandbox verification. OneCompilerHub does not fabricate fake compilation results.
            </div>
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
