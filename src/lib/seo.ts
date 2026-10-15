/**
 * OneCompilerHub — Centralized SEO & Search Indexing Configuration
 *
 * Provides structured metadata, canonical URL builders, keyword maps,
 * and Schema.org JSON-LD generators for search engine optimization.
 */

export const SITE_URL = "https://one-compiler-hub.vercel.app";
export const SITE_NAME = "OneCompilerHub";
export const SITE_DEFAULT_TITLE = "OneCompilerHub — Online Code Editor & Developer Workspace";
export const SITE_DEFAULT_DESCRIPTION =
  "Explore programming languages, edit code online, and build web projects with OneCompilerHub. Start coding with our browser-based developer workspace.";

export const SITE_DEFAULT_KEYWORDS = [
  "online code editor",
  "developer workspace",
  "browser IDE",
  "Monaco editor",
  "online compiler",
  "HTML live preview",
  "Python workspace",
  "JavaScript sandbox",
  "programming playground",
  "OneCompilerHub",
];

export interface ToolSeoConfig {
  slug: string;
  name: string;
  title: string;
  description: string;
  keywords: string[];
  isLivePreview?: boolean;
}

export const TOOL_SEO_MAP: Record<string, ToolSeoConfig> = {
  html: {
    slug: "html",
    name: "HTML, CSS & JavaScript",
    title: "Online HTML, CSS & JS Live Preview Playground — OneCompilerHub",
    description:
      "Write HTML, CSS, and client-side JavaScript with instant live browser preview, auto-refresh, console bridge, and responsive device testing in OneCompilerHub.",
    keywords: [
      "html online editor",
      "html live preview",
      "css playground",
      "javascript preview",
      "online html runner",
      "frontend sandbox",
      "web playground",
    ],
    isLivePreview: true,
  },
  python: {
    slug: "python",
    name: "Python",
    title: "Python Online Code Editor & Workspace — OneCompilerHub",
    description:
      "Write, inspect, and organize Python 3 code in a feature-rich browser workspace powered by Monaco Editor, syntax highlighting, and local persistence.",
    keywords: [
      "python online editor",
      "python browser workspace",
      "python ide online",
      "python code editor",
      "python monaco editor",
    ],
  },
  javascript: {
    slug: "javascript",
    name: "JavaScript",
    title: "JavaScript Online Code Editor & Playground — OneCompilerHub",
    description:
      "Write and test modern ECMAScript/JavaScript in an interactive developer editor with syntax checking, file explorer, and customizable themes.",
    keywords: [
      "javascript online editor",
      "js playground",
      "ecmascript editor",
      "online javascript ide",
      "javascript sandbox",
    ],
  },
  java: {
    slug: "java",
    name: "Java",
    title: "Java Online Code Editor & Workspace — OneCompilerHub",
    description:
      "Explore Java object-oriented programming in a browser-based Monaco code editor with multi-file management and clean dark mode.",
    keywords: [
      "java online editor",
      "java code workspace",
      "online java ide",
      "java developer editor",
      "learn java online",
    ],
  },
  mysql: {
    slug: "mysql",
    name: "MySQL",
    title: "MySQL Online Query Editor & SQL Workspace — OneCompilerHub",
    description:
      "Craft, structure, and practice SQL queries and relational schema definitions in an intuitive in-browser MySQL workspace.",
    keywords: [
      "mysql online editor",
      "sql query editor",
      "mysql sandbox",
      "learn sql online",
      "relational database editor",
    ],
  },
  c: {
    slug: "c",
    name: "C",
    title: "C Language Online Code Editor & Workspace — OneCompilerHub",
    description:
      "Write and inspect ANSI C programs in a modern browser IDE featuring Monaco Editor, line numbers, and fast file management.",
    keywords: [
      "c programming online",
      "c online editor",
      "c code workspace",
      "c language ide",
      "online c compiler hub",
    ],
  },
  cpp: {
    slug: "cpp",
    name: "C++",
    title: "C++ Online Code Editor & Workspace — OneCompilerHub",
    description:
      "Develop and practice modern C++20 algorithms and data structures in a responsive browser IDE with tabbed navigation.",
    keywords: [
      "c++ online editor",
      "cpp code editor",
      "online cpp ide",
      "modern c++ workspace",
      "c++ algorithm playground",
    ],
  },
  php: {
    slug: "php",
    name: "PHP",
    title: "PHP Online Code Editor & Scripting Workspace — OneCompilerHub",
    description:
      "Write modern PHP 8 server-side scripts and web logic in a streamlined developer workspace with instant file saving.",
    keywords: [
      "php online editor",
      "php scripting workspace",
      "online php ide",
      "php 8 editor",
      "web backend editor",
    ],
  },
  csharp: {
    slug: "csharp",
    name: "C# (.NET)",
    title: "C# Online Code Editor & .NET Workspace — OneCompilerHub",
    description:
      "Edit C# and .NET source files in an advanced web environment with syntax highlighting, auto-indentation, and multi-file support.",
    keywords: [
      "csharp online editor",
      "c# web workspace",
      "dotnet editor online",
      "c# monaco ide",
    ],
  },
  fastapi: {
    slug: "fastapi",
    name: "FastAPI",
    title: "FastAPI Online Python API Workspace — OneCompilerHub",
    description:
      "Design and test modern, high-performance asynchronous Python REST APIs using FastAPI starter structures in OneCompilerHub.",
    keywords: [
      "fastapi online editor",
      "python api playground",
      "fastapi workspace",
      "rest api python editor",
    ],
  },
  lua: {
    slug: "lua",
    name: "Lua",
    title: "Lua Online Scripting Editor & Workspace — OneCompilerHub",
    description:
      "Write lightweight, embeddable Lua scripts for game scripting and algorithms in a fast browser-based code editor.",
    keywords: [
      "lua online editor",
      "lua script playground",
      "lua ide online",
      "game scripting editor",
    ],
  },
  plsql: {
    slug: "plsql",
    name: "PL/SQL",
    title: "PL/SQL Online Procedure & Query Editor — OneCompilerHub",
    description:
      "Practice Oracle PL/SQL procedural blocks, stored procedures, and triggers in a dedicated database developer workspace.",
    keywords: [
      "plsql online editor",
      "oracle plsql playground",
      "sql procedural workspace",
      "stored procedure editor",
    ],
  },
  nodejs: {
    slug: "nodejs",
    name: "Node.js",
    title: "Node.js Online JavaScript Runtime Workspace — OneCompilerHub",
    description:
      "Explore server-side JavaScript and asynchronous event-driven backend patterns in a browser-based Node.js code workspace.",
    keywords: [
      "nodejs online editor",
      "node js playground",
      "backend javascript workspace",
      "server side js editor",
    ],
  },
  mongodb: {
    slug: "mongodb",
    name: "MongoDB",
    title: "MongoDB Online NoSQL Query Editor — OneCompilerHub",
    description:
      "Draft, format, and structure MongoDB aggregation pipelines and JSON document queries in a focused NoSQL workspace.",
    keywords: [
      "mongodb online editor",
      "nosql query editor",
      "mongo playground",
      "json document editor",
    ],
  },
  "spring-boot": {
    slug: "spring-boot",
    name: "Spring Boot",
    title: "Spring Boot Online Java Framework Workspace — OneCompilerHub",
    description:
      "Explore enterprise Java architecture, dependency injection, and REST controllers with Spring Boot starter templates.",
    keywords: [
      "spring boot online editor",
      "java enterprise workspace",
      "spring framework playground",
      "microservices java editor",
    ],
  },
  react: {
    slug: "react",
    name: "React",
    title: "React Online JSX Component Workspace — OneCompilerHub",
    description:
      "Build and edit modular React component structures, JSX layouts, and UI state hooks in a modern developer workspace.",
    keywords: [
      "react online editor",
      "jsx playground",
      "react component editor",
      "frontend react workspace",
    ],
  },
  postgresql: {
    slug: "postgresql",
    name: "PostgreSQL",
    title: "PostgreSQL Online Query & Schema Workspace — OneCompilerHub",
    description:
      "Write standard SQL, complex CTEs, JSONB queries, and relational schemas in an online PostgreSQL developer workspace.",
    keywords: [
      "postgresql online editor",
      "postgres query playground",
      "sql database editor",
      "postgres schema workspace",
    ],
  },
  pygame: {
    slug: "pygame",
    name: "Pygame",
    title: "Pygame Online Python Game Development Workspace — OneCompilerHub",
    description:
      "Prototype 2D game loops, event handlers, and sprite graphics using Python and Pygame in a developer-friendly coding workspace.",
    keywords: [
      "pygame online editor",
      "python game playground",
      "pygame workspace",
      "game development python",
    ],
  },
};

/**
 * Returns the canonical URL for any site path.
 */
export function getCanonicalUrl(path = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return cleanPath === "/" ? SITE_URL : `${SITE_URL}${cleanPath}`;
}

/**
 * JSON-LD Schema: WebSite with SearchAction
 */
export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}#tools`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * JSON-LD Schema: Organization
 */
export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    sameAs: ["https://github.com/inam11590/onecompilerhub"],
    description:
      "OneCompilerHub is a modern developer platform and online coding workspace for 18 programming languages, web stacks, and databases.",
  };
}

/**
 * JSON-LD Schema: SoftwareApplication
 */
export function getSoftwareApplicationJsonLd(toolSlug?: string) {
  if (toolSlug && TOOL_SEO_MAP[toolSlug]) {
    const tool = TOOL_SEO_MAP[toolSlug];
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `${tool.name} Playground — ${SITE_NAME}`,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any / Web Browser",
      url: getCanonicalUrl(`/tools/${tool.slug}`),
      description: tool.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: tool.isLivePreview
        ? "Live HTML/CSS/JS preview, auto-refresh, sandboxed execution, console output"
        : "Monaco code editor, syntax highlighting, multi-file management, local persistence",
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any / Web Browser",
    url: SITE_URL,
    description: SITE_DEFAULT_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList:
      "18 programming languages, HTML live preview, Monaco Editor, file management, dark mode, responsive workspace",
  };
}

/**
 * JSON-LD Schema: BreadcrumbList
 */
export function getBreadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}
