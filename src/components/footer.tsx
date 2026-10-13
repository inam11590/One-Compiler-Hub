"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { X, Mail } from "lucide-react";

export function Footer() {
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  const openAbout = () => {
    setModalContent({
      title: "About OneCompilerHub",
      content: (
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>
            <strong>OneCompilerHub</strong> is an online coding platform and developer playground engineered to provide seamless in-browser programming experimentation across 18 modern languages, web stacks, and databases.
          </p>
          <p>
            Our mission is to eliminate setup friction for developers, students, and educators worldwide with an accessible, high-performance web interface.
          </p>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 text-xs">
            <strong>Release Status:</strong> Step 2 — Advanced Navigation, Smart Search &amp; Tool Discovery.
          </div>
        </div>
      ),
    });
  };

  const openContact = () => {
    setModalContent({
      title: "Contact Developer Support",
      content: (
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Have feedback on the Step 2 UI/UX design or questions about upcoming compiler integrations?
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-4 h-4 text-brand-500" />
              <span className="font-semibold text-slate-900 dark:text-white">Email:</span>
              <span className="font-mono text-slate-600 dark:text-slate-300">support@onecompilerhub.dev</span>
            </div>
            <div className="text-xs text-slate-500">
              Response timeframe: Within 24-48 business hours.
            </div>
          </div>
        </div>
      ),
    });
  };

  const openPrivacy = () => {
    setModalContent({
      title: "Privacy Policy",
      content: (
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>
            At OneCompilerHub, your privacy is paramount. In this Step 2 release:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>We do not collect or transmit private personal identifiable information (PII).</li>
            <li>Code entered into the Monaco editor remains strictly local within your browser session memory.</li>
            <li>No persistent analytics tracking cookies or telemetry beacons are injected.</li>
          </ul>
        </div>
      ),
    });
  };

  const openTerms = () => {
    setModalContent({
      title: "Terms of Service",
      content: (
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Welcome to OneCompilerHub. By accessing our platform, you acknowledge that:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Step 2 constitutes a frontend layout &amp; discovery prototype; code execution is simulated.</li>
            <li>Users agree not to misuse playground containers or attempt unauthorized penetration testing.</li>
            <li>All product names and logos are trademarks of their respective owners.</li>
          </ul>
        </div>
      ),
    });
  };

  return (
    <>
      <footer className="bg-slate-50 dark:bg-navy-950 border-t border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-400 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand column */}
            <div className="md:col-span-5 space-y-4">
              <Logo size="md" />
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                OneCompilerHub is a modern, responsive online coding playground where developers, students, and educators write and explore 18 programming environments.
              </p>
              <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                Frontend UI &amp; Discovery Foundation • Step 2
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                Platform
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:text-brand-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/compilers" className="hover:text-brand-500 transition-colors">
                    Compilers &amp; Languages
                  </Link>
                </li>
                <li>
                  <Link href="/web-development" className="hover:text-brand-500 transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/databases" className="hover:text-brand-500 transition-colors">
                    Databases
                  </Link>
                </li>
                <li>
                  <Link href="/explore" className="hover:text-brand-500 transition-colors">
                    Explore Stacks
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal / Resources Column */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                Legal &amp; Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={openAbout}
                    className="hover:text-brand-500 transition-colors text-left"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openContact}
                    className="hover:text-brand-500 transition-colors text-left"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openPrivacy}
                    className="hover:text-brand-500 transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openTerms}
                    className="hover:text-brand-500 transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
            <p>© {new Date().getFullYear()} OneCompilerHub. All rights reserved.</p>
            <p>Designed with Electric Blue &amp; Deep Navy Design System.</p>
          </div>
        </div>
      </footer>

      {/* Info Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-md bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setModalContent(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {modalContent.title}
            </h3>

            {modalContent.content}

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-navy-800 flex justify-end">
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
