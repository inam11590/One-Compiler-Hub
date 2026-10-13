import React from "react";
import type { Metadata } from "next";
import { CodeWorkspace } from "@/components/ide/code-workspace";

export const metadata: Metadata = {
  title: "Online IDE & Code Workspace — OneCompilerHub",
  description:
    "Production-grade browser coding workspace powered by Monaco Editor. Edit, organize files, and experiment in 18 programming languages.",
};

export default function EditorRootPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col p-2 sm:p-4">
      <div className="flex-1 w-full max-w-[1700px] mx-auto">
        <CodeWorkspace initialToolSlug="python" />
      </div>
    </div>
  );
}
