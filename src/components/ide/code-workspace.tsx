"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  FolderTree,
  Search,
  Settings as SettingsIcon,
  X,
  FileCode,
} from "lucide-react";
import { ProgrammingTool, WorkspaceProject, WorkspaceFile, EditorSettings } from "@/types";
import { PROGRAMMING_TOOLS, getToolBySlug } from "@/data/tools";
import {
  createStarterProject,
  saveProject,
  loadProject,
  loadEditorSettings,
  saveEditorSettings,
  exportProjectAsJSON,
  parseProjectJSON,
  getLanguageFromFileName,
} from "@/lib/storage";
import { TopToolbar } from "./top-toolbar";
import { FileExplorer } from "./file-explorer";
import { EditorTabs } from "./editor-tabs";
import { OutputPanel } from "./output-panel";
import { StatusBar } from "./status-bar";
import { SettingsModal } from "./settings-modal";

// Dynamic Monaco Editor to prevent Next.js SSR window access
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

interface CodeWorkspaceProps {
  initialToolSlug?: string;
}

export function CodeWorkspace({ initialToolSlug = "python" }: CodeWorkspaceProps) {
  const { resolvedTheme } = useTheme();

  // Active Tool
  const [currentTool, setCurrentTool] = useState<ProgrammingTool>(() => {
    return getToolBySlug(initialToolSlug) || PROGRAMMING_TOOLS[1];
  });

  // Project state
  const [project, setProject] = useState<WorkspaceProject>(() => {
    return createStarterProject(currentTool.slug);
  });

  // Settings
  const [settings, setSettings] = useState<EditorSettings>(() => loadEditorSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Layout & UI State
  const [activeSidebarTab, setActiveSidebarTab] = useState<"files" | "search" | null>("files");
  const [searchQuery, setSearchQuery] = useState("");
  const [stdinInput, setStdinInput] = useState("");
  const [outputContent, setOutputContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Load project from IndexedDB on startup or tool change
  useEffect(() => {
    let isMounted = true;
    async function initProject() {
      const saved = await loadProject(currentTool.slug);
      if (!isMounted) return;
      if (saved) {
        setProject(saved);
      } else {
        const fresh = createStarterProject(currentTool.slug);
        setProject(fresh);
        await saveProject(fresh);
      }
    }
    initProject();
    return () => {
      isMounted = false;
    };
  }, [currentTool.slug]);

  // Persist project changes debounced
  const persistProject = useCallback(async (proj: WorkspaceProject) => {
    setIsSaving(true);
    await saveProject(proj);
    setTimeout(() => setIsSaving(false), 300);
  }, []);

  // Active File Reference
  const activeFile = project.files.find((f) => f.id === project.activeFileId) || project.files[0];

  // Editor content change
  const handleContentChange = (value: string | undefined) => {
    if (!activeFile || value === undefined) return;
    const updatedFiles = project.files.map((file) => {
      if (file.id === activeFile.id) {
        return {
          ...file,
          content: value,
          isDirty: true,
          updatedAt: Date.now(),
        };
      }
      return file;
    });

    const updatedProject = {
      ...project,
      files: updatedFiles,
      updatedAt: Date.now(),
    };

    setProject(updatedProject);
    persistProject(updatedProject);
  };

  // Switch Tool / Language
  const handleToolChange = (tool: ProgrammingTool) => {
    setCurrentTool(tool);
    showToast(`Environment switched to ${tool.name}`);
  };

  // File explorer interactions
  const handleSelectFile = (fileId: string) => {
    const file = project.files.find((f) => f.id === fileId);
    if (!file || file.isFolder) return;

    let openFileIds = project.openFileIds;
    if (!openFileIds.includes(fileId)) {
      openFileIds = [...openFileIds, fileId];
    }

    const updatedProject = {
      ...project,
      activeFileId: fileId,
      openFileIds,
    };
    setProject(updatedProject);
    persistProject(updatedProject);
  };

  const handleCreateFile = (name: string, isFolder: boolean, parentId: string | null) => {
    const newId = `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newFile: WorkspaceFile = {
      id: newId,
      name,
      path: `/${name}`,
      content: isFolder ? "" : "",
      isFolder,
      parentId,
      language: getLanguageFromFileName(name),
      updatedAt: Date.now(),
    };

    const updatedProject: WorkspaceProject = {
      ...project,
      files: [...project.files, newFile],
      activeFileId: isFolder ? project.activeFileId : newId,
      openFileIds: isFolder
        ? project.openFileIds
        : [...project.openFileIds.filter((id) => id !== newId), newId],
      updatedAt: Date.now(),
    };

    setProject(updatedProject);
    persistProject(updatedProject);
    showToast(`Created ${isFolder ? "folder" : "file"} ${name}`);
  };

  const handleRenameFile = (fileId: string, newName: string) => {
    const updatedFiles = project.files.map((f) => {
      if (f.id === fileId) {
        return {
          ...f,
          name: newName,
          path: `/${newName}`,
          language: getLanguageFromFileName(newName),
          updatedAt: Date.now(),
        };
      }
      return f;
    });

    const updatedProject = {
      ...project,
      files: updatedFiles,
      updatedAt: Date.now(),
    };

    setProject(updatedProject);
    persistProject(updatedProject);
    showToast(`Renamed to ${newName}`);
  };

  const handleDeleteFile = (fileId: string) => {
    // Collect target and any children
    const toDeleteIds = new Set<string>([fileId]);
    project.files.forEach((f) => {
      if (f.parentId === fileId) toDeleteIds.add(f.id);
    });

    const remainingFiles = project.files.filter((f) => !toDeleteIds.has(f.id));
    const remainingOpen = project.openFileIds.filter((id) => !toDeleteIds.has(id));

    let newActiveId = project.activeFileId;
    if (newActiveId && toDeleteIds.has(newActiveId)) {
      newActiveId = remainingOpen.length > 0 ? remainingOpen[0] : (remainingFiles[0]?.id || null);
    }

    const updatedProject: WorkspaceProject = {
      ...project,
      files: remainingFiles,
      openFileIds: remainingOpen,
      activeFileId: newActiveId,
      updatedAt: Date.now(),
    };

    setProject(updatedProject);
    persistProject(updatedProject);
    showToast("Item deleted");
  };

  // Tab close
  const handleCloseTab = (fileId: string) => {
    const nextOpen = project.openFileIds.filter((id) => id !== fileId);
    let nextActive = project.activeFileId;

    if (project.activeFileId === fileId) {
      nextActive = nextOpen.length > 0 ? nextOpen[nextOpen.length - 1] : null;
    }

    const updatedProject = {
      ...project,
      openFileIds: nextOpen,
      activeFileId: nextActive,
    };
    setProject(updatedProject);
    persistProject(updatedProject);
  };

  // Save explicitly
  const handleManualSave = () => {
    const updatedFiles = project.files.map((f) => ({ ...f, isDirty: false }));
    const updatedProject = {
      ...project,
      files: updatedFiles,
      updatedAt: Date.now(),
    };
    setProject(updatedProject);
    persistProject(updatedProject);
    showToast("Project saved to IndexedDB");
  };

  // Export JSON
  const handleExport = () => {
    exportProjectAsJSON(project);
    showToast("Project exported as JSON");
  };

  // Import JSON
  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const imported = parseProjectJSON(text);
      setProject(imported);
      await saveProject(imported);
      showToast(`Imported project "${imported.name}"`);
    } catch {
      showToast("Error importing project file");
    }
  };

  // Settings update
  const handleUpdateSettings = (partial: Partial<EditorSettings>) => {
    const merged = { ...settings, ...partial };
    setSettings(merged);
    saveEditorSettings(merged);
  };

  // Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Determine Monaco Theme
  const monacoTheme =
    settings.theme === "auto"
      ? resolvedTheme === "dark"
        ? "vs-dark"
        : "vs"
      : settings.theme;

  // Search in files
  const filteredSearchFiles = project.files.filter((f) => {
    if (f.isFolder || !searchQuery.trim()) return false;
    return (
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Word count in active file
  const activeWordCount = activeFile?.content
    ? activeFile.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-slate-100 dark:bg-navy-950 text-slate-800 dark:text-slate-100 overflow-hidden ${
        isFullscreen ? "h-screen w-screen" : "h-[740px] rounded-2xl border border-slate-200 dark:border-navy-750 shadow-2xl"
      }`}
    >
      {/* Top Toolbar */}
      <TopToolbar
        projectName={project.name}
        currentTool={currentTool}
        onToolChange={handleToolChange}
        onSave={handleManualSave}
        onExport={handleExport}
        onImport={handleImport}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isSaving={isSaving}
      />

      {/* Main Center Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar (VS Code style icons on left) */}
        <div className="w-12 bg-slate-200/70 dark:bg-navy-950 border-r border-slate-200 dark:border-navy-750 flex flex-col items-center py-2 gap-2 select-none shrink-0 z-10">
          <button
            type="button"
            onClick={() => setActiveSidebarTab(activeSidebarTab === "files" ? null : "files")}
            className={`p-2 rounded-xl transition-colors ${
              activeSidebarTab === "files"
                ? "bg-white dark:bg-navy-850 text-brand-500 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Explorer"
            aria-label="Toggle explorer panel"
          >
            <FolderTree className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSidebarTab(activeSidebarTab === "search" ? null : "search")}
            className={`p-2 rounded-xl transition-colors ${
              activeSidebarTab === "search"
                ? "bg-white dark:bg-navy-850 text-brand-500 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Search in Project"
            aria-label="Toggle search panel"
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Settings"
            aria-label="Open settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Panel (Files / Search) */}
        {activeSidebarTab && (
          <div className="w-64 shrink-0 h-full overflow-hidden">
            {activeSidebarTab === "files" && (
              <FileExplorer
                files={project.files}
                activeFileId={project.activeFileId}
                onSelectFile={handleSelectFile}
                onCreateFile={handleCreateFile}
                onRenameFile={handleRenameFile}
                onDeleteFile={handleDeleteFile}
              />
            )}

            {activeSidebarTab === "search" && (
              <div className="h-full flex flex-col bg-slate-50 dark:bg-navy-900 border-r border-slate-200 dark:border-navy-750 p-3 select-none text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-navy-750 mb-3">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
                    Search Files
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSidebarTab(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative mb-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in files..."
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto space-y-1">
                  {searchQuery && filteredSearchFiles.length === 0 && (
                    <p className="text-slate-400 text-center py-4 italic">No matching files found.</p>
                  )}
                  {filteredSearchFiles.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleSelectFile(f.id)}
                      className="w-full text-left p-2 rounded-lg bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 hover:border-brand-500 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-white">
                        <FileCode className="w-3.5 h-3.5 text-brand-500" />
                        <span>{f.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-1">{f.path}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Editor & Output Work Area */}
        <div className={`flex-1 flex overflow-hidden ${settings.layout === "right" ? "flex-row" : "flex-col"}`}>
          {/* Top/Left: Tabs & Monaco Editor */}
          <div className={`flex-1 flex flex-col min-w-0 overflow-hidden ${settings.layout === "right" ? "w-7/12" : "h-3/5"}`}>
            {/* Editor Tabs */}
            <EditorTabs
              files={project.files}
              openFileIds={project.openFileIds}
              activeFileId={project.activeFileId}
              onSelectTab={handleSelectFile}
              onCloseTab={handleCloseTab}
            />

            {/* Monaco Container */}
            <div className="flex-1 relative overflow-hidden bg-white dark:bg-navy-900">
              {activeFile ? (
                <Editor
                  height="100%"
                  language={activeFile.language}
                  value={activeFile.content}
                  theme={monacoTheme}
                  onChange={handleContentChange}
                  onMount={(editor) => {
                    editor.onDidChangeCursorPosition((e) => {
                      setCursorPosition({
                        line: e.position.lineNumber,
                        column: e.position.column,
                      });
                    });
                  }}
                  options={{
                    fontSize: settings.fontSize,
                    tabSize: settings.tabSize,
                    wordWrap: settings.wordWrap,
                    minimap: { enabled: settings.minimap },
                    lineNumbers: settings.lineNumbers,
                    autoClosingBrackets: settings.autoClosingBrackets,
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    renderWhitespace: "selection",
                    bracketPairColorization: { enabled: true },
                    fontFamily: "GeistMono, ui-monospace, Menlo, Monaco, Consolas, monospace",
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 font-mono text-xs">
                  No active file selected. Choose a file from the explorer.
                </div>
              )}
            </div>
          </div>

          {/* Bottom/Right: Output, Terminal & Problems Panel */}
          <div className={`overflow-hidden border-slate-200 dark:border-navy-750 ${
            settings.layout === "right"
              ? "w-5/12 border-l"
              : "h-2/5 border-t"
          }`}>
            <OutputPanel
              stdinInput={stdinInput}
              onStdinChange={setStdinInput}
              outputContent={outputContent}
              onClearOutput={() => setOutputContent("")}
              languageName={currentTool.name}
            />
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar
        cursorPosition={cursorPosition}
        language={activeFile?.language || currentTool.monacoLanguage}
        isSaving={isSaving}
        fileCount={project.files.filter((f) => !f.isFolder).length}
        wordCount={activeWordCount}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 right-6 z-50 px-4 py-2 bg-slate-900/90 text-white text-xs font-medium rounded-xl shadow-2xl backdrop-blur-md border border-slate-700 animate-slide-up flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
