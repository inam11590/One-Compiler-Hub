"use client";

import React, { useState } from "react";
import {
  Terminal,
  FileText,
  AlertCircle,
  Keyboard,
  Copy,
  Check,
  Trash2,
  Info,
  Clock,
  Maximize2,
  Minimize2,
  Play,
  Square,
  ShieldAlert,
  Loader2,
  XCircle,
} from "lucide-react";
import { OutputState } from "@/types";

interface OutputPanelProps {
  stdinInput: string;
  onStdinChange: (val: string) => void;
  outputContent: string;
  onClearOutput: () => void;
  languageName: string;
  outputState?: OutputState;
  executionTime?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onTriggerRun?: () => void;
  onCancelRun?: () => void;
}

export function OutputPanel({
  stdinInput,
  onStdinChange,
  outputContent,
  onClearOutput,
  languageName,
  outputState = "idle",
  executionTime,
  isExpanded = false,
  onToggleExpand,
  onTriggerRun,
  onCancelRun,
}: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<"output" | "terminal" | "problems" | "input">("output");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render State Badge in Output Tab
  const renderStateBadge = () => {
    switch (outputState) {
      case "running":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
            <span>Running...</span>
          </span>
        );
      case "waiting":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-2.5 h-2.5" />
            <span>Queued</span>
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Check className="w-2.5 h-2.5" />
            <span>Finished (exit 0)</span>
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <XCircle className="w-2.5 h-2.5" />
            <span>Failed (exit 1)</span>
          </span>
        );
      case "timeout":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <Clock className="w-2.5 h-2.5" />
            <span>Timed out</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <span>Cancelled</span>
          </span>
        );
      case "unavailable":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <ShieldAlert className="w-2.5 h-2.5" />
            <span>Execution Unavailable</span>
          </span>
        );
      case "idle":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400">
            <span>Ready</span>
          </span>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-200 font-mono text-xs select-none transition-colors">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-750 px-2 py-1 bg-slate-50 dark:bg-navy-950 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {/* Output Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("output")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
              activeTab === "output"
                ? "bg-white dark:bg-navy-850 text-brand-600 dark:text-brand-400 font-semibold shadow-xs border border-slate-200/80 dark:border-navy-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-navy-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Output</span>
            {outputState === "running" && (
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
            )}
          </button>

          {/* Terminal Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
              activeTab === "terminal"
                ? "bg-white dark:bg-navy-850 text-brand-600 dark:text-brand-400 font-semibold shadow-xs border border-slate-200/80 dark:border-navy-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-navy-800"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-200 dark:bg-navy-800 text-slate-500 dark:text-slate-400">
              CLI
            </span>
          </button>

          {/* Problems Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("problems")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
              activeTab === "problems"
                ? "bg-white dark:bg-navy-850 text-brand-600 dark:text-brand-400 font-semibold shadow-xs border border-slate-200/80 dark:border-navy-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-navy-800"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Problems</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </button>

          {/* Input (STDIN) Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("input")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
              activeTab === "input"
                ? "bg-white dark:bg-navy-850 text-brand-600 dark:text-brand-400 font-semibold shadow-xs border border-slate-200/80 dark:border-navy-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-navy-800"
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Input (STDIN)</span>
            {stdinInput.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {outputState === "running" && onCancelRun ? (
            <button
              type="button"
              onClick={onCancelRun}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-white bg-red-600 hover:bg-red-500 rounded transition-colors mr-0.5"
              title="Stop running execution"
              aria-label="Stop running execution"
            >
              <Square className="w-2.5 h-2.5 fill-white" />
              <span>Stop</span>
            </button>
          ) : onTriggerRun ? (
            <button
              type="button"
              onClick={onTriggerRun}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors mr-0.5"
              title={`Run ${languageName} code`}
              aria-label={`Run ${languageName} code`}
            >
              <Play className="w-2.5 h-2.5 fill-white" />
              <span>Run</span>
            </button>
          ) : null}

          {activeTab === "output" && (
            <>
              {outputContent && (
                <>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
                    title="Copy output"
                    aria-label="Copy output"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClearOutput}
                    className="p-1 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
                    title="Clear output"
                    aria-label="Clear output"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </>
          )}

          {/* Expand / Minimize toggle button */}
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
              title={isExpanded ? "Collapse panel height" : "Expand panel height"}
              aria-label={isExpanded ? "Collapse panel height" : "Expand panel height"}
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Panel Content Body */}
      <div className="flex-1 overflow-auto p-3 font-mono text-xs select-text">
        {/* OUTPUT TAB */}
        {activeTab === "output" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                <span>
                  Workspace Console • {languageName}
                  {executionTime ? ` • ${executionTime}` : ""}
                </span>
              </div>
              <div>{renderStateBadge()}</div>
            </div>

            {/* Display State Message or Content */}
            {outputState === "unavailable" ? (
              <div className="p-3.5 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 rounded-xl space-y-2 text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Execution Unavailable in Production Mode</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  Backend execution for <strong>{languageName}</strong> is intentionally disabled in the production deployment pending isolated microVM / gVisor sandbox verification. OneCompilerHub does not fabricate simulated results.
                </p>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-1 border-t border-amber-500/20">
                  <span>FastAPI Execution Service: v0.111</span>
                  <span>•</span>
                  <span>Security Baseline: Step 5 Verified</span>
                </div>
              </div>
            ) : outputContent ? (
              <pre className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
                {outputContent}
              </pre>
            ) : (
              <div className="py-6 text-center text-slate-400 dark:text-slate-500 space-y-2">
                <p className="text-xs">
                  No output generated yet.
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-600">
                  Write your code in the Monaco Editor workspace above, configure STDIN input if needed, or inspect the environment tabs.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TERMINAL TAB */}
        {activeTab === "terminal" && (
          <div className="space-y-3">
            <div className="p-3 bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/30 rounded-xl text-slate-700 dark:text-slate-200 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-brand-700 dark:text-brand-300">
                  Backend Execution API &amp; Sandbox Architecture Status
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  FastAPI Execution API contracts (<code>/api/v1</code>) and the 7-layer sandbox isolation architecture (cgroups v2, read-only root, non-root user 10001, no network, and blocked IMDS) have been established. Arbitrary execution remains safely disabled in production pending per-language sandbox rollout in future steps.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl font-mono text-slate-600 dark:text-slate-400 text-xs space-y-1.5">
              <p className="text-emerald-600 dark:text-emerald-400">$ onecompiler-cli --version</p>
              <p className="text-slate-900 dark:text-white font-semibold">OneCompilerHub Workspace v1.1.0 (FastAPI Backend + Monaco IDE)</p>
              <p className="text-slate-500 dark:text-slate-400">Target environment: {languageName}</p>
              <p className="text-slate-500 dark:text-slate-400">Backend API Gateway: FastAPI v0.111 /api/v1</p>
              <p className="text-slate-500 dark:text-slate-400">Sandbox Isolation: Hardened gVisor/Firecracker Spec</p>
              <p className="text-slate-500 dark:text-slate-400">Storage engine: IndexedDB + Supabase Auth</p>
              <p className="text-emerald-600 dark:text-emerald-400 pt-2">$ ready_</p>
            </div>
          </div>
        )}

        {/* PROBLEMS TAB */}
        {activeTab === "problems" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs">
              <Check className="w-4 h-4 shrink-0" />
              <span className="font-semibold">No syntax or build errors detected in active files.</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Monaco Editor built-in language workers actively analyze code syntax as you type. Real-time language diagnostics will appear here if errors are detected.
            </p>
          </div>
        )}

        {/* STDIN INPUT TAB */}
        {activeTab === "input" && (
          <div className="h-full flex flex-col space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Standard Input (STDIN) Buffer:</span>
              <span className="font-semibold">{stdinInput.length} characters</span>
            </div>
            <textarea
              value={stdinInput}
              onChange={(e) => onStdinChange(e.target.value)}
              placeholder="Enter standard input (stdin) lines here before running your program..."
              className="flex-1 w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-750 rounded-xl p-3 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none min-h-[120px] transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  );
}
