"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Code2,
  Settings,
  Sparkles,
  ArrowRight,
  FolderCode,
  Clock,
  HardDrive,
  CheckCircle2,
  ExternalLink,
  Laptop,
} from "lucide-react";
import { UserProfile } from "@/types/auth";
import { PROGRAMMING_TOOLS } from "@/data/tools";
import { ToolIcon } from "@/components/tool-icons";
import { WorkspaceProject } from "@/types";
import { listAllProjects } from "@/lib/storage";

interface DashboardViewProps {
  user: {
    id: string;
    email?: string;
    email_confirmed_at?: string | null;
  };
  profile: UserProfile | null;
}

export function DashboardView({ user, profile }: DashboardViewProps) {
  const [localProjects, setLocalProjects] = useState<WorkspaceProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    async function loadRecent() {
      try {
        const projects = await listAllProjects();
        setLocalProjects(projects);
      } catch (err) {
        console.warn("Could not load local projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadRecent();
  }, []);

  const displayName = profile?.display_name || user.email?.split("@")[0] || "Developer";
  const username = profile?.username ? `@${profile.username}` : null;
  const isEmailVerified = Boolean(user.email_confirmed_at);

  const featuredTools = PROGRAMMING_TOOLS.slice(0, 6);
  const categories = [
    { name: "Programming Compilers", count: "6 Runtimes", href: "/compilers", icon: "python" },
    { name: "Web Development", count: "5 Stacks", href: "/web-development", icon: "react" },
    { name: "Databases & SQL", count: "4 Engines", href: "/databases", icon: "postgresql" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-navy-900 to-navy-950 border border-brand-500/20 p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Developer Workspace Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Your centralized development cockpit for 18 programming compilers, web sandboxes, and database query runners.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/editor/python"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 hover:from-brand-500 hover:to-accent-600 shadow-lg shadow-brand-500/25 transition-all active:scale-[0.98]"
            >
              <Code2 className="w-4 h-4" />
              <span>Launch Playground</span>
            </Link>
            <Link
              href="/settings/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Profile Card & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white font-bold text-xl flex items-center justify-center shadow-md overflow-hidden shrink-0">
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{displayName.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    {displayName}
                  </h2>
                  {username && (
                    <p className="text-xs text-brand-600 dark:text-brand-400 font-mono">
                      {username}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[200px]">
                    {user.email}
                  </p>
                </div>
              </div>

              {isEmailVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Unverified
                </span>
              )}
            </div>

            {profile?.bio ? (
              <p className="mt-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-navy-900/60 p-3 rounded-xl border border-slate-100 dark:border-navy-800">
                {profile.bio}
              </p>
            ) : (
              <p className="mt-4 text-xs text-slate-400 italic">
                No bio added yet. Tell the developer community about your projects.
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Account status</span>
            <Link
              href="/settings/profile"
              className="text-brand-600 dark:text-brand-400 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>Edit Profile</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group p-5 rounded-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 hover:border-brand-500/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200/80 dark:border-navy-750 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                  <ToolIcon name={cat.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {cat.count}
                  </p>
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Local Projects Section (Task 7 requirement) */}
      <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderCode className="w-5 h-5 text-brand-500" />
              <span>Recent Local Projects</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Workspaces stored in your local browser storage (IndexedDB).
            </p>
          </div>

          {/* Explicit storage transparency note */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-750">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>Stored Locally in Browser (Cloud Sync coming soon)</span>
          </div>
        </div>

        {loadingProjects ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Scanning local storage...
          </div>
        ) : localProjects.length === 0 ? (
          <div className="py-8 text-center space-y-3 bg-slate-50/50 dark:bg-navy-900/30 rounded-xl border border-dashed border-slate-200 dark:border-navy-800">
            <Laptop className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No local project sessions found yet. Launch any language playground below to start coding.
            </p>
            <Link
              href="/editor/python"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-colors"
            >
              <span>Launch Python Editor</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {localProjects.slice(0, 6).map((proj) => (
              <Link
                key={proj.id}
                href={`/editor/${proj.toolSlug}`}
                className="group p-4 rounded-xl border border-slate-200 dark:border-navy-750 bg-slate-50/50 dark:bg-navy-900/40 hover:bg-white dark:hover:bg-navy-800 hover:border-brand-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors truncate">
                      {proj.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono uppercase">
                      {proj.toolSlug}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {proj.files.length} file{proj.files.length === 1 ? "" : "s"} in workspace
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(proj.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform">
                    Open →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access Tools */}
      <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Quick Access Compilers & Tools
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Launch into full-screen Monaco Editor workspaces with instant local execution simulation.
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>All 18 Tools</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {featuredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/editor/${tool.slug}`}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-navy-750 bg-slate-50/50 dark:bg-navy-900/30 hover:bg-slate-100/70 dark:hover:bg-navy-800 hover:border-brand-500/30 transition-all text-center flex flex-col items-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-navy-850 border border-slate-200/80 dark:border-navy-750 flex items-center justify-center p-2 mb-2 group-hover:scale-105 transition-transform shadow-sm">
                <ToolIcon name={tool.iconName} className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                {tool.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 capitalize">
                {tool.category}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
