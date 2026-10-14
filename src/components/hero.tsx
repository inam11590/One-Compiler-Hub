"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Check, Copy, Code2, Cpu } from "lucide-react";

interface HeroProps {
  onStartCoding: () => void;
  onExploreLanguages: () => void;
}

export function Hero({ onStartCoding, onExploreLanguages }: HeroProps) {
  const [copied, setCopied] = useState(false);

  const samplePythonCode = `# OneCompilerHub Developer Workspace
from dataclasses import dataclass
from typing import List

@dataclass
class Project:
    name: str
    language: str
    status: str = "ready"

def initialize_workspace(environment: str = "python") -> Project:
    """Initialize development workspace with local persistence."""
    return Project(
        name="Developer Playground",
        language=environment
    )

workspace = initialize_workspace("python")
print(f"Loaded: {workspace.name} ({workspace.language})")
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(samplePythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="hero" className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
      {/* Background radial glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[320px] h-[320px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headings & Call to Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Highlighted brand badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>OneCompilerHub — Your Online Coding Workspace</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Code Smarter. <br />
              <span className="bg-gradient-to-r from-brand-500 via-indigo-500 to-accent-500 bg-clip-text text-transparent">
                Build Faster.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Write, experiment, and explore programming languages in one unified, browser-based coding workspace powered by Monaco Editor.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={onStartCoding}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-brand-500 hover:bg-brand-600 active:scale-[0.98] shadow-lg shadow-brand-500/25 transition-all group"
              >
                <span>Start Coding</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onExploreLanguages}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-navy-700 bg-white/80 dark:bg-navy-850 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              >
                <span>Explore Languages</span>
              </button>
            </div>

            {/* Trust / Spec Badges */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>18 Development Environments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span>Zero Local Setup Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Browser-Based Architecture</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Coding Editor Showcase (Code Preview) */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-xl lg:max-w-none">
              {/* Outer decorative gradient glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-500/20 to-accent-500/20 blur-xl opacity-60 pointer-events-none" />

              {/* Card container */}
              <div className="relative rounded-2xl border border-slate-200/90 dark:border-navy-750 bg-white dark:bg-navy-900 shadow-2xl overflow-hidden transition-all duration-300">
                {/* Editor Window Header */}
                <div className="px-4 py-2.5 bg-slate-100/90 dark:bg-navy-950/90 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Window Controls */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    </div>

                    {/* Active File Tab */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 text-xs font-mono font-medium text-slate-800 dark:text-slate-200 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-brand-500" />
                      <span>main.py</span>
                    </div>
                  </div>

                  {/* Right Header: Code Preview Badge & Copy Action */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-navy-800 border border-slate-300/60 dark:border-navy-700">
                      <Code2 className="w-3 h-3 text-brand-500" />
                      <span>Code Preview</span>
                    </span>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-200/60 dark:hover:bg-navy-800 transition-colors"
                      title="Copy code snippet"
                      aria-label="Copy code snippet"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Code Body with Line Numbers */}
                <div className="p-4 font-mono text-xs sm:text-[13px] bg-slate-900 text-slate-100 overflow-x-auto leading-relaxed select-text">
                  <div className="flex">
                    {/* Line numbers */}
                    <div className="select-none pr-4 text-slate-600 text-right space-y-0.5 border-r border-slate-800 shrink-0 font-mono">
                      <div>1</div>
                      <div>2</div>
                      <div>3</div>
                      <div>4</div>
                      <div>5</div>
                      <div>6</div>
                      <div>7</div>
                      <div>8</div>
                      <div>9</div>
                      <div>10</div>
                      <div>11</div>
                      <div>12</div>
                      <div>13</div>
                      <div>14</div>
                      <div>15</div>
                      <div>16</div>
                    </div>

                    {/* Syntax Highlighted Code */}
                    <div className="pl-4 space-y-0.5 whitespace-pre">
                      <div><span className="text-slate-500"># OneCompilerHub Developer Workspace</span></div>
                      <div><span className="text-purple-400">from</span> dataclasses <span className="text-purple-400">import</span> dataclass</div>
                      <div><span className="text-purple-400">from</span> typing <span className="text-purple-400">import</span> List</div>
                      <div />
                      <div><span className="text-amber-400">@dataclass</span></div>
                      <div><span className="text-purple-400">class</span> <span className="text-blue-400">Project</span>:</div>
                      <div className="pl-4">name: <span className="text-cyan-400">str</span></div>
                      <div className="pl-4">language: <span className="text-cyan-400">str</span></div>
                      <div className="pl-4">status: <span className="text-cyan-400">str</span> = <span className="text-emerald-400">&quot;ready&quot;</span></div>
                      <div />
                      <div><span className="text-purple-400">def</span> <span className="text-blue-400">initialize_workspace</span>(<span className="text-amber-300">environment</span>: <span className="text-cyan-400">str</span> = <span className="text-emerald-400">&quot;python&quot;</span>) -&gt; Project:</div>
                      <div className="pl-4"><span className="text-slate-500">&quot;&quot;&quot;Initialize development workspace with local persistence.&quot;&quot;&quot;</span></div>
                      <div className="pl-4"><span className="text-purple-400">return</span> Project(name=<span className="text-emerald-400">&quot;Developer Playground&quot;</span>, language=environment)</div>
                      <div />
                      <div>workspace = initialize_workspace(<span className="text-emerald-400">&quot;python&quot;</span>)</div>
                      <div><span className="text-cyan-400">print</span>(<span className="text-emerald-400">f&quot;Loaded: &#123;workspace.name&#125; (&#123;workspace.language&#125;)&quot;</span>)</div>
                    </div>
                  </div>
                </div>

                {/* Editor Status Footer */}
                <div className="px-4 py-2 bg-slate-100/90 dark:bg-navy-950/90 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-brand-600 dark:text-brand-400 font-semibold">Python 3.12</span>
                    <span className="hidden sm:inline text-slate-400">•</span>
                    <span className="hidden sm:inline">UTF-8</span>
                    <span className="hidden sm:inline text-slate-400">•</span>
                    <span className="hidden sm:inline">4 Spaces</span>
                  </div>

                  <button
                    type="button"
                    onClick={onStartCoding}
                    className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold transition-colors"
                  >
                    <span>Launch Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
