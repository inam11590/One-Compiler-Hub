"use client";

import React, { useState } from "react";
import {
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronRight,
  Filter,
} from "lucide-react";
import { ConsoleLogEntry, ConsoleLogLevel } from "@/types/preview";

interface ConsolePanelProps {
  logs: ConsoleLogEntry[];
  onClearLogs: () => void;
}

export function ConsolePanel({ logs, onClearLogs }: ConsolePanelProps) {
  const [filterLevel, setFilterLevel] = useState<"all" | ConsoleLogLevel>("all");
  const [copied, setCopied] = useState(false);

  const filteredLogs = logs.filter((log) => {
    if (filterLevel === "all") return true;
    return log.level === filterLevel;
  });

  const errorCount = logs.filter((l) => l.level === "error").length;
  const warnCount = logs.filter((l) => l.level === "warn").length;

  const handleCopy = () => {
    const text = logs
      .map((l) => {
        const time = new Date(l.timestamp).toLocaleTimeString();
        return `[${time}] [${l.level.toUpperCase()}] ${l.args.join(" ")}`;
      })
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelIcon = (level: ConsoleLogLevel) => {
    switch (level) {
      case "error":
        return <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />;
      case "warn":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />;
      case "info":
        return <Info className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />;
      case "log":
      default:
        return <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />;
    }
  };

  const getLevelClass = (level: ConsoleLogLevel) => {
    switch (level) {
      case "error":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-l-2 border-rose-500";
      case "warn":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-l-2 border-amber-500";
      case "info":
        return "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-l-2 border-sky-500";
      case "log":
      default:
        return "text-slate-800 dark:text-slate-200 border-l-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-navy-850";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-200 font-mono text-xs select-none transition-colors">
      {/* Console Subheader / Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-750 px-3 py-1.5 bg-slate-50 dark:bg-navy-950 shrink-0">
        {/* Left: Filter Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mr-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>

          <button
            type="button"
            onClick={() => setFilterLevel("all")}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              filterLevel === "all"
                ? "bg-white dark:bg-navy-850 font-bold text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-navy-700 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All ({logs.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterLevel("error")}
            className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-colors ${
              filterLevel === "error"
                ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold border border-rose-500/30 shadow-xs"
                : "text-rose-600 dark:text-rose-400 hover:text-rose-700"
            }`}
          >
            <span>Errors</span>
            {errorCount > 0 && (
              <span className="px-1 rounded-full bg-rose-500/20 text-[10px] text-rose-700 dark:text-rose-300 font-bold">
                {errorCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilterLevel("warn")}
            className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-colors ${
              filterLevel === "warn"
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30 shadow-xs"
                : "text-amber-600 dark:text-amber-400 hover:text-amber-700"
            }`}
          >
            <span>Warnings</span>
            {warnCount > 0 && (
              <span className="px-1 rounded-full bg-amber-500/20 text-[10px] text-amber-700 dark:text-amber-300 font-bold">
                {warnCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilterLevel("log")}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              filterLevel === "log"
                ? "bg-white dark:bg-navy-850 font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-navy-700 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Logs
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            disabled={logs.length === 0}
            className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-navy-800 disabled:opacity-40 transition-colors"
            title="Copy all logs"
            aria-label="Copy logs"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="p-1 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded hover:bg-slate-200 dark:hover:bg-navy-800 disabled:opacity-40 transition-colors"
            title="Clear console"
            aria-label="Clear console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-auto p-2 space-y-1 select-text">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-[11px] italic">
            Console is clear. Intercepted logs and runtime messages from the preview will appear here.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const timeString = new Date(log.timestamp).toLocaleTimeString();
            return (
              <div
                key={log.id}
                className={`flex items-start gap-2 px-2 py-1.5 rounded text-[11px] leading-relaxed font-mono ${getLevelClass(
                  log.level
                )}`}
              >
                {getLevelIcon(log.level)}
                <span className="text-slate-400 dark:text-slate-500 text-[10px] select-none shrink-0 pt-0.5">
                  {timeString}
                </span>
                <div className="flex-1 whitespace-pre-wrap break-all">
                  {log.args.map((arg, idx) => (
                    <span key={idx} className="mr-2">
                      {arg}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
