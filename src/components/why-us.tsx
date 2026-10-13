import React from "react";
import { Layers, Globe2, Sparkles, LayoutPanelTop, Share2 } from "lucide-react";

export function WhyUs() {
  const highlights = [
    {
      icon: <Layers className="w-6 h-6 text-brand-500" />,
      title: "Multiple Programming Languages",
      description:
        "Seamlessly switch between modern languages, databases, and frameworks in a single unified interface without setting up local toolchains.",
    },
    {
      icon: <Globe2 className="w-6 h-6 text-accent-500" />,
      title: "Browser-Based Coding",
      description:
        "Access your development workspace directly from any browser on macOS, Windows, Linux, tablets, or mobile devices with zero local configuration.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      title: "Beginner-Friendly Interface",
      description:
        "Intuitive layouts with starter code snippets, syntax highlighting, and instant feedback tailored for students, teachers, and seasoned developers alike.",
    },
    {
      icon: <LayoutPanelTop className="w-6 h-6 text-emerald-500" />,
      title: "Clean Developer Workspace",
      description:
        "A focused coding environment inspired by modern SaaS developer platforms with Monaco Editor, dark/light theme sync, and configurable panels.",
    },
    {
      icon: <Share2 className="w-6 h-6 text-indigo-500" />,
      title: "Future Code-Sharing Capabilities",
      description:
        "Designed from the ground up for seamless snippet links, collaborative embeds, and community developer playground sharing in future releases.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-navy-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Platform Advantages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why OneCompilerHub?
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Engineered to remove friction from programming, practice, and code experimentation.
          </p>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {highlights.map((item, idx) => (
            <div
              key={item.title}
              className={`p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-navy-800 bg-slate-50/60 dark:bg-navy-850 hover:border-brand-500/40 dark:hover:border-brand-500/40 hover:shadow-card-hover transition-all duration-300 ${
                idx === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-750 flex items-center justify-center mb-5 shadow-sm">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
