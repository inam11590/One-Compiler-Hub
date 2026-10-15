"use client";

import React from "react";
import { X, FileCode } from "lucide-react";
import { WorkspaceFile } from "@/types";
import { getLanguageFromFileName } from "@/lib/storage";

interface EditorTabsProps {
  files: WorkspaceFile[];
  openFileIds: string[];
  activeFileId: string | null;
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
}

export function EditorTabs({
  files,
  openFileIds,
  activeFileId,
  onSelectTab,
  onCloseTab,
}: EditorTabsProps) {
  const openFiles = openFileIds
    .map((id) => files.find((f) => f.id === id))
    .filter((f): f is WorkspaceFile => f !== undefined && !f.isFolder);

  const getIconColor = (fileName: string) => {
    const lang = getLanguageFromFileName(fileName);
    if (lang === "python") return "text-blue-400";
    if (lang === "javascript") return "text-amber-400";
    if (lang === "typescript") return "text-sky-400";
    if (lang === "html") return "text-orange-400";
    if (lang === "css") return "text-cyan-400";
    if (lang === "json") return "text-yellow-400";
    if (lang === "sql") return "text-indigo-400";
    if (lang === "java") return "text-red-400";
    if (lang === "cpp" || lang === "c") return "text-indigo-400";
    if (lang === "php") return "text-purple-400";
    return "text-slate-400";
  };

  return (
    <div
      role="tablist"
      aria-label="Editor tabs"
      className="flex items-center overflow-x-auto bg-slate-50 dark:bg-navy-950 border-b border-slate-200 dark:border-navy-750 select-none no-scrollbar h-9"
    >
      {openFiles.map((file) => {
        const isActive = file.id === activeFileId;
        return (
          <div
            key={file.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            onClick={() => onSelectTab(file.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectTab(file.id);
              }
            }}
            className={`group relative flex items-center gap-2 px-3 py-1.5 h-full text-xs font-mono border-r border-slate-200 dark:border-navy-750 transition-colors cursor-pointer shrink-0 max-w-[200px] ${
              isActive
                ? "bg-white dark:bg-navy-900 text-slate-900 dark:text-white font-medium border-t-2 border-t-brand-500 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-900/60 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <FileCode className={`w-3.5 h-3.5 shrink-0 ${getIconColor(file.name)}`} />
            <span className="truncate">{file.name}</span>

            {/* Dirty indicator or close button */}
            <div className="flex items-center shrink-0 ml-1">
              {file.isDirty ? (
                <button
                  type="button"
                  title="Unsaved changes. Click to close"
                  aria-label={`Close ${file.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(file.id);
                  }}
                  className="w-4 h-4 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-navy-800"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-500 group-hover:hidden" />
                  <X className="w-3 h-3 text-slate-500 hidden group-hover:block" />
                </button>
              ) : (
                <button
                  type="button"
                  title="Close tab"
                  aria-label={`Close ${file.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(file.id);
                  }}
                  className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {openFiles.length === 0 && (
        <div className="px-3 py-1.5 text-xs text-slate-400 italic">
          No files open. Select a file from the explorer.
        </div>
      )}
    </div>
  );
}
