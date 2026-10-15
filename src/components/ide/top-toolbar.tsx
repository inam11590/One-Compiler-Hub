"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
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
  FileCode,
  LayoutTemplate,
  Archive,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { ProgrammingTool } from "@/types";
import { PROGRAMMING_TOOLS } from "@/data/tools";
import { ToolIcon } from "@/components/tool-icons";
import { HTML_STARTER_TEMPLATES } from "@/lib/preview/templates";

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
  // HTML Playground extensions
  onSelectTemplate?: (templateId: string) => void;
  onExportZip?: () => void;
  onExportFile?: (extension: "html" | "css" | "js") => void;
  onRunPreview?: () => void;
  onRunCode?: () => void;
  activeMobileTab?: "editor" | "preview" | "console";
  onSelectMobileTab?: (tab: "editor" | "preview" | "console") => void;
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
  onSelectTemplate,
  onExportZip,
  onExportFile,
  onRunPreview,
  onRunCode,
  activeMobileTab = "editor",
  onSelectMobileTab,
}: TopToolbarProps) {
  const [toolMenuOpen, setToolMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(null);
  const [showExecutionNotice, setShowExecutionNotice] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const isHtml = currentTool.slug === "html";

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

  const handleConfirmTemplate = () => {
    if (pendingTemplateId && onSelectTemplate) {
      onSelectTemplate(pendingTemplateId);
    }
    setPendingTemplateId(null);
  };

  return (
    <div className="h-12 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-750 px-2 sm:px-3 flex items-center justify-between select-none z-20 shrink-0">
      {/* Left: Brand / Project Title & Environment Selector */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white hover:text-brand-500 transition-colors mr-1 shrink-0"
        >
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white text-[10px]">
            1C
          </div>
          <span className="hidden md:inline">OneCompilerHub</span>
        </Link>

        <span className="text-slate-300 dark:text-navy-700 hidden sm:inline">/</span>

        {/* Language Selector Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setToolMenuOpen(!toolMenuOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200/80 dark:hover:bg-navy-750 text-slate-900 dark:text-white text-xs font-semibold border border-slate-200 dark:border-navy-700 transition-colors"
          >
            <ToolIcon name={currentTool.iconName} className="w-3.5 h-3.5" />
            <span className="truncate max-w-[90px] sm:max-w-none">{currentTool.name}</span>
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
        <span className="text-xs text-slate-500 dark:text-slate-400 hidden lg:inline truncate max-w-[160px]">
          {projectName}
        </span>
      </div>

      {/* Center: Execution & Mode Buttons or Mobile Segments */}
      <div className="flex items-center gap-2">
        {/* Mobile View Switcher (Visible on mobile/tablet) */}
        {isHtml && onSelectMobileTab && (
          <div className="flex lg:hidden bg-slate-200/80 dark:bg-navy-800 p-0.5 rounded-lg border border-slate-300 dark:border-navy-700 text-[11px]">
            <button
              type="button"
              onClick={() => onSelectMobileTab("editor")}
              className={`px-2 py-1 rounded-md transition-colors ${
                activeMobileTab === "editor"
                  ? "bg-white dark:bg-navy-700 font-bold text-brand-600 dark:text-brand-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => onSelectMobileTab("preview")}
              className={`px-2 py-1 rounded-md transition-colors ${
                activeMobileTab === "preview"
                  ? "bg-white dark:bg-navy-700 font-bold text-brand-600 dark:text-brand-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => onSelectMobileTab("console")}
              className={`px-2 py-1 rounded-md transition-colors ${
                activeMobileTab === "console"
                  ? "bg-white dark:bg-navy-700 font-bold text-brand-600 dark:text-brand-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Console
            </button>
          </div>
        )}

        {/* Run Action */}
        {isHtml ? (
          <button
            type="button"
            onClick={onRunPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all"
            title="Render Live HTML, CSS & JavaScript Preview"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Run Preview</span>
          </button>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={onRunCode || (() => setShowExecutionNotice(true))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white cursor-pointer text-xs font-semibold shadow-xs shadow-brand-500/25 active:scale-95 transition-all"
              title={`Execute ${currentTool.name} Code (Sandbox Guard Active)`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-white/90 font-mono ml-0.5">
                Sandbox
              </span>
            </button>
          </div>
        )}

        {/* Starter Templates Dropdown for HTML */}
        {isHtml && onSelectTemplate && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setTemplateMenuOpen(!templateMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-navy-700 transition-colors"
              title="Starter Templates"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-brand-500" />
              <span className="hidden sm:inline">Templates</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {templateMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setTemplateMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-xl shadow-2xl z-40 p-1.5 animate-slide-up">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Starter Templates
                  </div>
                  {HTML_STARTER_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => {
                        setTemplateMenuOpen(false);
                        setPendingTemplateId(tmpl.id);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors group"
                    >
                      <div className="font-semibold text-xs text-slate-800 dark:text-white group-hover:text-brand-500 flex items-center justify-between">
                        <span>{tmpl.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-navy-750 text-slate-400 font-normal">
                          {tmpl.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {tmpl.description}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right: Save, Export, Share, Settings, Fullscreen */}
      <div className="flex items-center gap-1">
        {/* Save button */}
        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-navy-700 transition-colors"
          title="Save project to IndexedDB"
        >
          <Save className="w-3.5 h-3.5 text-brand-500" />
          <span className="hidden xl:inline">{isSaving ? "Saving..." : "Save"}</span>
        </button>

        {/* Export / Download Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            title="Download / Export Project"
            aria-label="Export project"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {exportMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setExportMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-xl shadow-2xl z-40 p-1 animate-slide-up text-xs">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Export Options
                </div>

                {isHtml && onExportZip && (
                  <button
                    type="button"
                    onClick={() => {
                      setExportMenuOpen(false);
                      onExportZip();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-navy-800 text-brand-600 dark:text-brand-400 font-semibold transition-colors"
                  >
                    <Archive className="w-4 h-4 text-brand-500 shrink-0" />
                    <div className="flex-1">
                      <div>Download ZIP</div>
                      <div className="text-[10px] text-slate-400 font-normal">Bundled with HTML, CSS & JS</div>
                    </div>
                  </button>
                )}

                {isHtml && onExportFile && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setExportMenuOpen(false);
                        onExportFile("html");
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <FileCode className="w-3.5 h-3.5 text-orange-500" />
                      <span>Download index.html</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExportMenuOpen(false);
                        onExportFile("css");
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <FileCode className="w-3.5 h-3.5 text-sky-500" />
                      <span>Download style.css</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExportMenuOpen(false);
                        onExportFile("js");
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <FileCode className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Download script.js</span>
                    </button>
                    <div className="my-1 border-t border-slate-200 dark:border-navy-700" />
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setExportMenuOpen(false);
                    onExport();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export Project JSON</span>
                </button>
              </div>
            </>
          )}
        </div>

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

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          title={resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-slate-600" />
          )}
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

      {/* Template Confirmation Modal */}
      {pendingTemplateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-xs space-y-4">
            <div className="flex items-center gap-2.5 text-amber-500 font-bold text-sm">
              <LayoutTemplate className="w-5 h-5 text-amber-500" />
              <span>Load Starter Template?</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
              Loading this template will replace your current files in this project with the template files. Unsaved modifications will be overwritten.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingTemplateId(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmTemplate}
                className="px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
              >
                Replace Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Execution Modal Notice for other tools (Sandbox Status) */}
      {showExecutionNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-xs space-y-4">
            <div className="flex items-center gap-2.5 text-brand-500 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <span>Backend Execution API &amp; Sandbox Architecture</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
              Target environment: <strong>{currentTool.name}</strong> ({currentTool.category}).
            </p>
            <div className="p-3 bg-slate-50 dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-750 space-y-2 text-slate-600 dark:text-slate-300 text-[11px]">
              <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-brand-500" />
                Backend Security &amp; Sandbox Architecture:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>FastAPI execution backend established with versioned REST contracts (<code>/api/v1</code>)</li>
                <li>Centralized Language Registry configured for all 18 tools</li>
                <li>Cryptographic Supabase JWT token verification &amp; sliding-window rate limits</li>
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
