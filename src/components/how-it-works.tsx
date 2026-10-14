import React from "react";
import { MousePointerClick, Code2, PlayCircle } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      stepNumber: "01",
      icon: <MousePointerClick className="w-6 h-6 text-brand-500" />,
      title: "Choose a Language",
      description:
        "Select from 18 supported programming languages, web stacks, or databases to instantly load a starter project template.",
    },
    {
      stepNumber: "02",
      icon: <Code2 className="w-6 h-6 text-accent-500" />,
      title: "Write Your Code",
      description:
        "Develop in our Monaco-powered editor with syntax highlighting, autocomplete, file explorer tabs, and custom STDIN support.",
    },
    {
      stepNumber: "03",
      icon: <PlayCircle className="w-6 h-6 text-emerald-500" />,
      title: "Live Preview & Experiment",
      description:
        "Instantly test web interfaces with live HTML, CSS & JavaScript preview, or write, organize, and export multi-file projects locally in your browser.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-slate-50/70 dark:bg-navy-900/60 border-t border-slate-200/60 dark:border-navy-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Simple Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How It Works
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            A frictionless path from concept to code experimentation.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => (
            <div
              key={s.title}
              className="relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 shadow-sm hover:border-brand-500/40 dark:hover:border-brand-500/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 flex items-center justify-center shadow-sm">
                    {s.icon}
                  </div>
                  <span className="font-mono text-3xl font-extrabold text-slate-200 dark:text-navy-700">
                    {s.stepNumber}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-navy-800 flex items-center text-xs font-semibold text-brand-500">
                <span>Step {idx + 1} of 3</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
