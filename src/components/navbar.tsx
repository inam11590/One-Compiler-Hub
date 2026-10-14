"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchDialog } from "@/components/search-dialog";
import { ProgrammingTool, ToolCategory } from "@/types";
import { ToolIcon } from "@/components/tool-icons";
import { useAuth } from "@/components/auth/auth-provider";

interface NavbarProps {
  onSelectTool?: (tool: ProgrammingTool) => void;
  onFilterCategory?: (category: ToolCategory) => void;
}

export function Navbar({ onSelectTool, onFilterCategory }: NavbarProps) {
  const pathname = usePathname();
  const { user, profile, isLoading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  const navItems = [
    {
      id: "home",
      label: "Home",
      href: "/",
      isActive: pathname === "/",
    },
    {
      id: "compilers",
      label: "Compilers",
      href: "/compilers",
      category: "programming" as ToolCategory,
      isActive: pathname === "/compilers",
      items: [
        { name: "Python", slug: "python", icon: "python", desc: "AI, data & scripting" },
        { name: "C++", slug: "cpp", icon: "cpp", desc: "High performance core" },
        { name: "Java", slug: "java", icon: "java", desc: "Enterprise applications" },
        { name: "C#", slug: "csharp", icon: "csharp", desc: ".NET cloud runtime" },
        { name: "C", slug: "c", icon: "c", desc: "Systems & embedded" },
        { name: "Lua", slug: "lua", icon: "lua", desc: "Lightweight scripting" },
      ],
      footerLink: { label: "Explore All Compilers", href: "/compilers" },
    },
    {
      id: "web",
      label: "Web Development",
      href: "/web-development",
      category: "web" as ToolCategory,
      isActive: pathname === "/web-development",
      items: [
        { name: "HTML", slug: "html", icon: "html", desc: "Semantic web structures" },
        { name: "JavaScript", slug: "javascript", icon: "javascript", desc: "Universal web interactivity" },
        { name: "React", slug: "react", icon: "react", desc: "Component UI framework" },
        { name: "Node.js", slug: "nodejs", icon: "nodejs", desc: "Event-driven backend" },
        { name: "PHP", slug: "php", icon: "php", desc: "Server-side web scripting" },
      ],
      footerLink: { label: "Explore Web Ecosystem", href: "/web-development" },
    },
    {
      id: "databases",
      label: "Databases",
      href: "/databases",
      category: "database" as ToolCategory,
      isActive: pathname === "/databases",
      items: [
        { name: "MySQL", slug: "mysql", icon: "mysql", desc: "Relational SQL database" },
        { name: "PostgreSQL", slug: "postgresql", icon: "postgresql", desc: "Advanced object-relational" },
        { name: "MongoDB", slug: "mongodb", icon: "mongodb", desc: "Document NoSQL database" },
        { name: "PL/SQL", slug: "plsql", icon: "plsql", desc: "Procedural SQL blocks" },
      ],
      footerLink: { label: "Explore All Databases", href: "/databases" },
    },
    {
      id: "explore",
      label: "Explore",
      href: "/explore",
      isActive: pathname === "/explore",
    },
  ];

  const handleLinkSelect = (item: typeof navItems[0]) => {
    if (item.category && onFilterCategory && pathname === "/") {
      onFilterCategory(item.category);
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-navy-900/95 border-b border-slate-200/80 dark:border-navy-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Custom OneCompilerHub logo + brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <Logo size="md" />
          </div>

          {/* Center: Desktop Navigation with Active States and Dropdowns (Strictly Single-Line) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0" aria-label="Main Navigation">
            {navItems.map((item) => {
              const hasDropdown = Boolean(item.items);
              const isOpen = activeDropdown === item.id;

              return (
                <div
                  key={item.id}
                  className="relative shrink-0"
                  onMouseEnter={() => (hasDropdown ? handleMouseEnter(item.id) : undefined)}
                  onMouseLeave={hasDropdown ? handleMouseLeave : undefined}
                >
                  <Link
                    href={item.href}
                    onClick={() => handleLinkSelect(item)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                      item.isActive
                        ? "text-brand-600 dark:text-brand-400 bg-brand-500/10 dark:bg-brand-500/15"
                        : "text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800/60"
                    }`}
                    aria-expanded={hasDropdown ? isOpen : undefined}
                    aria-haspopup={hasDropdown ? "true" : undefined}
                  >
                    <span className="whitespace-nowrap">{item.label}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-slate-400 ${
                          isOpen ? "rotate-180 text-brand-500" : ""
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {hasDropdown && isOpen && (
                    <div
                      className="absolute left-0 mt-1 w-72 rounded-2xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 p-2 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <div className="space-y-0.5">
                        {item.items?.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/tools/${sub.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors group text-left"
                            role="menuitem"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-navy-900 border border-slate-200/80 dark:border-navy-750 flex items-center justify-center p-1.5 shrink-0 group-hover:scale-105 transition-transform">
                              <ToolIcon name={sub.icon} className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                              <div className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                                {sub.name}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {sub.desc}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {item.footerLink && (
                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-navy-800 px-2 pb-1">
                          <Link
                            href={item.footerLink.href}
                            onClick={() => setActiveDropdown(null)}
                            className="inline-flex items-center justify-between w-full text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            <span>{item.footerLink.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right: Search, Theme Toggle, Auth Buttons, Mobile Hamburger */}
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

            {/* Authentication States */}
            {isLoading ? (
              /* Stable Skeleton Pill (Prevents Layout Shift) */
              <div className="hidden sm:inline-block w-36 h-9 rounded-xl bg-slate-100 dark:bg-navy-800 animate-pulse" />
            ) : user ? (
              /* Authenticated User Menu */
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2 sm:py-1.5 rounded-xl border border-slate-200 dark:border-navy-750 bg-slate-50 dark:bg-navy-850 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors focus:outline-none"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label="User navigation menu"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-500 text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                    {profile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>
                        {(profile?.display_name || user.email || "U")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {profile?.display_name || user.email?.split("@")[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180 text-brand-500" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 p-2 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-navy-800 mb-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {profile?.display_name || "Developer"}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-500" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/settings/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Profile Settings</span>
                    </Link>

                    <div className="my-1 border-t border-slate-100 dark:border-navy-800" />

                    <button
                      type="button"
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated Buttons */
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 hover:from-brand-500 hover:to-accent-600 shadow-md shadow-brand-500/20 active:scale-[0.98] transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-navy-750 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.id} className="border-b border-slate-100 dark:border-navy-800/60 pb-1">
                  <Link
                    href={item.href}
                    onClick={() => handleLinkSelect(item)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      item.isActive
                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </Link>

                  {/* Sub items in mobile */}
                  {item.items && (
                    <div className="pl-4 pr-1 py-1 grid grid-cols-2 gap-1.5 mt-1">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/tools/${sub.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 p-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-brand-500 hover:bg-slate-50 dark:hover:bg-navy-800"
                        >
                          <ToolIcon name={sub.icon} className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{sub.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Auth Actions */}
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-750 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {(profile?.display_name || user.email || "U").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {profile?.display_name || "Developer"}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-brand-500 text-sm font-semibold text-white shadow-md shadow-brand-500/20"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/settings/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await signOut();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 text-sm font-semibold text-slate-700 dark:text-slate-200 text-center hover:bg-slate-50 dark:hover:bg-navy-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-brand-500 text-sm font-semibold text-white text-center hover:bg-brand-600 shadow-md shadow-brand-500/20"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

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
