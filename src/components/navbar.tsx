"use client";

import React, { useState } from "react";
import { Search, Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthModal } from "@/components/auth-modal";
import { SearchDialog } from "@/components/search-dialog";
import { ProgrammingTool } from "@/types";

interface NavbarProps {
  onSelectTool?: (tool: ProgrammingTool) => void;
  onFilterCategory?: (category: string) => void;
}

export function Navbar({ onSelectTool, onFilterCategory }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [searchOpen, setSearchOpen] = useState(false);

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Compilers", href: "#tools", category: "programming" },
    { label: "Web Development", href: "#tools", category: "web" },
    { label: "Databases", href: "#tools", category: "database" },
    { label: "Explore", href: "#workspace" },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.category && onFilterCategory) {
      onFilterCategory(link.category);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-navy-900/85 border-b border-slate-200/80 dark:border-navy-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Left: Custom OneCompilerHub logo + brand wordmark */}
          <div className="flex items-center gap-3">
            <Logo size="md" />
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleNavClick(link)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800/60 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search tools"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-navy-750 bg-slate-50 dark:bg-navy-850 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Search languages...</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-navy-750 text-slate-500 dark:text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Light/Dark Mode Toggle */}
            <ThemeToggle />

            {/* Sign In Button */}
            <button
              type="button"
              onClick={() => openAuth("signin")}
              className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            >
              Sign In
            </button>

            {/* Get Started Button */}
            <button
              type="button"
              onClick={() => openAuth("signup")}
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 hover:from-brand-500 hover:to-accent-600 shadow-md shadow-brand-500/20 active:scale-[0.98] transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => handleNavClick(link)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-navy-800 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => openAuth("signin")}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 text-sm font-medium text-slate-700 dark:text-slate-200 text-center hover:bg-slate-50 dark:hover:bg-navy-800"
              >
                Sign In (Demo)
              </button>
              <button
                type="button"
                onClick={() => openAuth("signup")}
                className="w-full py-2.5 rounded-xl bg-brand-500 text-sm font-semibold text-white text-center hover:bg-brand-600 shadow-md shadow-brand-500/20"
              >
                Get Started Free
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />

      {/* Search Modal */}
      <SearchDialog
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTool={(tool) => {
          if (onSelectTool) onSelectTool(tool);
        }}
      />
    </>
  );
}
