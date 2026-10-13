import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showWordmark = true, size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg ${className}`}>
      {/* Brand Hex Shield Logo */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 text-white shadow-md shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-all duration-300 group-hover:scale-105`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white stroke-current stroke-[2.2] stroke-linecap-round stroke-linejoin-round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-navy-900 animate-pulse" />
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${textSizes[size]}`}>
            One<span className="text-brand-500">Compiler</span><span className="text-accent-500 font-extrabold">Hub</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 -mt-1 hidden sm:block">
            Developer Workspace
          </span>
        </div>
      )}
    </Link>
  );
}
