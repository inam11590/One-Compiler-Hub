"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  RotateCcw,
  Play,
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Minimize2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { DeviceMode, ConsoleLogEntry, PreviewMessagePayload } from "@/types/preview";
import { buildSandboxedHtml, generateChannelToken } from "@/lib/preview/bundler";

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onLogReceived: (entry: ConsoleLogEntry) => void;
  onClearLogs?: () => void;
}

export function PreviewPanel({
  html,
  css,
  js,
  autoRefresh,
  onToggleAutoRefresh,
  onLogReceived,
  onClearLogs,
}: PreviewPanelProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [channelToken, setChannelToken] = useState<string>(() => generateChannelToken());
  const [assembledHtml, setAssembledHtml] = useState<string>("");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const channelTokenRef = useRef<string>(channelToken);
  channelTokenRef.current = channelToken;

  // Debounced build & render function
  const renderPreview = useCallback(() => {
    setIsRendering(true);
    const newToken = generateChannelToken();
    setChannelToken(newToken);
    channelTokenRef.current = newToken;

    const fullDoc = buildSandboxedHtml(html, css, js, newToken, { cspEnabled: true });
    setAssembledHtml(fullDoc);

    // Give iframe a moment to mount and settle
    setTimeout(() => {
      setIsRendering(false);
    }, 250);
  }, [html, css, js]);

  const lastRenderedCodeRef = useRef<{ html: string; css: string; js: string }>({
    html: "",
    css: "",
    js: "",
  });

  // Initial and auto-refresh trigger (debounced by 450ms)
  useEffect(() => {
    if (!autoRefresh && lastRenderedCodeRef.current.html) return;

    if (
      lastRenderedCodeRef.current.html === html &&
      lastRenderedCodeRef.current.css === css &&
      lastRenderedCodeRef.current.js === js
    ) {
      return;
    }

    const timer = setTimeout(() => {
      lastRenderedCodeRef.current = { html, css, js };
      renderPreview();
    }, 450);

    return () => clearTimeout(timer);
  }, [html, css, js, autoRefresh, renderPreview]);

  // Safe PostMessage Bridge Listener
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as PreviewMessagePayload;
      if (!data || typeof data !== "object") return;
      if (data.source !== "onecompiler-preview") return;

      // Verify cryptographic channel token
      if (data.channelToken !== channelTokenRef.current) {
        return; // Reject message from old/foreign preview iframe
      }

      if (data.type === "console" && data.level && data.args) {
        onLogReceived({
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          level: data.level,
          args: data.args,
          timestamp: data.timestamp || Date.now(),
        });
      } else if (data.type === "runtime-error" && data.args) {
        onLogReceived({
          id: `err-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          level: "error",
          args: data.args,
          timestamp: data.timestamp || Date.now(),
        });
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onLogReceived]);

  const handleManualRefresh = () => {
    if (onClearLogs) onClearLogs();
    renderPreview();
  };

  const handleReset = () => {
    if (onClearLogs) onClearLogs();
    renderPreview();
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Device container styling
  const getDeviceWidthClass = () => {
    switch (deviceMode) {
      case "mobile":
        return "max-w-[375px] h-[667px] my-auto shadow-2xl rounded-2xl border-4 border-slate-700 dark:border-navy-700";
      case "tablet":
        return "max-w-[768px] h-[92%] my-auto shadow-xl rounded-xl border-2 border-slate-600 dark:border-navy-700";
      case "desktop":
      default:
        return "w-full h-full";
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-slate-900 border-l border-slate-200 dark:border-navy-750 overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 bg-slate-950" : "h-full w-full"
      }`}
    >
      {/* Top Preview Toolbar */}
      <div className="h-10 bg-slate-100 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-750 px-3 flex items-center justify-between text-xs select-none shrink-0">
        {/* Left: Refresh & Auto-refresh */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleManualRefresh}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-600 hover:bg-brand-500 text-white font-medium shadow-sm transition-all"
            title="Reload Preview & Execute JS"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden sm:inline">Run</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
            title="Reset Preview"
            aria-label="Reset Preview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Auto Refresh toggle */}
          <button
            type="button"
            onClick={onToggleAutoRefresh}
            className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-medium transition-colors ${
              autoRefresh
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-slate-200/60 dark:bg-navy-800 border-slate-300 dark:border-navy-700 text-slate-500 dark:text-slate-400"
            }`}
            title="Toggle live auto-refresh on code edits"
          >
            <RefreshCw className={`w-3 h-3 ${autoRefresh && isRendering ? "animate-spin" : ""}`} />
            <span>Auto</span>
          </button>
        </div>

        {/* Center: Device Mode Switcher */}
        <div className="flex items-center bg-slate-200/80 dark:bg-navy-800/80 p-0.5 rounded-lg border border-slate-300/80 dark:border-navy-700">
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`p-1 rounded-md transition-colors ${
              deviceMode === "desktop"
                ? "bg-white dark:bg-navy-700 text-brand-500 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Desktop Mode (100%)"
            aria-label="Desktop view"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("tablet")}
            className={`p-1 rounded-md transition-colors ${
              deviceMode === "tablet"
                ? "bg-white dark:bg-navy-700 text-brand-500 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Tablet Mode (768px)"
            aria-label="Tablet view"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`p-1 rounded-md transition-colors ${
              deviceMode === "mobile"
                ? "bg-white dark:bg-navy-700 text-brand-500 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Mobile Mode (375px)"
            aria-label="Mobile view"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Security Badge & Fullscreen */}
        <div className="flex items-center gap-1">
          <div
            className="hidden md:flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-mono"
            title="Sandboxed iframe (origin: null, CSP: connect-src 'none')"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Sandbox Opaque</span>
          </div>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Preview Frame Container */}
      <div className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-2 relative">
        <div className={`transition-all duration-300 w-full overflow-hidden bg-white ${getDeviceWidthClass()}`}>
          {/*
            CRITICAL SECURITY CONFIGURATION:
            sandbox="allow-scripts allow-modals"
            Notice: "allow-same-origin" is strictly OMITTED.
            The iframe runs with unique origin "null", preventing all access
            to parent DOM, cookies, localStorage, Supabase tokens, and parent APIs.
          */}
          <iframe
            ref={iframeRef}
            srcDoc={assembledHtml}
            title="OneCompilerHub Live HTML Preview"
            sandbox="allow-scripts allow-modals"
            className="w-full h-full border-none block bg-white"
          />
        </div>

        {/* Loading Indicator Overlay */}
        {isRendering && (
          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm text-slate-200 text-[11px] px-2.5 py-1 rounded-full border border-slate-700 shadow-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
            <span>Rendering…</span>
          </div>
        )}
      </div>
    </div>
  );
}
