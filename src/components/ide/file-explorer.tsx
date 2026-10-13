"use client";

import React, { useState } from "react";
import {
  FilePlus,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit2,
  FileCode,
  Folder,
  FolderOpen,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import { WorkspaceFile } from "@/types";
import { getLanguageFromFileName } from "@/lib/storage";

interface FileExplorerProps {
  files: WorkspaceFile[];
  activeFileId: string | null;
  onSelectFile: (fileId: string) => void;
  onCreateFile: (name: string, isFolder: boolean, parentId: string | null) => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onDeleteFile: (fileId: string) => void;
}

export function FileExplorer({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    root: true,
  });
  const [creatingType, setCreatingType] = useState<"file" | "folder" | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [nameError, setNameError] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deletingFile, setDeletingFile] = useState<WorkspaceFile | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const validateName = (name: string, parentId: string | null, ignoreId?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return "Name cannot be empty.";
    if (trimmed.includes("/") || trimmed.includes("\\") || trimmed.includes(":")) {
      return "Name cannot contain slashes or colons.";
    }
    const duplicate = files.find(
      (f) =>
        f.parentId === parentId &&
        f.id !== ignoreId &&
        f.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) return "A file or folder with this name already exists.";
    return "";
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateName(newItemName, null);
    if (error) {
      setNameError(error);
      return;
    }

    onCreateFile(newItemName.trim(), creatingType === "folder", null);
    setNewItemName("");
    setCreatingType(null);
    setNameError("");
  };

  const handleRenameSubmit = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    const error = validateName(renameValue, file.parentId, fileId);
    if (error) {
      setNameError(error);
      return;
    }

    onRenameFile(fileId, renameValue.trim());
    setRenamingId(null);
    setRenameValue("");
    setNameError("");
  };

  // Group files by root vs nested folders
  const rootItems = files.filter((f) => f.parentId === null);

  const renderFileIcon = (file: WorkspaceFile) => {
    if (file.isFolder) {
      const isExpanded = expandedFolders[file.id];
      return isExpanded ? (
        <FolderOpen className="w-4 h-4 text-brand-400 shrink-0" />
      ) : (
        <Folder className="w-4 h-4 text-brand-400 shrink-0" />
      );
    }

    const lang = getLanguageFromFileName(file.name);
    let colorClass = "text-slate-400";
    if (lang === "python") colorClass = "text-blue-400";
    else if (lang === "javascript") colorClass = "text-amber-400";
    else if (lang === "typescript") colorClass = "text-sky-400";
    else if (lang === "html") colorClass = "text-orange-400";
    else if (lang === "css") colorClass = "text-cyan-400";
    else if (lang === "json") colorClass = "text-yellow-400";
    else if (lang === "sql") colorClass = "text-indigo-400";
    else if (lang === "java") colorClass = "text-red-400";
    else if (lang === "cpp" || lang === "c") colorClass = "text-indigo-400";
    else if (lang === "php") colorClass = "text-purple-400";

    return <FileCode className={`w-4 h-4 ${colorClass} shrink-0`} />;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-navy-900 border-r border-slate-200 dark:border-navy-750 select-none text-xs">
      {/* Explorer Header */}
      <div className="px-3 py-2 border-b border-slate-200 dark:border-navy-750 flex items-center justify-between">
        <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
          Explorer
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setCreatingType("file");
              setNewItemName("");
              setNameError("");
            }}
            className="p-1 rounded text-slate-500 hover:text-brand-500 hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
            title="New File"
            aria-label="Create new file"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setCreatingType("folder");
              setNewItemName("");
              setNameError("");
            }}
            className="p-1 rounded text-slate-500 hover:text-brand-500 hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
            title="New Folder"
            aria-label="Create new folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Creation Input Bar */}
      {creatingType && (
        <form onSubmit={handleCreateSubmit} className="p-2 border-b border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850">
          <div className="flex items-center gap-1.5">
            {creatingType === "file" ? (
              <FileCode className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
            <input
              type="text"
              autoFocus
              value={newItemName}
              onChange={(e) => {
                setNewItemName(e.target.value);
                setNameError("");
              }}
              placeholder={creatingType === "file" ? "filename.py" : "foldername"}
              className="w-full px-2 py-1 bg-slate-100 dark:bg-navy-900 border border-brand-500 rounded text-xs text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              className="p-1 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded"
              title="Confirm"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setCreatingType(null);
                setNameError("");
              }}
              className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 rounded"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {nameError && (
            <p className="text-[10px] text-red-500 mt-1 pl-5">{nameError}</p>
          )}
        </form>
      )}

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5" role="tree" aria-label="Project files">
        {files.length === 0 ? (
          <div className="p-4 text-center text-slate-400 space-y-2">
            <p className="text-xs">No files in project.</p>
            <button
              type="button"
              onClick={() => setCreatingType("file")}
              className="px-2.5 py-1 rounded bg-brand-500 text-white font-semibold text-[11px]"
            >
              + Create File
            </button>
          </div>
        ) : (
          rootItems.map((item) => {
            const isFolder = item.isFolder;
            const isExpanded = expandedFolders[item.id];
            const isActive = activeFileId === item.id;
            const isRenaming = renamingId === item.id;
            const children = files.filter((f) => f.parentId === item.id);

            return (
              <div key={item.id} className="space-y-0.5">
                <div
                  className={`group flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-navy-800"
                  }`}
                  onClick={() => {
                    if (isFolder) {
                      toggleFolder(item.id);
                    } else {
                      onSelectFile(item.id);
                    }
                  }}
                  role="treeitem"
                  aria-selected={isActive}
                >
                  <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                    {isFolder ? (
                      <span className="text-slate-400 shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                    ) : (
                      <span className="w-3.5" />
                    )}

                    {renderFileIcon(item)}

                    {isRenaming ? (
                      <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRenameSubmit(item.id);
                            if (e.key === "Escape") setRenamingId(null);
                          }}
                          className="px-1 py-0.5 bg-white dark:bg-navy-850 border border-brand-500 rounded text-xs text-slate-900 dark:text-white w-full"
                        />
                        <button
                          type="button"
                          onClick={() => handleRenameSubmit(item.id)}
                          className="text-emerald-500 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="truncate text-xs font-mono">{item.name}</span>
                    )}

                    {item.isDirty && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />
                    )}
                  </div>

                  {/* Actions on hover */}
                  {!isRenaming && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingId(item.id);
                          setRenameValue(item.name);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingFile(item);
                        }}
                        className="p-1 text-slate-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub items if folder is expanded */}
                {isFolder && isExpanded && (
                  <div className="pl-4 space-y-0.5 border-l border-slate-200 dark:border-navy-800 ml-3">
                    {children.length === 0 ? (
                      <div className="px-2 py-1 text-[11px] text-slate-400 italic">
                        Empty folder
                      </div>
                    ) : (
                      children.map((child) => (
                        <div
                          key={child.id}
                          onClick={() => onSelectFile(child.id)}
                          className={`flex items-center justify-between px-2 py-1 rounded-lg cursor-pointer ${
                            activeFileId === child.id
                              ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-navy-800"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            {renderFileIcon(child)}
                            <span className="truncate text-xs font-mono">{child.name}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-2xl p-5 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Delete {deletingFile.isFolder ? "Folder" : "File"}?</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{deletingFile.name}</strong>?
              {deletingFile.isDirty && " This file contains unsaved changes that will be lost."}
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDeletingFile(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteFile(deletingFile.id);
                  setDeletingFile(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
