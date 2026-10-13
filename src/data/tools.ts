import { ProgrammingTool, ToolCategory } from "@/types";

export const PROGRAMMING_TOOLS: ProgrammingTool[] = [
  {
    id: "html",
    name: "HTML",
    slug: "html",
    category: "web",
    categories: ["all", "popular", "web"],
    isPopular: true,
    isFeatured: true,
    isBeginnerFriendly: true,
    availabilityStatus: "available_demo",
    shortDescription: "Structure modern web pages with semantic HTML5 elements.",
    longDescription: "HyperText Markup Language (HTML5) forms the backbone of web layout, accessible UI, and semantic document structures worldwide.",
    searchKeywords: ["html", "html5", "web", "frontend", "markup", "tags", "dom", "ui", "website"],
    aliases: ["html5", "htm"],
    iconName: "html",
    accentColor: "#E44D26",
    badgeBg: "bg-orange-500/10 dark:bg-orange-500/20",
    badgeText: "text-orange-600 dark:text-orange-400",
    fileExtension: "html",
    monacoLanguage: "html",
    fileName: "index.html",
    features: [
      "Semantic elements for modern accessible layouts (<header>, <main>, <nav>)",
      "Native multimedia support for audio, video, and scalable SVG vectors",
      "Form validation with built-in input types, patterns, and constraints",
      "Standard document structure for web browsers and search engine indexers"
    ],
    beginnerExplanation: "HTML is the essential first step for any aspiring web developer. It provides the core skeleton of every page on the internet, allowing you to organize text, images, and links effortlessly.",
    relatedToolSlugs: ["javascript", "react", "nodejs"],
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OneCompilerHub Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0b0f19; color: #fff; padding: 2rem; }
    .card { background: #131b2e; padding: 1.5rem; border-radius: 12px; border: 1px solid #435bff; }
    h1 { color: #435bff; margin-top: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Welcome to OneCompilerHub</h1>
    <p>Crafting modern, accessible web applications starts with semantic HTML5.</p>
  </div>
</body>
</html>`,
    mockOutput: `[DOM Render Emulation]
Document parsed successfully.
Render Tree:
  <html>
    <body>
      <div class="card">
        <h1>Welcome to OneCompilerHub</h1>
        <p>Crafting modern, accessible web applications...</p>
      </div>
Render complete: 0 warnings, 0 errors.`,
    mockExecutionTime: "18ms",
  },
  {
    id: "python",
    name: "Python",
    slug: "python",
    category: "programming",
    categories: ["all", "popular", "programming"],
    isPopular: true,
    isFeatured: true,
    isBeginnerFriendly: true,
    availabilityStatus: "available_demo",
    shortDescription: "Versatile, readable programming for algorithms, AI, and scripts.",
    longDescription: "Python 3 is a dynamic, multi-paradigm language loved for its elegance, clean syntax, data science ecosystems, and backend development.",
    searchKeywords: ["python", "py", "python3", "backend", "ai", "machine learning", "data science", "automation", "scripting"],
    aliases: ["py", "py3", "python3"],
    iconName: "python",
    accentColor: "#3776AB",
    badgeBg: "bg-blue-500/10 dark:bg-blue-500/20",
    badgeText: "text-blue-600 dark:text-blue-400",
    fileExtension: "py",
    monacoLanguage: "python",
    fileName: "main.py",
    features: [
      "Ultra-clean, whitespace-sensitive syntax optimized for readability",
      "Vast standard library and package ecosystem (PyPI) for data science and AI",
      "Dynamic typing with optional type annotations (PEP 484)",
      "High developer productivity and fast prototyping cycles"
    ],
    beginnerExplanation: "Python is widely considered the best programming language for beginners. Its syntax reads almost like English, allowing you to focus on logical problem-solving rather than complex boilerplate.",
    relatedToolSlugs: ["fastapi", "pygame", "c", "javascript"],
    defaultCode: `# OneCompilerHub - Python Workspace Preview
def greet_developer(name: str) -> str:
    languages = ["Python", "TypeScript", "C++", "Rust"]
    print(f"🚀 Hello, {name}!")
    print("Available playground environments:")
    for idx, lang in enumerate(languages, 1):
        print(f"  {idx}. {lang}")
    return f"Ready to build with {len(languages)} technologies."

if __name__ == "__main__":
    result = greet_developer("Innovator")
    print("-" * 40)
    print(f"Status: {result}")
`,
    mockOutput: `🚀 Hello, Innovator!
Available playground environments:
  1. Python
  2. TypeScript
  3. C++
  4. Rust
----------------------------------------
Status: Ready to build with 4 technologies.

[Process completed with exit code 0]`,
    mockExecutionTime: "42ms",
  },
  {
    id: "javascript",
    name: "JavaScript",
    slug: "javascript",
    category: "programming",
    categories: ["all", "popular", "programming", "web"],
    isPopular: true,
    isFeatured: true,
    isBeginnerFriendly: true,
    availabilityStatus: "available_demo",
    shortDescription: "The universal language of modern interactive web development.",
    longDescription: "ECMAScript 2024 powers everything from client-side UI logic and asynchronous interactions to full-stack server runtimes and desktop tooling.",
    searchKeywords: ["javascript", "js", "web", "frontend", "backend", "browser", "ecmascript", "scripting", "node"],
    aliases: ["js", "es6", "ecmascript"],
    iconName: "javascript",
    accentColor: "#F7DF1E",
    badgeBg: "bg-amber-500/10 dark:bg-amber-500/20",
    badgeText: "text-amber-600 dark:text-amber-400",
    fileExtension: "js",
    monacoLanguage: "javascript",
    fileName: "script.js",
    features: [
      "Native execution in every web browser without plugins or compilers",
      "Asynchronous event-driven architecture using Promises and async/await",
      "Dynamic object prototyping and first-class functional programming",
      "Full-stack versatility across browser, mobile, and server environments"
    ],
    beginnerExplanation: "JavaScript brings web pages to life with interactivity, animations, and real-time data fetching. Learning JS unlocks both frontend web design and backend server development.",
    relatedToolSlugs: ["react", "nodejs", "html", "php"],
    defaultCode: `// OneCompilerHub - JavaScript Playground
const calculateStats = (numbers) => {
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  const avg = (sum / numbers.length).toFixed(2);
  const max = Math.max(...numbers);
  const min = Math.min(...numbers);
  return { sum, avg, max, min };
};

const scores = [88, 92, 79, 95, 100, 84];
console.log("Analyzing developer metrics...");
console.table(calculateStats(scores));
`,
    mockOutput: `Analyzing developer metrics...
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│ sum     │ 538    │
│ avg     │ '89.67'│
│ max     │ 100    │
│ min     │ 79     │
└─────────┴────────┘

[Node runtime simulation: exited with code 0]`,
    mockExecutionTime: "31ms",
  },
  {
    id: "java",
    name: "Java",
    slug: "java",
    category: "programming",
    categories: ["all", "popular", "programming"],
    isPopular: true,
    isFeatured: true,
    isBeginnerFriendly: false,
    availabilityStatus: "available_demo",
    shortDescription: "Robust, object-oriented language for enterprise architectures.",
    longDescription: "Java provides type safety, multithreading, and rock-solid backwards compatibility for enterprise platforms, cloud backends, and Android applications.",
    searchKeywords: ["java", "jvm", "enterprise", "backend", "oop", "object oriented", "android", "spring"],
    aliases: ["jvm", "java21"],
    iconName: "java",
    accentColor: "#EA2D2E",
    badgeBg: "bg-red-500/10 dark:bg-red-500/20",
    badgeText: "text-red-600 dark:text-red-400",
    fileExtension: "java",
    monacoLanguage: "java",
    fileName: "Main.java",
    features: [
      "Write Once, Run Anywhere (WORA) philosophy powered by the JVM",
      "Strong static typing with robust compile-time error checking",
      "Modern concurrency enhancements including Virtual Threads (Project Loom)",
      "Extensive enterprise ecosystems powering global banking and e-commerce"
    ],
    beginnerExplanation: "Java teaches solid object-oriented programming foundations. It enforces clear architectural discipline and is among the most sought-after languages in major enterprises.",
    relatedToolSlugs: ["springboot", "csharp", "c"],
    defaultCode: `// OneCompilerHub - Java Enterprise Preview
import java.util.List;

public class Main {
    public static void main(String[] args) {
        System.out.println("Java 21 JVM Environment Initialized");
        
        List<String> modules = List.of("CompilerCore", "VirtualThreads", "PatternMatching");
        modules.forEach(mod -> System.out.println(" • Loaded subsystem: " + mod));
        
        System.out.println("\\nWorkspace ready for compilation.");
    }
}
`,
    mockOutput: `Java 21 JVM Environment Initialized
 • Loaded subsystem: CompilerCore
 • Loaded subsystem: VirtualThreads
 • Loaded subsystem: PatternMatching

Workspace ready for compilation.
[JVM termination code: 0]`,
    mockExecutionTime: "68ms",
  },
  {
    id: "mysql",
    name: "MySQL",
    slug: "mysql",
    category: "database",
    categories: ["all", "popular", "database"],
    isPopular: true,
    isFeatured: true,
    isBeginnerFriendly: true,
    availabilityStatus: "available_demo",
    shortDescription: "Reliable relational database management system for SQL queries.",
    longDescription: "MySQL is the most widely deployed open-source relational database, powering billions of transactional queries and web platforms.",
    searchKeywords: ["mysql", "sql", "database", "rdbms", "relational", "tables", "queries", "backend", "data"],
    aliases: ["sql", "rdbms"],
    iconName: "mysql",
    accentColor: "#4479A1",
    badgeBg: "bg-sky-500/10 dark:bg-sky-500/20",
    badgeText: "text-sky-600 dark:text-sky-400",
    fileExtension: "sql",
    monacoLanguage: "sql",
    fileName: "schema.sql",
    features: [
      "ACID-compliant relational transactions with InnoDB engine",
      "Standard SQL support including window functions, joins, and indexing",
      "High-speed read query performance and replica clustering",
      "Seamless integration with PHP, Node.js, Python, and Java backends"
    ],
    beginnerExplanation: "MySQL teaches you how to store, structure, and query structured tabular data using standard SQL syntax. It powers popular CMS platforms and modern web backends.",
    relatedToolSlugs: ["postgresql", "mongodb", "plsql", "php"],
    defaultCode: `-- OneCompilerHub - MySQL Relational Playground
CREATE TABLE developers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  primary_language VARCHAR(30) NOT NULL,
  experience_years INT DEFAULT 1
);

INSERT INTO developers (username, primary_language, experience_years) VALUES
  ('alex_codes', 'Python', 4),
  ('sarah_dev', 'TypeScript', 6),
  ('chen_cloud', 'Go', 3);

SELECT username, primary_language, experience_years 
FROM developers 
WHERE experience_years >= 3 
ORDER BY experience_years DESC;
`,
    mockOutput: `Query OK, 3 rows affected.
Record verification:
+-------------+------------------+------------------+
| username    | primary_language | experience_years |
+-------------+------------------+------------------+
| sarah_dev   | TypeScript       | 6                |
| alex_codes  | Python           | 4                |
| chen_cloud  | Go               | 3                |
+-------------+------------------+------------------+
3 rows in set (0.002 sec)`,
    mockExecutionTime: "24ms",
  },
  {
    id: "c",
    name: "C",
    slug: "c",
    category: "programming",
    categories: ["all", "programming"],
    isPopular: false,
    isFeatured: false,
    isBeginnerFriendly: false,
    availabilityStatus: "available_demo",
    shortDescription: "Low-level procedural foundation for systems, OS, and embedded.",
    longDescription: "The mother of modern programming languages, delivering direct memory manipulation and bare-metal performance.",
    searchKeywords: ["c", "systems", "embedded", "low level", "pointers", "memory", "compiler", "operating system"],
    aliases: ["c-lang", "ansi-c"],
    iconName: "c",
    accentColor: "#A8B9CC",
    badgeBg: "bg-slate-500/10 dark:bg-slate-500/20",
    badgeText: "text-slate-600 dark:text-slate-400",
    fileExtension: "c",
    monacoLanguage: "c",
    fileName: "main.c",
    features: [
      "Direct pointer manipulation and deterministic manual memory allocation",
      "Minimal runtime overhead and bare-metal execution efficiency",
      "Foundation of modern operating systems including Linux, macOS, and Windows",
      "Portable machine-level compiling across almost every CPU architecture"
    ],
    beginnerExplanation: "C reveals how computers genuinely work under the hood. By mastering pointers and memory management, you will understand operating systems and CPU memory architecture.",
    relatedToolSlugs: ["cpp", "python", "lua"],
    defaultCode: `// OneCompilerHub - C Language Systems Preview
#include <stdio.h>

int main(void) {
    int buffer_size = 1024;
    printf("[System init] C17 compiler ready.\\n");
    printf("Allocated buffer space: %d bytes\\n", buffer_size);
    
    for (int i = 0; i < 3; i++) {
        printf("Thread pipeline signal: 0x%04X\\n", (i * 0x1A4));
    }
    
    return 0;
}
`,
    mockOutput: `[System init] C17 compiler ready.
Allocated buffer space: 1024 bytes
Thread pipeline signal: 0x0000
Thread pipeline signal: 0x01A4
Thread pipeline signal: 0x0348

Program returned 0 (0x0)`,
    mockExecutionTime: "20ms",
  },
  {
    id: "cpp",
    name: "C++",
    slug: "cpp",
    category: "programming",
    categories: ["all", "popular", "programming"],
    isPopular: true,
    isFeatured: true,
    isBeginnerFriendly: false,
    availabilityStatus: "available_demo",
    shortDescription: "High-performance systems programming with templates and RAII.",
    longDescription: "C++20 delivers zero-cost abstractions, template metaprogramming, and ultra-high-speed memory safety for games, engines, and finance.",
    searchKeywords: ["cpp", "c++", "cplusplus", "game dev", "systems", "algorithms", "performance", "high speed"],
    aliases: ["c++", "cplusplus"],
    iconName: "cpp",
    accentColor: "#00599C",
    badgeBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    badgeText: "text-indigo-600 dark:text-indigo-400",
    fileExtension: "cpp",
    monacoLanguage: "cpp",
    fileName: "main.cpp",
    features: [
      "Zero-overhead abstractions and compile-time template metaprogramming",
      "RAII (Resource Acquisition Is Initialization) for deterministic lifecycle management",
      "Standard Template Library (STL) algorithms and data structures",
      "Used extensively in AAA game engines, quantitative finance, and aerospace"
    ],
    beginnerExplanation: "C++ combines the raw speed of C with modern object-oriented and functional abstractions. It is the gold standard for high-performance computing, competitive programming, and 3D game engines.",
    relatedToolSlugs: ["c", "csharp", "pygame", "java"],
    defaultCode: `// OneCompilerHub - C++20 High Performance Preview
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::vector<int> benchmarks = {120, 240, 360, 480};
    
    std::cout << "🚀 C++20 Simulation Core" << std::endl;
    int total = std::accumulate(benchmarks.begin(), benchmarks.end(), 0);
    
    std::cout << "Sum of benchmark frames: " << total << std::endl;
    std::cout << "Average throughput: " << (total / static_cast<double>(benchmarks.size())) << " FPS" << std::endl;
    return 0;
}
`,
    mockOutput: `🚀 C++20 Simulation Core
Sum of benchmark frames: 1200
Average throughput: 300 FPS

Process finished with exit code 0`,
    mockExecutionTime: "29ms",
  },
  {
    id: "php",
    name: "PHP",
    slug: "php",
    category: "programming",
    categories: ["all", "programming", "web"],
    isPopular: false,
    isFeatured: false,
    isBeginnerFriendly: true,
    availabilityStatus: "available_demo",
    shortDescription: "Server-side web scripting language powering dynamic websites.",
    longDescription: "PHP 8 offers modern JIT compilation, typed attributes, and union types powering major web backends and content management systems.",
    searchKeywords: ["php", "web", "backend", "server", "scripting", "wordpress", "laravel"],
    aliases: ["php8"],
    iconName: "php",
    accentColor: "#777BB4",
    badgeBg: "bg-purple-500/10 dark:bg-purple-500/20",
    badgeText: "text-purple-600 dark:text-purple-400",
    fileExtension: "php",
    monacoLanguage: "php",
    fileName: "index.php",
    features: [
      "Native HTML templating and dynamic server-side page generation",
      "Modern PHP 8+ features: Just-In-Time (JIT) compiler, typed properties, match expressions",
      "Massive ecosystem powering 75%+ of websites with frameworks like Laravel and Symfony",
      "Simple deployment model with zero complex build pipeline required"
    ],
    beginnerExplanation: "PHP was crafted specifically for the web. It lets you write server-side code alongside HTML immediately, making it very approachable for building dynamic portals and blogs.",
    relatedToolSlugs: ["html", "mysql", "javascript"],
    defaultCode: `<?php
// OneCompilerHub - PHP 8.3 Scripting Preview
declare(strict_types=1);

class ServiceStatus {
    public function __construct(
        public readonly string $serviceName,
        public readonly bool $isHealthy
    ) {}
}

$status = new ServiceStatus("OneCompilerHub Router", true);
echo "Service: " . $status->serviceName . "\\n";
echo "Status: " . ($status->isHealthy ? "ONLINE (Green)" : "OFFLINE") . "\\n";
`,
    mockOutput: `Service: OneCompilerHub Router
Status: ONLINE (Green)

[PHP 8.3 CLI execution complete]`,
    mockExecutionTime: "25ms",
  },
  {
    id: "csharp",
    name: "C#",
    slug: "csharp",
    category: "programming",
    categories: ["all", "programming"],
    isPopular: false,
    isFeatured: false,
    isBeginnerFriendly: false,
    availabilityStatus: "available_demo",
    shortDescription: "Modern, type-safe language for .NET, cloud, and cross-platform apps.",
    longDescription: "C# 12 is Microsoft's versatile, strongly typed language for cloud native services, Unity games, and cross-platform mobile apps.",
    searchKeywords: ["csharp", "c#", "dotnet", ".net", "unity", "game dev", "microsoft", "backend", "cloud"],
    aliases: ["c#", "dotnet", "cs"],
    iconName: "csharp",
    accentColor: "#239120",
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    fileExtension: "cs",
    monacoLanguage: "csharp",
    fileName: "Program.cs",
    features: [
      "Strong static typing with modern pattern matching and record types",
      "First-class async/await concurrency powered by the high-performance .NET runtime",
      "Primary language of the Unity game engine for 2D and 3D indie/AAA titles",
      "Cross-platform runtime targeting Windows, macOS, Linux, iOS, and Android"
    ],
    beginnerExplanation: "C# is an exceptionally polished and elegant language. Whether you want to build indie games in Unity or scalable enterprise web APIs in .NET, C# is an incredible tool.",
    relatedToolSlugs: ["java", "cpp", "pygame"],
    defaultCode: `// OneCompilerHub - C# .NET 8 Console
using System;

public class Program {
    public static void Main() {
        Console.WriteLine(".NET 8 Runtime Initialized");
        var appName = "OneCompilerHub";
        var version = "v1.0.0-demo";
        
        Console.WriteLine($"Platform: {appName} [{version}]");
        Console.WriteLine("All systems operational.");
    }
}
`,
    mockOutput: `.NET 8 Runtime Initialized
Platform: OneCompilerHub [v1.0.0-demo]
All systems operational.`,
    mockExecutionTime: "52ms",
  },
  {
    id: "fastapi",
    name: "FastAPI",
    slug: "fastapi",
    category: "framework",
    categories: ["all", "framework"],
    isPopular: false,
    isFeatured: true,
    isBeginnerFriendly: true,
    availabilityStatus: "available_demo",
    shortDescription: "High-performance Python API framework based on type hints.",
    longDescription: "FastAPI is a modern, ultra-fast web framework for building APIs with Python 3.8+ based on standard Python type hints.",
    searchKeywords: ["fastapi", "python", "api", "rest", "backend", "microservices", "async", "pydantic", "swagger"],
    aliases: ["fast-api"],
    iconName: "fastapi",
    accentColor: "#059669",
    badgeBg: "bg-teal-500/10 dark:bg-teal-500/20",
    badgeText: "text-teal-600 dark:text-teal-400",
    fileExtension: "py",
    monacoLanguage: "python",
    fileName: "app.py",
    features: [
      "Ultra-high performance on par with NodeJS and Go via Starlette and Pydantic",
      "Automatic interactive OpenAPI and Swagger API documentation out-of-the-box",
      "Asynchronous native event loop with Python async def endpoints",
      "Robust data validation and serialization based on Python 3 type hints"
    ],
    beginnerExplanation: "FastAPI makes building REST APIs in Python feel like magic. It automatically validates your data types and writes interactive Swagger API documentation for you.",
    relatedToolSlugs: ["python", "nodejs", "springboot"],
    defaultCode: `# OneCompilerHub - FastAPI Microservice
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="OneCompilerHub API")

class HealthResponse(BaseModel):
    status: str
    version: str
    sandbox_ready: bool

@app.get("/health", response_model=HealthResponse)
async def check_health():
    return HealthResponse(
        status="active",
        version="1.0-alpha",
        sandbox_ready=True
    )
`,
    mockOutput: `INFO:     Started server process [7801]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
GET /health -> 200 OK {"status":"active","version":"1.0-alpha","sandbox_ready":true}`,
    mockExecutionTime: "45ms",
  },
  {
    id: "lua",
    name: "Lua",
    slug: "lua",
    category: "programming",
    categories: ["all", "programming"],
    isPopular: false,
    isFeatured: false,
    isBeginnerFriendly: true,
    availabilityStatus: "available_demo",
    shortDescription: "Lightweight, embeddable scripting language for games and engines.",
    longDescription: "Lua is a powerful, efficient, lightweight scripting language used widely in game development (Roblox, World of Warcraft, Neovim).",
    searchKeywords: ["lua", "scripting", "roblox", "game dev", "embedded", "neovim", "lightweight"],
    aliases: ["lua54"],
    iconName: "lua",
    accentColor: "#000080",
    badgeBg: "bg-blue-600/10 dark:bg-blue-600/20",
    badgeText: "text-blue-700 dark:text-blue-300",
    fileExtension: "lua",
    monacoLanguage: "lua",
    fileName: "main.lua",
    features: [
      "Extremely small memory footprint and fast C/C++ embedding API",
      "Clean syntax with simple tables as the unified data structure",
      "Widely adopted in Roblox Studio game creation and Neovim editor configs",
      "Highly optimized JIT interpreter variants (LuaJIT)"
    ],
    beginnerExplanation: "Lua is a featherweight, friendly scripting language. Millions of young creators use it to script custom games in Roblox, making it a fun entry point into programming logic.",
    relatedToolSlugs: ["python", "pygame", "c"],
    defaultCode: `-- OneCompilerHub - Lua 5.4 Playground
function calculate_vector(x, y)
    local magnitude = math.sqrt(x^2 + y^2)
    return magnitude
end

print("Lua Game Engine Script Initialized")
local dist = calculate_vector(30, 40)
print(string.format("Calculated displacement: %.2f units", dist))
`,
    mockOutput: `Lua Game Engine Script Initialized
Calculated displacement: 50.00 units

[Lua 5.4 runtime finished]`,
    mockExecutionTime: "15ms",
  },
  {
    id: "plsql",
    name: "PL/SQL",
    slug: "plsql",
    category: "database",
    categories: ["all", "database"],
    isPopular: false,
    isFeatured: false,
    isBeginnerFriendly: false,
    availabilityStatus: "available_demo",
    shortDescription: "Procedural extension for SQL used in enterprise Oracle databases.",
    longDescription: "PL/SQL combines the data-manipulating power of SQL with the processing power of procedural languages.",
    searchKeywords: ["plsql", "pl/sql", "oracle", "sql", "database", "stored procedure", "triggers", "enterprise"],
    aliases: ["pl/sql", "oracle-plsql"],
    iconName: "plsql",
    accentColor: "#F80000",
    badgeBg: "bg-red-600/10 dark:bg-red-600/20",
    badgeText: "text-red-700 dark:text-red-300",
    fileExtension: "sql",
    monacoLanguage: "sql",
    fileName: "procedure.sql",
    features: [
      "Procedural control constructs (loops, conditions, exception blocks) inside SQL",
      "High-speed transaction processing with tight Oracle engine coupling",
      "Encapsulation into modular stored procedures, functions, and packages",
      "Critical component of core banking, insurance, and enterprise legacy systems"
    ],
    beginnerExplanation: "PL/SQL extends standard SQL queries by adding programming features like loops, variables, and error handling directly inside the database engine.",
    relatedToolSlugs: ["mysql", "postgresql"],
    defaultCode: `-- OneCompilerHub - PL/SQL Procedural Block
DECLARE
    v_total_tasks NUMBER := 25;
    v_completed   NUMBER := 18;
    v_percent     NUMBER;
BEGIN
    v_percent := (v_completed / v_total_tasks) * 100;
    DBMS_OUTPUT.PUT_LINE('=== OneCompilerHub Task Metrics ===');
    DBMS_OUTPUT.PUT_LINE('Completed: ' || v_completed || ' of ' || v_total_tasks);
    DBMS_OUTPUT.PUT_LINE('Progress:  ' || ROUND(v_percent, 2) || '%');
END;
/
`,
    mockOutput: `=== OneCompilerHub Task Metrics ===
Completed: 18 of 25
Progress:  72%

PL/SQL procedure successfully completed.`,
    mockExecutionTime: "33ms",
  },
  {
    id: "nodejs",
    name: "Node.js",
    slug: "nodejs",
    category: "web",
    categories: ["all", "popular", "web", "framework"],
    isPopular: true,
    isFeatured: true,
    isBeginnerFriendly: true,
    availabilityStatus: "available_demo",
    shortDescription: "Asynchronous, event-driven JavaScript backend runtime engine.",
    longDescription: "Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser.",
    searchKeywords: ["nodejs", "node", "javascript", "backend", "runtime", "npm", "server", "express", "api"],
    aliases: ["node", "node.js"],
    iconName: "nodejs",
    accentColor: "#339933",
    badgeBg: "bg-green-500/10 dark:bg-green-500/20",
    badgeText: "text-green-600 dark:text-green-400",
    fileExtension: "js",
    monacoLanguage: "javascript",
    fileName: "server.js",
    features: [
      "Non-blocking, event-driven I/O model powered by Chrome's V8 engine and libuv",
      "World's largest ecosystem of open-source packages via npm",
      "Unified full-stack JavaScript architecture across frontend and backend",
      "Ideal for microservices, real-time WebSockets, and developer tooling CLI apps"
    ],
    beginnerExplanation: "Node.js lets you run JavaScript on the server. If you already know frontend JS, Node.js lets you build backends, APIs, and web servers without learning a new language.",
    relatedToolSlugs: ["javascript", "react", "fastapi", "mongodb"],
    defaultCode: `// OneCompilerHub - Node.js Event Loop Preview
import http from 'http';

const PORT = 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: "Welcome to Node.js on OneCompilerHub",
    uptime: process.uptime(),
    nodeVersion: process.version
  }));
});

console.log(\`⚡ Server simulated on port \${PORT}\`);
`,
    mockOutput: `⚡ Server simulated on port 3000
V8 Engine Ready. Event loop active.
Memory RSS: 32.4 MB`,
    mockExecutionTime: "36ms",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    slug: "mongodb",
    category: "database",
    categories: ["all", "database"],
    isPopular: false,
    isFeatured: false,
    isBeginnerFriendly: true,
    availabilityStatus: "available_demo",
    shortDescription: "Document-oriented NoSQL database for flexible JSON-like schemas.",
    longDescription: "MongoDB stores data in flexible, JSON-like BSON documents, meaning fields can vary from document to document.",
    searchKeywords: ["mongodb", "mongo", "nosql", "database", "json", "bson", "documents", "collections", "backend"],
    aliases: ["mongo", "nosql"],
    iconName: "mongodb",
    accentColor: "#47A248",
    badgeBg: "bg-emerald-600/10 dark:bg-emerald-600/20",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    fileExtension: "js",
    monacoLanguage: "javascript",
    fileName: "mongo_queries.js",
    features: [
      "Flexible document schema modeled directly around JSON/BSON structures",
      "Powerful aggregation pipeline for complex analytical queries",
      "Horizontal scaling via automated sharding and replica sets",
      "Natural pairing with Node.js and modern JavaScript frontend applications"
    ],
    beginnerExplanation: "MongoDB stores data as JSON-style documents rather than rigid tables with rows and columns. It makes database storage feel just like working with normal JavaScript objects.",
    relatedToolSlugs: ["nodejs", "postgresql", "mysql"],
    defaultCode: `// OneCompilerHub - MongoDB Shell Operations
db.projects.insertMany([
  { name: "Frontend Sandbox", tech: ["React", "Tailwind"], stars: 120 },
  { name: "Python Compiler", tech: ["Python", "FastAPI"], stars: 340 }
]);

const popularProjects = db.projects.find({ stars: { $gte: 100 } })
  .sort({ stars: -1 })
  .toArray();

printjson(popularProjects);
`,
    mockOutput: `[
  {
    "_id": ObjectId("652e9a21e4b011..."),
    "name": "Python Compiler",
    "tech": [ "Python", "FastAPI" ],
    "stars": 340
  },
  {
    "_id": ObjectId("652e9a21e4b012..."),
    "name": "Frontend Sandbox",
    "tech": [ "React", "Tailwind" ],
    "stars": 120
  }
]`,
    mockExecutionTime: "30ms",
  },
  {
    id: "springboot",
    name: "Spring Boot",
    slug: "spring-boot",
    category: "framework",
    categories: ["all", "framework"],
    isPopular: false,
    isFeatured: false,
    isBeginnerFriendly: false,
    availabilityStatus: "available_demo",
    shortDescription: "Production-ready enterprise Java framework for microservices.",
    longDescription: "Spring Boot makes it easy to create stand-alone, production-grade Spring-based Applications that you can 'just run'.",
    searchKeywords: ["springboot", "spring boot", "java", "enterprise", "microservices", "backend", "api", "spring framework"],
    aliases: ["spring", "spring-boot"],
    iconName: "springboot",
    accentColor: "#6DB33F",
    badgeBg: "bg-lime-500/10 dark:bg-lime-500/20",
    badgeText: "text-lime-600 dark:text-lime-400",
    fileExtension: "java",
    monacoLanguage: "java",
    fileName: "Application.java",
    features: [
      "Opinionated auto-configuration eliminating repetitive XML boilerplate",
      "Embedded web servers (Tomcat, Jetty) built directly into executable JARs",
      "Production-ready monitoring and health metrics via Spring Actuator",
      "Comprehensive ecosystem for Spring Security, JPA Data, and cloud messaging"
    ],
    beginnerExplanation: "Spring Boot simplifies building enterprise-grade Java web backends. It handles dependency injection, server setup, and database connections with clean annotations.",
    relatedToolSlugs: ["java", "fastapi", "postgresql"],
    defaultCode: `package com.onecompilerhub.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @GetMapping("/api/status")
    public String status() {
        return "Spring Boot 3.2 Microservice Healthy";
    }
}
`,
    mockOutput: `  .   ____          _            __ _ _
 /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\
( ( )\\___ | '_ | '_| | '_ \\/ _\` | \\ \\ \\ \\
 \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

Started Application in 1.421 seconds (process running for 1.78)
Tomcat started on port 8080 (http) with context path ''`,
    mockExecutionTime: "110ms",
  },
  {
    id: "react",
    name: "React",
    slug: "react",
    category: "framework",
    categories: ["all", "popular", "web", "framework"],
    isPopular: true,
    isFeatured: true,
    isBeginnerFriendly: true,
    availabilityStatus: "available_demo",
    shortDescription: "Declarative, component-based library for user interfaces.",
    longDescription: "React lets you build user interfaces out of individual pieces called components with stateful hooks and fast reconciliations.",
    searchKeywords: ["react", "reactjs", "frontend", "ui", "components", "jsx", "tsx", "web", "javascript"],
    aliases: ["reactjs", "react.js"],
    iconName: "react",
    accentColor: "#61DAFB",
    badgeBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    badgeText: "text-cyan-600 dark:text-cyan-400",
    fileExtension: "tsx",
    monacoLanguage: "typescript",
    fileName: "App.tsx",
    features: [
      "Declarative UI component architecture with JSX/TSX syntax",
      "Predictable state management with hooks (useState, useEffect, useMemo)",
      "High-speed DOM reconciliation via Virtual DOM and Fiber architecture",
      "Universal ecosystem spanning web (Next.js, Vite) and mobile (React Native)"
    ],
    beginnerExplanation: "React is the most popular frontend library in the world. It lets you create interactive UI widgets by combining reusable components with simple JavaScript state.",
    relatedToolSlugs: ["javascript", "html", "nodejs"],
    defaultCode: `import React, { useState } from 'react';

export default function CounterApp() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 max-w-sm mx-auto bg-slate-900 rounded-xl shadow-md text-white">
      <h2 className="text-xl font-bold mb-4">OneCompilerHub Counter</h2>
      <p className="text-3xl font-mono text-indigo-400 mb-4">{count}</p>
      <div className="flex gap-2">
        <button 
          onClick={() => setCount(c => c + 1)}
          className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500"
        >
          Increment
        </button>
      </div>
    </div>
  );
}
`,
    mockOutput: `[React DOM 18 Component Tree Mounted]
<CounterApp>
  State: { count: 0 }
  Render cycles: 1
  Bundle size: 4.2 KB (gzipped)
Vite HMR: Ready`,
    mockExecutionTime: "22ms",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    slug: "postgresql",
    category: "database",
    categories: ["all", "database"],
    isPopular: false,
    isFeatured: true,
    isBeginnerFriendly: false,
    availabilityStatus: "available_demo",
    shortDescription: "Advanced open-source relational database with JSON & GIS support.",
    longDescription: "PostgreSQL is a powerful, open-source object-relational database system with over 35 years of active development.",
    searchKeywords: ["postgresql", "postgres", "sql", "database", "rdbms", "relational", "jsonb", "backend", "acid"],
    aliases: ["postgres", "pgsql"],
    iconName: "postgresql",
    accentColor: "#4169E1",
    badgeBg: "bg-blue-600/10 dark:bg-blue-600/20",
    badgeText: "text-blue-600 dark:text-blue-400",
    fileExtension: "sql",
    monacoLanguage: "sql",
    fileName: "analytics.sql",
    features: [
      "Full ACID compliance with advanced concurrency control (MVCC)",
      "Native JSONB binary indexing combining relational power with NoSQL flexibility",
      "Extensive custom types, triggers, stored procedures, and GIS spatial extensions (PostGIS)",
      "Standard database of choice for modern startups and cloud enterprise applications"
    ],
    beginnerExplanation: "PostgreSQL is widely hailed as the world's most advanced open-source database. It supports complex relational queries alongside ultra-fast JSON storage.",
    relatedToolSlugs: ["mysql", "mongodb", "plsql"],
    defaultCode: `-- OneCompilerHub - PostgreSQL 16 Analytics
CREATE TABLE execution_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  runtime VARCHAR(20) NOT NULL,
  duration_ms INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO execution_metrics (runtime, duration_ms) VALUES
  ('python', 42),
  ('c++', 18),
  ('node', 35);

SELECT runtime, AVG(duration_ms) AS avg_duration
FROM execution_metrics
GROUP BY runtime
ORDER BY avg_duration ASC;
`,
    mockOutput: `CREATE TABLE
INSERT 0 3
 runtime |    avg_duration     
---------+---------------------
 c++     | 18.0000000000000000
 node    | 35.0000000000000000
 python  | 42.0000000000000000
(3 rows)`,
    mockExecutionTime: "28ms",
  },
  {
    id: "pygame",
    name: "Pygame",
    slug: "pygame",
    category: "framework",
    categories: ["all", "framework"],
    isPopular: false,
    isFeatured: false,
    isBeginnerFriendly: true,
    availabilityStatus: "available_demo",
    shortDescription: "Cross-platform Python modules designed for writing 2D video games.",
    longDescription: "Pygame is a set of Python modules designed for writing 2D video games, with sound, graphics, and user input abstractions.",
    searchKeywords: ["pygame", "python", "game dev", "gaming", "2d", "graphics", "sdl", "framework"],
    aliases: ["pygame-ce"],
    iconName: "pygame",
    accentColor: "#F49E00",
    badgeBg: "bg-amber-600/10 dark:bg-amber-600/20",
    badgeText: "text-amber-700 dark:text-amber-300",
    fileExtension: "py",
    monacoLanguage: "python",
    fileName: "game.py",
    features: [
      "Hardware-accelerated 2D surface rendering built on SDL (Simple DirectMedia Layer)",
      "Event-driven game loop handling keyboard, mouse, and gamepad inputs",
      "Sprite grouping and collision detection math helpers",
      "Fun, hands-on path for learning Python programming through playable games"
    ],
    beginnerExplanation: "Pygame makes game development in Python approachable. You can build retro arcade games, physics simulations, and animations while learning core Python concepts.",
    relatedToolSlugs: ["python", "lua", "cpp"],
    defaultCode: `# OneCompilerHub - Pygame 2D Engine Preview
import sys

class GameSimulation:
    def __init__(self, title="OneCompilerHub Game Loop"):
        self.title = title
        self.fps = 60
        self.running = True
        print(f"🎮 Initializing {self.title} at {self.fps} FPS")

    def step(self, frames=3):
        for frame in range(1, frames + 1):
            print(f"  Frame {frame}: physics update, entity collision check [OK]")
        print("Simulation loop finished successfully.")

if __name__ == "__main__":
    game = GameSimulation()
    game.step()
`,
    mockOutput: `pygame 2.5.2 (SDL 2.28.3, Python 3.11.4)
Hello from the pygame community. https://www.pygame.org/contribute.html
🎮 Initializing OneCompilerHub Game Loop at 60 FPS
  Frame 1: physics update, entity collision check [OK]
  Frame 2: physics update, entity collision check [OK]
  Frame 3: physics update, entity collision check [OK]
Simulation loop finished successfully.`,
    mockExecutionTime: "48ms",
  },
];

// Helper Query Functions
export function getToolBySlug(slug: string): ProgrammingTool | undefined {
  return PROGRAMMING_TOOLS.find(
    (t) => t.slug.toLowerCase() === slug.toLowerCase() || t.id.toLowerCase() === slug.toLowerCase()
  );
}

export function getFeaturedTools(): ProgrammingTool[] {
  return PROGRAMMING_TOOLS.filter((t) => t.isFeatured);
}

export function getPopularTools(): ProgrammingTool[] {
  return PROGRAMMING_TOOLS.filter((t) => t.isPopular);
}

export function getBeginnerTools(): ProgrammingTool[] {
  return PROGRAMMING_TOOLS.filter((t) => t.isBeginnerFriendly);
}

export function getToolsByCategory(category: ToolCategory): ProgrammingTool[] {
  if (category === "all") return PROGRAMMING_TOOLS;
  return PROGRAMMING_TOOLS.filter((t) => t.categories.includes(category));
}

export function getRelatedTools(tool: ProgrammingTool): ProgrammingTool[] {
  return PROGRAMMING_TOOLS.filter((t) => tool.relatedToolSlugs.includes(t.slug));
}

export function searchTools(
  query: string,
  category: ToolCategory = "all"
): ProgrammingTool[] {
  const cleanQuery = query.toLowerCase().trim();

  return PROGRAMMING_TOOLS.filter((tool) => {
    // 1. Category check
    const matchesCategory =
      category === "all" || tool.categories.includes(category);

    if (!matchesCategory) return false;
    if (!cleanQuery) return true;

    // 2. Name & Slug
    if (tool.name.toLowerCase().includes(cleanQuery)) return true;
    if (tool.slug.toLowerCase().includes(cleanQuery)) return true;

    // 3. Aliases
    if (tool.aliases.some((a) => a.toLowerCase().includes(cleanQuery))) return true;

    // 4. Search Keywords
    if (tool.searchKeywords.some((k) => k.toLowerCase().includes(cleanQuery))) return true;

    // 5. Descriptions & File Extension
    if (tool.shortDescription.toLowerCase().includes(cleanQuery)) return true;
    if (tool.fileExtension.toLowerCase() === cleanQuery.replace(".", "")) return true;

    // 6. Primary Category
    if (tool.category.toLowerCase().includes(cleanQuery)) return true;

    return false;
  });
}
