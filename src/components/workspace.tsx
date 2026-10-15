"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ProgrammingTool } from "@/types";

const CodeWorkspace = dynamic(
  () => import("@/components/ide/code-workspace").then((mod) => mod.CodeWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[760px] rounded-2xl border border-slate-200 dark:border-navy-750 bg-slate-900 flex flex-col items-center justify-center text-slate-400 font-mono text-xs shadow-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Interactive Workspace...</span>
        </div>
      </div>
    ),
  }
);

interface WorkspaceProps {
  selectedTool?: ProgrammingTool;
  onToolChange?: (tool: ProgrammingTool) => void;
}

export function Workspace({ selectedTool }: WorkspaceProps) {
  return (
    <div className="w-full">
      <CodeWorkspace initialToolSlug={selectedTool?.slug || "python"} isEmbedded={true} />
    </div>
  );
}
