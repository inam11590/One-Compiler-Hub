import React from "react";

export function ToolIcon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
  switch (name) {
    case "html":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4 3 2 16 6 2 6-2 2-16Z" fill="#E44D26" stroke="#E44D26" fillOpacity="0.15" />
          <path d="M16 8H8l.5 4H15l-.5 4-2.5 1-2.5-1-.2-2" stroke="#E44D26" />
        </svg>
      );
    case "python":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M11.9 2C8.7 2 6.8 3.4 6.8 5.7V7.6H12v.9H4.4C2.1 8.5 1 10.3 1 12.8s1.4 4.3 4.4 4.3h1.8v-2.2c0-2.4 2-4.4 4.4-4.4h4.7V8.8C16.3 4.2 15.1 2 11.9 2zm-1.8 1.9a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z" fill="#387EB8" />
          <path d="M12.1 22c3.2 0 5.1-1.4 5.1-3.7v-1.9H12v-.9h7.6c2.3 0 3.4-1.8 3.4-4.3s-1.4-4.3-4.4-4.3h-1.8v2.2c0 2.4-2 4.4-4.4 4.4H7.7v1.7c0 4.6 1.2 6.8 4.4 6.8zm1.8-1.9a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z" fill="#FFE052" />
        </svg>
      );
    case "javascript":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="22" height="22" x="1" y="1" rx="4" fill="#F7DF1E" />
          <path d="M8 17.5c.7.5 1.5.8 2.3.8 1.3 0 2-.6 2-1.9v-5.2h-2" stroke="#000" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14.5 16.5c.8.6 1.8 1 2.8 1 1.5 0 2.3-.7 2.3-1.7 0-1.1-.9-1.5-2.2-2-1.6-.6-2.6-1.5-2.6-2.9 0-1.7 1.4-2.8 3.3-2.8 1.1 0 2 .3 2.7.7" stroke="#000" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "java":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#EA2D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 19c3 1 9 1 14 0" />
          <path d="M7 22c3 .6 7 .6 10 0" />
          <path d="M6 14c4 2 10 1 13-1" />
          <path d="M13 2c-1 2-2 4-1 6" stroke="#007396" />
          <path d="M16 3c-1 3-2 5 0 7" stroke="#007396" />
        </svg>
      );
    case "mysql":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#4479A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="6" rx="8" ry="3" fill="#4479A1" fillOpacity="0.2" />
          <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
          <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </svg>
      );
    case "c":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="20" height="20" x="2" y="2" rx="4" fill="#00599C" fillOpacity="0.15" stroke="#00599C" strokeWidth="2" />
          <path d="M15 8.5a4.5 4.5 0 1 0 0 7" stroke="#00599C" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "cpp":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="20" height="20" x="2" y="2" rx="4" fill="#00599C" fillOpacity="0.15" stroke="#00599C" strokeWidth="2" />
          <path d="M10 8.5a3.5 3.5 0 1 0 0 6.5" stroke="#00599C" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 11v3m-1.5-1.5h3M19 11v3m-1.5-1.5h3" stroke="#00599C" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "php":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#777BB4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="12" rx="10" ry="7" fill="#777BB4" fillOpacity="0.15" />
          <path d="M6 10h2a1.5 1.5 0 0 1 0 3H6m0-3v5" />
          <path d="M11 10v5m0-2.5h2a1.5 1.5 0 0 0 0-3H11" />
          <path d="M16 10h2a1.5 1.5 0 0 1 0 3h-2m0-3v5" />
        </svg>
      );
    case "csharp":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="20" height="20" x="2" y="2" rx="4" fill="#239120" fillOpacity="0.15" stroke="#239120" strokeWidth="2" />
          <path d="M10 8.5a3.5 3.5 0 1 0 0 6.5" stroke="#239120" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 9.5l4 4m-4 0l4-4" stroke="#239120" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "fastapi":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#059669" fillOpacity="0.15" stroke="#059669" strokeWidth="2" />
          <path d="M13 3 7 13h5l-1 8 7-11h-5l1-7Z" fill="#059669" stroke="#059669" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "lua":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="7" fill="#000080" />
          <circle cx="15.5" cy="8.5" r="2.5" fill="#FFFFFF" />
          <circle cx="19" cy="5" r="2" fill="#000080" />
        </svg>
      );
    case "plsql":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#F80000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="#F80000" fillOpacity="0.15" />
          <path d="M7 8h4a2 2 0 0 1 0 4H7V8Zm0 8v-4" />
          <path d="M14 8v8h3" />
        </svg>
      );
    case "nodejs":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#339933" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l8 4.6v9.2L12 20.4 4 15.8V6.6L12 2Z" fill="#339933" fillOpacity="0.15" />
          <circle cx="12" cy="12" r="3" fill="#339933" />
        </svg>
      );
    case "mongodb":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 2c.5 3 4.5 6 4.5 11a5 5 0 0 1-9 3c-1.5-2.5-1-6.5 4.5-14Z" fill="#47A248" fillOpacity="0.2" stroke="#47A248" strokeWidth="2" />
          <path d="M12 2v20" stroke="#47A248" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "springboot":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 21,7.2 21,17.8 12,23 3,17.8 3,7.2" fill="#6DB33F" fillOpacity="0.2" stroke="#6DB33F" strokeWidth="2" />
          <path d="M12 7c-3 0-5 2-5 5 0 4 5 7 5 7s5-3 5-7c0-3-2-5-5-5Z" fill="#6DB33F" />
        </svg>
      );
    case "react":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="1.8">
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
        </svg>
      );
    case "postgresql":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#4169E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c-4.5 0-8 3.5-8 8 0 3 1.5 5.5 4 7v3l3-2h1c4.5 0 8-3.5 8-8s-3.5-8-8-8Z" fill="#4169E1" fillOpacity="0.15" />
          <circle cx="9" cy="10" r="1" fill="#4169E1" />
          <path d="M16 11c0 2-2 3-4 3" />
        </svg>
      );
    case "pygame":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#F49E00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="6" fill="#F49E00" fillOpacity="0.15" />
          <path d="M6 12h4m-2-2v4" />
          <circle cx="15" cy="11" r="1" fill="#F49E00" />
          <circle cx="17" cy="13" r="1" fill="#F49E00" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
}
