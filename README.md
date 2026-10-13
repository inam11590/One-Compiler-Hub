# OneCompilerHub — Step 2 Advanced Navigation, Smart Search & Tool Discovery

> **World-Class Online Coding Platform & Developer Playground**  
> Build, experiment, and explore 18 programming environments directly in your browser with a modern SaaS developer workspace.

[![Live Website](https://img.shields.io/badge/Live-Vercel-blue?style=flat-square)](https://one-compiler-hub.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-OneCompilerHub-black?style=flat-square&logo=github)](https://github.com/inam11590/onecompilerhub)

---

## 🚀 Overview

**OneCompilerHub** is engineered for developers, students, and educators who need a fast, zero-configuration online coding environment across 18 modern programming languages, web stacks, and databases.

### Step 2 Milestone Scope
- **Professional Navigation & Dropdowns**: Active route highlighting with `usePathname()`, accessible desktop dropdown menus for *Compilers*, *Web Development*, and *Databases*, and a mobile navigation drawer that closes automatically upon selection.
- **Smart Client-Side Search**: Instant keyword matching, case-insensitive substring search, search suggestion chips, alias resolution (e.g. `py` → Python/Pygame; `cpp` → C++; `database` → MySQL/PostgreSQL/MongoDB/PL/SQL; `backend` → FastAPI/Spring Boot/Node.js), and full keyboard navigation (↑ / ↓ / ↵ / ESC).
- **Category Filtering**: Dual-filter architecture uniting category pills (*All Tools*, *Popular*, *Programming Languages*, *Web Development*, *Databases*, *Frameworks*) with real-time text search.
- **Dedicated Tool Pages (`/tools/[slug]`)**: Dynamic App Router routes pre-rendered for all 18 tools with technical introductions, 4 core capability cards, beginner-friendly learning guides, related technology graphs, and embedded Monaco code workspaces.
- **Curated Explore Experience (`/explore`)**: Editorial selections for featured full-stack technologies, popular languages, and beginner-friendly stacks (zero fake statistics or user counts).
- **Category Directory Pages**: Dedicated routes for `/compilers`, `/web-development`, and `/databases`.
- **Production SEO & Sitemap**: Automated `sitemap.xml` and `robots.txt` generation via App Router metadata.

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

1. **HTML** (`/tools/html`) — HTML5 Semantic Web
2. **Python** (`/tools/python`) — Python 3.11 Runtime
3. **JavaScript** (`/tools/javascript`) — Modern ECMAScript 2024
4. **Java** (`/tools/java`) — Java 21 LTS Enterprise
5. **MySQL** (`/tools/mysql`) — Relational SQL Queries
6. **C** (`/tools/c`) — C17 Bare-Metal Systems
7. **C++** (`/tools/cpp`) — C++20 High Performance
8. **PHP** (`/tools/php`) — PHP 8.3 Web Scripting
9. **C#** (`/tools/csharp`) — .NET 8 Modern Runtime
10. **FastAPI** (`/tools/fastapi`) — Python High-Speed Async APIs
11. **Lua** (`/tools/lua`) — Lua 5.4 Game & Systems Scripting
12. **PL/SQL** (`/tools/plsql`) — Procedural SQL & Database Logic
13. **Node.js** (`/tools/nodejs`) — V8 Event-Driven Backend
14. **MongoDB** (`/tools/mongodb`) — NoSQL Document Queries
15. **Spring Boot** (`/tools/spring-boot`) — Java Enterprise Microservices
16. **React** (`/tools/react`) — Component-Based UI Playground
17. **PostgreSQL** (`/tools/postgresql`) — Advanced Object-Relational SQL
18. **Pygame** (`/tools/pygame`) — 2D Game Loop Engine

---

## 🧩 Architectural Features

### 1. Navigation & Dropdowns
- Sticky header with backdrop blur.
- Hover & keyboard-friendly dropdowns for major tool categories.
- Active page indicator synced with Next.js router.
- Mobile drawer navigation with sub-links.
- Universal `⌘K` search shortcut palette.

### 2. Smart Search & Filters
- Real-time search by name, category, file extension, and rich search keywords/aliases.
- Search suggestions for common paradigms (e.g., Python, C++, Backend, Databases).
- Matching term highlight rendering.
- Arrow key navigation with Enter selection.

### 3. Dynamic Tool Routes (`/tools/[slug]`)
- Pre-rendered static generation via `generateStaticParams`.
- Breadcrumb navigation (`Home > Tools > Name`).
- Key features, beginner guides, and related stack links.
- Interactive Monaco editor preview loaded with that tool's template.

### 4. SEO & Indexing
- Dynamic metadata generator for every tool route.
- Canonical URL declarations.
- Automated `sitemap.xml` mapping all 18 tool pages and category routes.
- Standard `robots.txt`.

---

## 📁 Project Structure

```
OneCompilerHub/
├── src/
│   ├── app/
│   │   ├── compilers/           # /compilers category page
│   │   ├── databases/           # /databases category page
│   │   ├── explore/             # /explore curated discovery page
│   │   ├── web-development/     # /web-development category page
│   │   ├── tools/[slug]/        # Dynamic reusable tool page component
│   │   ├── fonts/               # Geist font files
│   │   ├── globals.css          # Theme tokens, scrollbars, utility styles
│   │   ├── layout.tsx           # Root layout, ThemeProvider, global metadata
│   │   ├── page.tsx             # Main dashboard
│   │   ├── robots.ts            # Search engine crawl rules
│   │   └── sitemap.ts           # Dynamic XML sitemap generator
│   ├── components/
│   │   ├── auth-modal.tsx       # Auth UI dialog placeholder
│   │   ├── faq.tsx              # Accessible accordion FAQ
│   │   ├── footer.tsx           # Footer with legal & info modal dialogs
│   │   ├── hero.tsx             # Hero section with interactive preview
│   │   ├── how-it-works.tsx     # 3-step workflow guide
│   │   ├── logo.tsx             # Custom SVG hex-shield brand logo
│   │   ├── navbar.tsx           # Sticky navbar with dropdowns & active states
│   │   ├── search-dialog.tsx    # Smart search palette with keyboard navigation
│   │   ├── theme-provider.tsx   # next-themes integration
│   │   ├── theme-toggle.tsx     # Dark/light mode toggle
│   │   ├── tool-detail-modal.tsx# Coming Soon & Playground launcher modal
│   │   ├── tool-icons.tsx       # Vector tech brand icons
│   │   ├── tools-grid.tsx       # 18-tool filterable grid with smart search
│   │   ├── why-us.tsx           # Platform benefits section
│   │   └── workspace.tsx        # Monaco editor workspace with tabbed panels
│   ├── data/
│   │   └── tools.ts             # 18 tools data, keywords, aliases, search helpers
│   ├── lib/
│   │   └── utils.ts             # Tailwind class merging utility
│   └── types/
│       └── index.ts             # Type definitions
├── tailwind.config.ts           # Design system configuration
├── tsconfig.json                # TypeScript strict config
└── package.json                 # Dependencies and build scripts
```

---

## 💻 Commands

```bash
# Start development server
npm run dev

# Run static type checking & ESLint
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```
