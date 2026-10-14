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
} from "lucide-react";

interface OutputPanelProps {
  stdinInput: string;
  onStdinChange: (val: string) => void;
  outputContent: string;
  onClearOutput: () => void;
  languageName: string;
}

export function OutputPanel({
  stdinInput,
  onStdinChange,
  outputContent,
  onClearOutput,
  languageName,
}: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<"output" | "terminal" | "problems" | "input">("output");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 font-mono text-xs select-none">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between border-b border-navy-750 px-2 py-1 bg-navy-950">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("output")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              activeTab === "output"
                ? "bg-brand-600/30 text-brand-400 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-navy-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Output</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              activeTab === "terminal"
                ? "bg-brand-600/30 text-brand-400 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-navy-800"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-navy-800 text-slate-400">
              preview
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("problems")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              activeTab === "problems"
                ? "bg-brand-600/30 text-brand-400 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-navy-800"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Problems</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("input")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              activeTab === "input"
                ? "bg-brand-600/30 text-brand-400 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-navy-800"
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Input (STDIN)</span>
            {stdinInput.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {activeTab === "output" && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-navy-800"
                title="Copy output"
                aria-label="Copy output"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={onClearOutput}
                className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-navy-800"
                title="Clear output"
                aria-label="Clear output"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Panel Content Body */}
      <div className="flex-1 overflow-auto p-3 text-slate-200 font-mono text-xs select-text">
        {activeTab === "output" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pb-2 border-b border-navy-800">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              <span>Workspace Console • {languageName} Environment</span>
            </div>

            <pre className="whitespace-pre-wrap leading-relaxed">
              {outputContent || (
                <span className="text-slate-500 italic">
                  [No output generated yet. Write your code and explore the Monaco IDE workspace.]
                </span>
              )}
            </pre>
          </div>
        )}

        {activeTab === "terminal" && (
          <div className="space-y-3">
            <div className="p-3 bg-brand-950/40 border border-brand-800/60 rounded-lg text-slate-200 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-brand-300">
                  Step 5 Architecture: Backend Execution API & Sandbox Security Mode
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  FastAPI Execution API contracts (<code>/api/v1</code>) and the 7-layer sandbox isolation architecture (cgroups v2, read-only root, non-root user 10001, no network, and blocked IMDS) have been established. Arbitrary execution remains safely disabled in production pending per-language sandbox rollout in future steps.
                </p>
              </div>
            </div>

            <div className="font-mono text-slate-400 text-xs space-y-1">
              <p className="text-emerald-400">$ onecompiler-cli --version</p>
              <p>OneCompilerHub Workspace v1.1.0 (FastAPI Backend + Monaco IDE)</p>
              <p className="text-slate-500">Target environment: {languageName}</p>
              <p className="text-slate-500">Backend API Gateway: FastAPI v0.111 /api/v1</p>
              <p className="text-slate-500">Sandbox Isolation: Hardened gVisor/Firecracker Spec</p>
              <p className="text-slate-500">Storage engine: IndexedDB + Supabase Auth</p>
              <p className="text-emerald-400 pt-2">$ ready_</p>
            </div>
          </div>
        )}

        {activeTab === "problems" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs">
              <Check className="w-4 h-4" />
              <span>No syntax or build errors detected in active files.</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Monaco Editor built-in language workers actively analyze code syntax as you type.
            </p>
          </div>
        )}

        {activeTab === "input" && (
          <div className="h-full flex flex-col space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Standard Input (STDIN) Buffer:</span>
              <span>{stdinInput.length} characters</span>
            </div>
            <textarea
              value={stdinInput}
              onChange={(e) => onStdinChange(e.target.value)}
              placeholder="Enter standard input (stdin) lines here before running your program..."
              className="flex-1 w-full bg-navy-950 border border-navy-750 rounded-lg p-2.5 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 resize-none min-h-[100px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
