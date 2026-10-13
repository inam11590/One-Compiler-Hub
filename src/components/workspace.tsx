"use client";

import React from "react";
import { ProgrammingTool } from "@/types";
import { CodeWorkspace } from "@/components/ide/code-workspace";

interface WorkspaceProps {
  selectedTool?: ProgrammingTool;
  onToolChange?: (tool: ProgrammingTool) => void;
}

export function Workspace({ selectedTool }: WorkspaceProps) {
  return (
    <div className="w-full">
      <CodeWorkspace initialToolSlug={selectedTool?.slug || "python"} />
    </div>
  );
}
