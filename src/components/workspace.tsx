"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  Play,
  Square,
  RotateCcw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Terminal,
  FileCode,
  FolderTree,
  AlertCircle,
  ChevronDown,
  Sparkles,
  Columns,
  Rows,
  ShieldAlert,
} from "lucide-react";
import { PROGRAMMING_TOOLS } from "@/data/tools";
import { ProgrammingTool } from "@/types";
import { ToolIcon } from "@/components/tool-icons";

// Dynamically import Monaco Editor to prevent SSR window issues
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-900 text-slate-400 font-mono text-xs">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span>Loading Monaco Code Workspace...</span>
      </div>
    </div>
  ),
});

interface WorkspaceProps {
  selectedTool?: ProgrammingTool;
  onToolChange?: (tool: ProgrammingTool) => void;
}

export function Workspace({ selectedTool: initialTool, onToolChange }: WorkspaceProps) {
  const { resolvedTheme } = useTheme();
  const [activeTool, setActiveTool] = useState<ProgrammingTool>(
    initialTool || PROGRAMMING_TOOLS[1] // Default to Python
  );

  // Sync if prop changes
  useEffect(() => {
    if (initialTool && initialTool.id !== activeTool.id) {
      setActiveTool(initialTool);
      setCurrentCode(initialTool.defaultCode);
      setConsoleOutput(initialTool.mockOutput);
      setActiveFile(initialTool.fileName);
    }
  }, [initialTool, activeTool.id]);

  const [currentCode, setCurrentCode] = useState(activeTool.defaultCode);
  const [stdinInput, setStdinInput] = useState("");
  const [consoleOutput, setConsoleOutput] = useState(activeTool.mockOutput);
  const [activeTab, setActiveTab] = useState<"output" | "input" | "errors">("output");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"side-by-side" | "stacked">("side-by-side");
  const [activeFile, setActiveFile] = useState(activeTool.fileName);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLanguageChange = (toolId: string) => {
    const found = PROGRAMMING_TOOLS.find((t) => t.id === toolId);
    if (found) {
      setActiveTool(found);
      setCurrentCode(found.defaultCode);
      setConsoleOutput(found.mockOutput);
      setActiveFile(found.fileName);
      if (onToolChange) onToolChange(found);
      showToast(`Switched environment to ${found.name}`);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setActiveTab("output");
    setTimeout(() => {
      setIsRunning(false);
      setConsoleOutput(
        `${activeTool.mockOutput}\n\n[Simulated Execution: ${activeTool.mockExecutionTime} • Memory: 14.2 MB • Step 1 Demo]`
      );
      showToast("Simulated execution finished (Step 1 demo)");
    }, 550);
  };

  const handleStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setConsoleOutput((prev) => prev + "\n[Execution aborted by user]");
      showToast("Execution stopped");
    }
  };

  const handleReset = () => {
    setCurrentCode(activeTool.defaultCode);
    setConsoleOutput(activeTool.mockOutput);
    showToast("Code reset to original template");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    showToast("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Virtual files for file explorer
  const virtualFiles = [
    { name: activeTool.fileName, isPrimary: true },
    { name: "README.md", content: `# ${activeTool.name} Playground\n\nRun, test, and preview ${activeTool.name} scripts in OneCompilerHub.` },
    { name: "config.json", content: `{\n  "environment": "${activeTool.id}",\n  "version": "latest",\n  "step": 1\n}` },
  ];

  const handleSelectFile = (fileName: string) => {
    setActiveFile(fileName);
    if (fileName === activeTool.fileName) {
      // keep current code
    } else if (fileName === "README.md") {
      setCurrentCode(`# ${activeTool.name} Playground\n\nRun, test, and preview ${activeTool.name} scripts in OneCompilerHub.\nFrontend Step 1 Prototype.`);
    } else {
      setCurrentCode(`{\n  "environment": "${activeTool.id}",\n  "version": "latest",\n  "step": 1,\n  "status": "demo_only"\n}`);
    }
  };

  const monacoTheme = resolvedTheme === "dark" ? "vs-dark" : "light";

  return (
    <section 
      id="workspace" 
      className={`relative py-12 transition-all ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-slate-900 p-2 sm:p-4 overflow-hidden flex flex-col"
          : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      }`}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xl border border-slate-700 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Workspace Header / Banner */}
      {!isFullscreen && (
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Developer Playground</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Coding Workspace
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Demo Workspace
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Test Monaco syntax highlighting, file exploration, and tabbed panels. (Real multi-language compiler execution arrives in Step 2).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Language:
            </span>
            <div className="relative">
              <select
                value={activeTool.id}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none pl-9 pr-9 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm cursor-pointer"
              >
                {PROGRAMMING_TOOLS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (.{t.fileExtension})
                  </option>
                ))}
              </select>
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <ToolIcon name={activeTool.iconName} className="w-4 h-4" />
              </div>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className={`rounded-2xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 shadow-2xl flex flex-col overflow-hidden transition-all ${
        isFullscreen ? "flex-1" : "min-h-[640px]"
      }`}>
        {/* Workspace Toolbar */}
        <div className="px-3 sm:px-4 py-2.5 bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-750 flex items-center justify-between gap-2">
          {/* Left Actions: Run, Stop, Reset */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all shadow-sm shadow-emerald-500/20 disabled:opacity-50"
              title="Execute code in simulated sandbox"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? "Running..." : "Run"}</span>
            </button>

            <button
              type="button"
              onClick={handleStop}
              disabled={!isRunning}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-800 disabled:opacity-40 transition-colors"
              title="Stop simulation"
            >
              <Square className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stop</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
              title="Reset to default starter code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-300 dark:bg-navy-700 mx-1 hidden sm:block" />

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy Code"}</span>
            </button>
          </div>

          {/* Right Toolbar Controls: Layout & Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Toggle File Explorer */}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                !sidebarCollapsed
                  ? "bg-brand-500/10 text-brand-500"
                  : "text-slate-500 hover:bg-slate-200 dark:hover:bg-navy-800"
              }`}
              title="Toggle File Explorer Sidebar"
              aria-label="Toggle file explorer"
            >
              <FolderTree className="w-4 h-4" />
            </button>

            {/* Layout switch */}
            <button
              type="button"
              onClick={() =>
                setLayoutMode(layoutMode === "side-by-side" ? "stacked" : "side-by-side")
              }
              className="p-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors hidden md:inline-flex"
              title={layoutMode === "side-by-side" ? "Switch to Stacked Layout" : "Switch to Split Layout"}
              aria-label="Toggle layout mode"
            >
              {layoutMode === "side-by-side" ? (
                <Rows className="w-4 h-4" />
              ) : (
                <Columns className="w-4 h-4" />
              )}
            </button>

            {/* Fullscreen toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Editor"}
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Step 1 Prototype Status Bar */}
        <div className="px-4 py-1.5 bg-amber-500/10 dark:bg-amber-950/30 border-b border-amber-500/20 text-xs flex items-center justify-between text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-medium">
              <strong>Step 1 Demo Workspace:</strong> UI and Monaco layout test mode. Full multi-language compiler containers will execute code in Step 2.
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20">
            Frontend Only
          </span>
        </div>

        {/* Workspace Body Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Sidebar */}
          {!sidebarCollapsed && (
            <div className="w-44 sm:w-52 border-r border-slate-200 dark:border-navy-750 bg-slate-50/80 dark:bg-navy-900/60 p-3 flex flex-col shrink-0 overflow-y-auto">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5" />
                <span>Files</span>
              </div>

              <div className="space-y-1">
                {virtualFiles.map((f) => (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => handleSelectFile(f.name)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left ${
                      activeFile === f.name
                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-navy-800"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-200 dark:border-navy-800 text-[11px] text-slate-400">
                <div className="font-semibold text-slate-500 dark:text-slate-400">Active Runtime:</div>
                <div className="font-mono text-brand-500 mt-0.5">{activeTool.name}</div>
              </div>
            </div>
          )}

          {/* Editor + Output Area */}
          <div className={`flex-1 flex ${layoutMode === "side-by-side" ? "flex-col lg:flex-row" : "flex-col"} overflow-hidden`}>
            {/* Monaco Editor Pane */}
            <div className={`flex-1 flex flex-col min-h-[300px] border-b lg:border-b-0 ${layoutMode === "side-by-side" ? "lg:border-r" : ""} border-slate-200 dark:border-navy-750`}>
              {/* Tab Header for Active File */}
              <div className="px-4 py-2 bg-slate-100/70 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-750 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-brand-500" />
                    {activeFile}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({activeTool.monacoLanguage})
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  UTF-8
                </div>
              </div>

              {/* Monaco Component */}
              <div className="flex-1 relative min-h-[320px]">
                <Editor
                  height="100%"
                  language={activeTool.monacoLanguage}
                  theme={monacoTheme}
                  value={currentCode}
                  onChange={(val) => setCurrentCode(val || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on",
                    padding: { top: 12, bottom: 12 },
                  }}
                />
              </div>
            </div>

            {/* Output / Input / Error Panel */}
            <div className={`flex flex-col bg-slate-950 text-slate-100 font-mono text-xs ${
              layoutMode === "side-by-side" ? "lg:w-[420px] xl:w-[480px]" : "h-64"
            }`}>
              {/* Output Tabs Header */}
              <div className="px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("output")}
                    className={`px-3 py-2 border-b-2 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === "output"
                        ? "border-brand-500 text-white"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Output</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("input")}
                    className={`px-3 py-2 border-b-2 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === "input"
                        ? "border-brand-500 text-white"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>STDIN Input</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("errors")}
                    className={`px-3 py-2 border-b-2 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === "errors"
                        ? "border-brand-500 text-white"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Diagnostics</span>
                  </button>
                </div>

                <div className="text-[10px] text-slate-500 pr-2">
                  {isRunning ? "Running..." : "Idle"}
                </div>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 p-4 overflow-y-auto leading-relaxed">
                {activeTab === "output" && (
                  <div>
                    {isRunning ? (
                      <div className="flex items-center gap-2 text-slate-400 py-4">
                        <div className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                        <span>Simulating execution in isolated sandbox container...</span>
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-slate-300 font-mono text-xs selection:bg-brand-500/30">
                        {consoleOutput}
                      </pre>
                    )}
                  </div>
                )}

                {activeTab === "input" && (
                  <div className="space-y-3">
                    <p className="text-slate-400 text-[11px]">
                      Enter standard input (STDIN) arguments to be passed during simulated runtime:
                    </p>
                    <textarea
                      value={stdinInput}
                      onChange={(e) => setStdinInput(e.target.value)}
                      placeholder="e.g. 42\nHello OneCompilerHub"
                      rows={5}
                      className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                    />
                    <div className="text-[10px] text-slate-500">
                      Standard input buffer saved for simulated execution.
                    </div>
                  </div>
                )}

                {activeTab === "errors" && (
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                      <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Static Analysis Clean</span>
                      </div>
                      <p className="text-slate-400 mt-1">
                        No syntax diagnostics or compilation blocking warnings detected in {activeFile}.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                      <div>Environment: <strong>{activeTool.name}</strong></div>
                      <div>Engine Mode: <strong>Step 1 UI Playground</strong></div>
                      <div>Backend Compiler: <strong>Scheduled for Step 2</strong></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
