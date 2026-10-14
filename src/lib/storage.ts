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

  // If HTML tool, initialize with the three-file architecture (index.html, style.css, script.js)
  if (tool.slug === "html") {
    const htmlFileId = "file-html";
    const cssFileId = "file-css";
    const jsFileId = "file-js";
    const readmeFileId = "file-readme";

    const files: WorkspaceFile[] = [
      {
        id: htmlFileId,
        name: "index.html",
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OneCompilerHub — Live HTML Preview</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="container">
    <div class="card">
      <div class="badge">Live Playground</div>
      <h1 class="title">Hello, <span class="gradient-text">OneCompilerHub!</span></h1>
      <p class="subtitle">
        Write HTML, CSS & JavaScript and watch your changes render instantly in the isolated preview sandbox.
      </p>

      <div class="counter-box">
        <button id="counter-btn" class="btn" type="button">
          Clicks: <span id="count-value">0</span>
        </button>
        <button id="reset-btn" class="btn btn-outline" type="button">Reset</button>
      </div>

      <p id="feedback-msg" class="feedback">Click the button to test live DOM interactions!</p>
    </div>
  </main>

  <script src="script.js"></script>
</body>
</html>`,
        isFolder: false,
        parentId: null,
        language: "html",
        updatedAt: now,
      },
      {
        id: cssFileId,
        name: "style.css",
        path: "/style.css",
        content: `/* Modern responsive layout styling */
:root {
  --primary: #435bff;
  --primary-hover: #3246d8;
  --bg-gradient: linear-gradient(135deg, #0b0f19 0%, #131b2e 100%);
  --card-bg: rgba(26, 35, 58, 0.7);
  --card-border: rgba(67, 91, 255, 0.25);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
  background: var(--bg-gradient);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.container {
  width: 100%;
  max-width: 480px;
}

.card {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #818cf8;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 9999px;
  margin-bottom: 1rem;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin-bottom: 0.75rem;
}

.gradient-text {
  background: linear-gradient(135deg, #60a5fa 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.counter-box {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.btn {
  background: var(--primary);
  color: #ffffff;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(67, 91, 255, 0.3);
}

.btn-outline {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
  box-shadow: none;
}

.feedback {
  font-size: 0.85rem;
  color: #38bdf8;
  min-height: 1.25rem;
}`,
        isFolder: false,
        parentId: null,
        language: "css",
        updatedAt: now,
      },
      {
        id: jsFileId,
        name: "script.js",
        path: "/script.js",
        content: `// OneCompilerHub - Live Interactive JavaScript
console.log("🚀 HTML Playground running in isolated sandbox!");

let count = 0;
const countDisplay = document.getElementById("count-value");
const counterBtn = document.getElementById("counter-btn");
const resetBtn = document.getElementById("reset-btn");
const feedbackMsg = document.getElementById("feedback-msg");

if (counterBtn && countDisplay) {
  counterBtn.addEventListener("click", () => {
    count += 1;
    countDisplay.textContent = count;
    if (feedbackMsg) {
      feedbackMsg.textContent = \`You clicked \${count} time\${count === 1 ? "" : "s"}!\`;
    }
    console.log("Click event dispatched:", { clicks: count, timestamp: new Date().toLocaleTimeString() });
  });
}

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (count === 0) return;
    console.info("Resetting count from:", count);
    count = 0;
    if (countDisplay) countDisplay.textContent = "0";
    if (feedbackMsg) feedbackMsg.textContent = "Counter reset to zero.";
  });
}
`,
        isFolder: false,
        parentId: null,
        language: "javascript",
        updatedAt: now,
      },
      {
        id: readmeFileId,
        name: "README.md",
        path: "/README.md",
        content: `# HTML, CSS & JavaScript Playground\n\nWelcome to your three-file live web playground in **OneCompilerHub**.\n\n### Project Files\n- **index.html**: Document structure & markup\n- **style.css**: CSS layout and visual theme\n- **script.js**: Client-side interactive JavaScript & DOM events\n\n### Live Features\n- **Real-Time Preview**: Updates automatically as you edit files\n- **Isolated Sandbox**: Sandboxed iframe with CSP network containment\n- **Live Console**: Intercepts console.log, warnings, and errors in the Console tab\n- **Device Switcher**: Test responsive layouts on Desktop, Tablet, and Mobile\n- **Export**: Download as separate files or a bundled ZIP\n\n*All edits autosave to your browser's IndexedDB storage.*`,
        isFolder: false,
        parentId: null,
        language: "markdown",
        updatedAt: now,
      },
    ];

    return {
      id: `project_html`,
      name: "HTML, CSS & JS Playground",
      toolSlug: "html",
      files,
      activeFileId: htmlFileId,
      openFileIds: [htmlFileId, cssFileId, jsFileId],
      createdAt: now,
      updatedAt: now,
    };
  }

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
          schema: "step5_backend",
          compilerExecution: "sandbox_security_verification",
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

