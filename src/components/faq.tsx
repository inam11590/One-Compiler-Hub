"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What is OneCompilerHub?",
      answer:
        "OneCompilerHub is an online coding platform and developer playground designed to allow developers, students, and engineers to write, inspect, and practice code across 18 modern programming languages, web stacks, and databases directly in their browser.",
    },
    {
      question: "Can I run and test code in OneCompilerHub?",
      answer:
        "Yes! You can write, preview, and interactively test HTML, CSS & JavaScript in real time inside our secure client-side sandbox playground. For backend compiled and interpreted languages (such as Python, Java, and C++), our FastAPI execution architecture and hardened sandbox specifications have been established as we prepare dedicated microVM workers.",
    },
    {
      question: "Which 18 programming languages and frameworks are supported?",
      answer:
        "OneCompilerHub includes 18 core environments: HTML, Python, JavaScript, Java, MySQL, C, C++, PHP, C#, FastAPI, Lua, PL/SQL, Node.js, MongoDB, Spring Boot, React, PostgreSQL, and Pygame.",
    },
    {
      question: "How does the smart search work?",
      answer:
        "Our smart search system supports full text queries, case-insensitive partial matches, category filtering, and extensive aliases (e.g. 'py' matches Python and Pygame; 'backend' matches FastAPI, Node.js, and Spring Boot; 'database' matches MySQL, PostgreSQL, MongoDB, and PL/SQL).",
    },
    {
      question: "Are there dedicated pages for each technology?",
      answer:
        "Yes! Every one of our 18 technologies has a dedicated dynamic page with detailed feature breakdowns, beginner guides, related technology graphs, and an embedded Monaco coding workspace.",
    },
    {
      question: "Is dark mode supported?",
      answer:
        "Yes, OneCompilerHub features native light and dark mode with an electric blue (#435BFF) primary accent and deep navy (#0B0F19) dark theme, fully synced across all components and the Monaco code editor.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-navy-900 border-t border-slate-200/60 dark:border-navy-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Learn more about the OneCompilerHub roadmap and frontend foundation.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200 dark:border-navy-750 bg-slate-50/50 dark:bg-navy-850 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full px-6 py-4.5 sm:py-5 flex items-center justify-between gap-4 text-left font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-brand-500 dark:hover:text-brand-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-500" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-navy-800"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
