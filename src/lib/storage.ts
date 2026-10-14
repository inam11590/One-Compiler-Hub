import { WorkspaceProject, WorkspaceFile, EditorSettings } from "@/types";
import { PROGRAMMING_TOOLS, getToolBySlug } from "@/data/tools";

const DB_NAME = "onecompilerhub_ide_db";
const DB_VERSION = 1;
const STORE_NAME = "projects";

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  tabSize: 2,
  wordWrap: "on",
  minimap: true,
  lineNumbers: "on",
  autoClosingBrackets: "always",
  layout: "bottom",
  theme: "auto",
};

// Helper: Map file extension to Monaco Editor language
export function getLanguageFromFileName(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "py":
      return "python";
    case "js":
    case "jsx":
    case "mjs":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "html":
    case "htm":
      return "html";
    case "css":
    case "scss":
    case "sass":
      return "css";
    case "json":
      return "json";
    case "sql":
      return "sql";
    case "java":
      return "java";
    case "c":
    case "h":
      return "c";
    case "cpp":
    case "hpp":
    case "cc":
    case "cxx":
      return "cpp";
    case "cs":
      return "csharp";
    case "php":
      return "php";
    case "lua":
      return "lua";
    case "md":
    case "markdown":
      return "markdown";
    case "yaml":
    case "yml":
      return "yaml";
    case "xml":
      return "xml";
    default:
      return "plaintext";
  }
}

// Generate starter project files for each tool
export function createStarterProject(toolSlug: string): WorkspaceProject {
  const tool = getToolBySlug(toolSlug) || PROGRAMMING_TOOLS[1]; // default python
  const now = Date.now();

  const primaryFileId = "file-primary";
  const readmeFileId = "file-readme";
  const configFileId = "file-config";

  const files: WorkspaceFile[] = [
    {
      id: primaryFileId,
      name: tool.fileName,
      path: `/${tool.fileName}`,
      content: tool.defaultCode,
      isFolder: false,
      parentId: null,
      language: tool.monacoLanguage,
      updatedAt: now,
    },
    {
      id: readmeFileId,
      name: "README.md",
      path: "/README.md",
      content: `# ${tool.name} Project Playground\n\nWelcome to your ${tool.name} coding environment in OneCompilerHub.\n\n### Tech Stack Info\n- **Runtime/Language**: ${tool.name}\n- **Category**: ${tool.category}\n- **File Extension**: .${tool.fileExtension}\n\n*All files in this project are autosaved locally in your browser's IndexedDB storage.*`,
      isFolder: false,
      parentId: null,
      language: "markdown",
      updatedAt: now,
    },
    {
      id: configFileId,
      name: "onecompiler.json",
      path: "/onecompiler.json",
      content: JSON.stringify(
        {
          project: `${tool.name} Workspace`,
          environment: tool.id,
          version: "1.0.0",
          schema: "step3_ide",
          compilerExecution: "scheduled_for_step4",
        },
        null,
        2
      ),
      isFolder: false,
      parentId: null,
      language: "json",
      updatedAt: now,
    },
  ];

  return {
    id: `project_${tool.slug}`,
    name: `${tool.name} Playground`,
    toolSlug: tool.slug,
    files,
    activeFileId: primaryFileId,
    openFileIds: [primaryFileId, readmeFileId],
    createdAt: now,
    updatedAt: now,
  };
}

// IndexedDB Helper
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB not available"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save Project into IndexedDB (with localStorage fallback)
export async function saveProject(project: WorkspaceProject): Promise<void> {
  if (typeof window === "undefined") return;

  project.updatedAt = Date.now();

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(project);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB save failed, falling back to localStorage", err);
    try {
      localStorage.setItem(`onecompiler_${project.id}`, JSON.stringify(project));
    } catch (localErr) {
      console.error("Local storage also failed", localErr);
    }
  }
}

// Load Project from IndexedDB (with localStorage fallback)
export async function loadProject(toolSlug: string): Promise<WorkspaceProject | null> {
  if (typeof window === "undefined") return null;

  const projectId = `project_${toolSlug.toLowerCase()}`;

  try {
    const db = await openDB();
    const result = await new Promise<WorkspaceProject | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(projectId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });

    if (result) return result;
  } catch (err) {
    console.warn("IndexedDB load failed, trying localStorage fallback", err);
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(`onecompiler_${projectId}`);
    if (local) {
      return JSON.parse(local) as WorkspaceProject;
    }
  } catch (localErr) {
    console.error("Error reading from localStorage", localErr);
  }

  return null;
}

// Editor Settings Management
export function loadEditorSettings(): EditorSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const saved = localStorage.getItem("onecompiler_settings");
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export function saveEditorSettings(settings: EditorSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("onecompiler_settings", JSON.stringify(settings));
  } catch {
    // ignore
  }
}

// Project Export as JSON File
export function exportProjectAsJSON(project: WorkspaceProject): void {
  if (typeof window === "undefined") return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${project.toolSlug}-project-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Project Import from JSON String
export function parseProjectJSON(jsonString: string): WorkspaceProject {
  const parsed = JSON.parse(jsonString);
  if (!parsed.files || !Array.isArray(parsed.files)) {
    throw new Error("Invalid project structure: missing files list");
  }
  return parsed as WorkspaceProject;
}

// List all saved local projects (from IndexedDB with localStorage fallback)
export async function listAllProjects(): Promise<WorkspaceProject[]> {
  if (typeof window === "undefined") return [];

  const projects: WorkspaceProject[] = [];

  try {
    const db = await openDB();
    const dbProjects = await new Promise<WorkspaceProject[]>((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    }
  } catch (err) {
    console.warn("IndexedDB getAll failed, falling back to localStorage", err);
  }

  // Fallback to localStorage keys
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("onecompiler_project_")) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item) as WorkspaceProject;
            if (parsed.id && parsed.toolSlug) {
              projects.push(parsed);
            }
          } catch {
            // ignore malformed items
          }
        }
      }
    }
  } catch {
    // ignore
  }

  return projects.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

