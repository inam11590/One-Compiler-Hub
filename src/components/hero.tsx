"use client";

import React, { useState } from "react";
import { Play, Sparkles, Terminal, ArrowRight, ShieldCheck, Check, Copy } from "lucide-react";

interface HeroProps {
  onStartCoding: () => void;
  onExploreLanguages: () => void;
}

export function Hero({ onStartCoding, onExploreLanguages }: HeroProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(true);
  const [copied, setCopied] = useState(false);

  const samplePythonCode = `# OneCompilerHub - Cloud Workspace Initializer
def analyze_benchmark(engine="V8-Sandbox"):
    metrics = {
        "memory_overhead": "0.12 MB",
        "cold_start": "14 ms",
        "status": "ready"
    }
    print(f"⚡ [Compiler Hub] Initializing {engine}...")
    for key, val in metrics.items():
        print(f"  • {key.replace('_', ' ').title()}: {val}")
    return "Ready for compilation."

if __name__ == "__main__":
    result = analyze_benchmark()
    print("Status:", result)
`;

  const handleSimulatedRun = () => {
    setIsRunning(true);
    setHasRun(false);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(samplePythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="hero" className="relative pt-10 pb-20 sm:pt-16 sm:pb-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headings & Call to Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Highlighted brand message */}
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
              Write, experiment, and explore programming languages in one powerful workspace.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={onStartCoding}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-brand-500 hover:bg-brand-600 active:scale-[0.98] shadow-lg shadow-brand-500/25 transition-all group"
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
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>18 Development Environments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span>Zero Setup Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-slate-400 dark:text-slate-500">Step 1 Frontend Foundation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Coding Editor Visual Preview */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-xl lg:max-w-none">
              {/* Card wrapper */}
              <div className="rounded-2xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 shadow-2xl overflow-hidden transition-all duration-300">
                {/* Editor Header Bar */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-750 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/80" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="ml-2 font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="text-blue-500">py</span> main.py
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-200/50 dark:hover:bg-navy-800 transition-colors"
                      title="Copy code"
                      aria-label="Copy snippet"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleSimulatedRun}
                      disabled={isRunning}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all shadow-sm shadow-emerald-500/20"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isRunning ? "Simulating..." : "Run (Demo)"}</span>
                    </button>
                  </div>
                </div>

                {/* Code Body with Line Numbers */}
                <div className="p-4 font-mono text-xs sm:text-[13px] bg-slate-900 text-slate-100 overflow-x-auto leading-relaxed">
                  <div className="flex">
                    {/* Line numbers */}
                    <div className="select-none pr-4 text-slate-600 text-right space-y-0.5 border-r border-slate-800 shrink-0">
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
                    </div>

                    {/* Syntax Highlighted Code Display */}
                    <div className="pl-4 space-y-0.5 whitespace-pre">
                      <div><span className="text-slate-500"># OneCompilerHub - Cloud Workspace Initializer</span></div>
                      <div><span className="text-purple-400">def</span> <span className="text-blue-400">analyze_benchmark</span>(<span className="text-amber-300">engine</span>=<span className="text-emerald-400">&quot;V8-Sandbox&quot;</span>):</div>
                      <div className="pl-4">metrics = &#123;</div>
                      <div className="pl-8"><span className="text-emerald-400">&quot;memory_overhead&quot;</span>: <span className="text-emerald-400">&quot;0.12 MB&quot;</span>,</div>
                      <div className="pl-8"><span className="text-emerald-400">&quot;cold_start&quot;</span>: <span className="text-emerald-400">&quot;14 ms&quot;</span>,</div>
                      <div className="pl-8"><span className="text-emerald-400">&quot;status&quot;</span>: <span className="text-emerald-400">&quot;ready&quot;</span></div>
                      <div className="pl-4">&#125;</div>
                      <div className="pl-4"><span className="text-cyan-400">print</span>(<span className="text-emerald-400">f&quot;⚡ [Compiler Hub] Initializing &#123;engine&#125;...&quot;</span>)</div>
                      <div className="pl-4"><span className="text-purple-400">return</span> <span className="text-emerald-400">&quot;Ready for compilation.&quot;</span></div>
                      <div />
                      <div><span className="text-purple-400">if</span> __name__ == <span className="text-emerald-400">&quot;__main__&quot;</span>:</div>
                      <div className="pl-4">analyze_benchmark()</div>
                    </div>
                  </div>
                </div>

                {/* Simulated Output Panel */}
                <div className="border-t border-slate-800 bg-slate-950 p-3.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-brand-400" />
                      <span className="font-semibold text-slate-300">OUTPUT TERMINAL</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                        Demo Output
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">Execution time: 38ms</span>
                  </div>

                  {isRunning ? (
                    <div className="py-2 text-slate-400 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                      <span>Simulating container run...</span>
                    </div>
                  ) : hasRun ? (
                    <div className="text-slate-300 space-y-1">
                      <div className="text-emerald-400">⚡ [Compiler Hub] Initializing V8-Sandbox...</div>
                      <div className="text-slate-400">  • Memory Overhead: 0.12 MB</div>
                      <div className="text-slate-400">  • Cold Start: 14 ms</div>
                      <div className="text-slate-400">  • Status: ready</div>
                      <div className="text-brand-300 pt-1">Status: Ready for compilation.</div>
                    </div>
                  ) : null}
                </div>

                {/* Explicit Step 1 Demo Notice */}
                <div className="px-4 py-2 bg-brand-500/10 dark:bg-brand-900/30 border-t border-brand-500/20 text-center">
                  <p className="text-[11px] font-medium text-brand-700 dark:text-brand-300">
                    ℹ️ Step 1 UI Prototype: Execution is simulated for visual layout preview. Real multi-language compiler backends will be connected in Step 2.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
