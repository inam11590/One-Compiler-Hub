# OneCompilerHub — Step 1 Frontend Foundation

> **World-Class Online Coding Platform & Developer Playground**  
> Build, experiment, and explore 18 programming environments directly in your browser with a modern SaaS developer workspace.

---

## 🚀 Overview

**OneCompilerHub** is designed for developers, students, and educators who need a fast, zero-configuration online coding environment. 

### Step 1 Milestone Scope
- **Frontend Design Foundation**: Complete responsive SaaS user interface built with Next.js 14 App Router, TypeScript, and Tailwind CSS.
- **18 Programming Environments**: Full technology catalog with vector icons, starter snippets, and filter metadata.
- **Monaco Code Editor**: VS Code-grade in-browser editor with syntax highlighting, file explorer, multi-tab terminal panels, and theme synchronization.
- **Demo Workspace**: Interactive simulation modes for visual verification; real compiler containers and execution backend will be connected in **Step 2**.

---

## 🎨 Design System

| Element | Specification |
| :--- | :--- |
| **Primary Brand Color** | Electric Blue (`#435BFF` / Tailwind `brand-500`) |
| **Secondary Accent** | Royal Purple (`#7955E8` / Tailwind `accent-500`) |
| **Light Theme** | Clean White (`#FFFFFF`) with slate neutral borders (`#E2E8F0`) |
| **Dark Theme** | Deep Navy / Charcoal (`#0B0F19` / `#0F1626` / `#131B2E`) |
| **Typography** | Geist Sans & Geist Mono (`next/font`) |
| **Micro-Interactions** | Card elevation, subtle gradient glows, smooth responsive transitions |

---

## 🛠️ The 18 Supported Developer Tools

OneCompilerHub provides dedicated starter templates and presets for 18 core environments:

1. **HTML** (HTML5 Semantic Web)
2. **Python** (Python 3.11 Runtime)
3. **JavaScript** (Modern ECMAScript 2024)
4. **Java** (Java 21 LTS Enterprise)
5. **MySQL** (Relational SQL Queries)
6. **C** (C17 Bare-Metal Systems)
7. **C++** (C++20 High Performance)
8. **PHP** (PHP 8.3 Web Scripting)
9. **C#** (.NET 8 Modern Runtime)
10. **FastAPI** (Python High-Speed Async APIs)
11. **Lua** (Lua 5.4 Game & Systems Scripting)
12. **PL/SQL** (Procedural SQL & Database Logic)
13. **Node.js** (V8 Event-Driven Backend)
14. **MongoDB** (NoSQL Document Queries)
15. **Spring Boot** (Java Enterprise Microservices)
16. **React** (Component-Based UI Playground)
17. **PostgreSQL** (Advanced Object-Relational SQL)
18. **Pygame** (2D Game Loop Engine)

---

## 🧩 Architectural Features

### 1. Navigation & Header
- Sticky responsive navigation with custom OneCompilerHub glowing hex-shield brand logo and wordmark.
- Filter category quick-nav: **Compilers**, **Web Development**, **Databases**, **Explore**.
- Quick search shortcut (`⌘K` modal) across all tools.
- Native Light/Dark mode toggle powered by `next-themes`.
- Auth dialog placeholders with developer sign-in UI (GitHub, Google, Email).

### 2. Homepage Hero
- Bold hero typography: *"Code Smarter. Build Faster."*
- Highlight message: *"OneCompilerHub — Your Online Coding Workspace"*
- Two prominent CTAs: **Start Coding** & **Explore Languages**.
- Interactive mini code editor preview with realistic Python code, syntax styling, line numbers, and simulated output panel.

### 3. Programming Tools Grid
- Client-side search bar filtering tool names, descriptions, categories, and file extensions in real-time.
- Category filters: **All Tools**, **Popular**, **Programming**, **Web Development**, **Databases**, **Frameworks**.
- Interactive tool cards with custom vector logos, hover animations, and *"Launch in Demo Workspace"* modal view.

### 4. Coding Workspace UI
- **File Explorer Sidebar**: Collapsible file tree with multiple files (`main.py`, `README.md`, `config.json`).
- **Language Selector Dropdown**: Instant switching between all 18 tools with automatic Monaco syntax mode and starter template reloading.
- **Monaco Code Editor**: Line numbers, word wrap, responsive sizing, and light/dark theme synchronization.
- **Toolbar Actions**: Run (Demo), Stop, Reset, Copy Code (with toast notification).
- **Tabbed Panels**: Output terminal, STDIN arguments input, static diagnostic reports.
- **Layout Modes**: Flexible side-by-side or stacked split layouts + Fullscreen editor toggle.
- **Demo Workspace Badge**: Clearly informs developers that real compilers are introduced in Step 2.

### 5. Additional Sections
- **Why OneCompilerHub?**: Highlights 5 core platform advantages.
- **How It Works**: 3 clear steps for developers.
- **Frequently Asked Questions**: Accessible, animated accordion addressing Step 1 vs Step 2, security, and supported languages.
- **Footer**: Brand wordmark, navigation links, and built-in modals for About, Contact, Privacy Policy, and Terms of Service (zero broken links).

---

## 📁 Project Structure

```
OneCompilerHub/
├── src/
│   ├── app/
│   │   ├── fonts/               # Geist font files
│   │   ├── globals.css          # CSS variables, theme classes, scrollbars
│   │   ├── layout.tsx           # SEO metadata, ThemeProvider, viewport config
│   │   └── page.tsx             # Main OneCompilerHub dashboard
│   ├── components/
│   │   ├── auth-modal.tsx       # Sign-in / Sign-up dialog placeholder
│   │   ├── faq.tsx              # Accessible FAQ accordion component
│   │   ├── footer.tsx           # Footer with legal and support modals
│   │   ├── hero.tsx             # Hero section with interactive preview
│   │   ├── how-it-works.tsx     # 3-step workflow section
│   │   ├── logo.tsx             # OneCompilerHub custom SVG logo & wordmark
│   │   ├── navbar.tsx           # Sticky responsive navbar & mobile menu
│   │   ├── search-dialog.tsx    # Modal search palette (⌘K)
│   │   ├── theme-provider.tsx   # next-themes integration wrapper
│   │   ├── theme-toggle.tsx     # Light/Dark mode toggle button
│   │   ├── tool-detail-modal.tsx# Coming Soon & Playground preview modal
│   │   ├── tool-icons.tsx       # 18 official SVG tech icons
│   │   ├── tools-grid.tsx       # Interactive 18-tool filterable grid
│   │   ├── why-us.tsx           # Platform benefits section
│   │   └── workspace.tsx        # Monaco editor workspace with tabbed panels
│   ├── data/
│   │   └── tools.ts             # Metadata & starter code for 18 tools
│   ├── lib/
│   │   └── utils.ts             # Tailwind class merge utility
│   └── types/
│       └── index.ts             # TypeScript interfaces for tools and categories
├── tailwind.config.ts           # Electric Blue & Deep Navy design tokens
├── tsconfig.json                # TypeScript compiler configuration
└── package.json                 # Dependencies and build scripts
```

---

## 💻 Getting Started

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm 9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Static Type Checking & Linting
```bash
npm run lint
```

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🔒 Roadmap (Step 2 Preview)

- Containerized compiler backends (Docker/gVisor sandboxes)
- Live stdout / stderr streaming over WebSockets
- Safe execution timeouts and memory limits
- Real database execution engines for PostgreSQL and MySQL
- User accounts and cloud project persistence
