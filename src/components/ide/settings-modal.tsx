"use client";

import React from "react";
import { X, Sliders, Type, Layout, Code2 } from "lucide-react";
import { EditorSettings } from "@/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onUpdateSettings: (newSettings: Partial<EditorSettings>) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-xs">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-navy-750 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Editor & Workspace Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Section: Typography */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-semibold">
              <Type className="w-3.5 h-3.5 text-brand-500" />
              <span>Typography & Sizing</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pl-5">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1">
                  Font Size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min="12"
                  max="22"
                  step="1"
                  value={settings.fontSize}
                  onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1">
                  Tab Indentation
                </label>
                <select
                  value={settings.tabSize}
                  onChange={(e) => onUpdateSettings({ tabSize: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value={2}>2 Spaces</option>
                  <option value={4}>4 Spaces</option>
                  <option value={8}>8 Spaces</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Display & Features */}
          <div className="space-y-3 border-t border-slate-100 dark:border-navy-750 pt-4">
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-semibold">
              <Code2 className="w-3.5 h-3.5 text-brand-500" />
              <span>Editor Behavior</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pl-5">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1">
                  Word Wrap
                </label>
                <select
                  value={settings.wordWrap}
                  onChange={(e) => onUpdateSettings({ wordWrap: e.target.value as "on" | "off" })}
                  className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="on">Enabled (Wrap)</option>
                  <option value="off">Disabled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1">
                  Code Minimap
                </label>
                <select
                  value={settings.minimap ? "true" : "false"}
                  onChange={(e) => onUpdateSettings({ minimap: e.target.value === "true" })}
                  className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1">
                  Line Numbers
                </label>
                <select
                  value={settings.lineNumbers}
                  onChange={(e) => onUpdateSettings({ lineNumbers: e.target.value as "on" | "off" | "relative" })}
                  className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="on">On</option>
                  <option value="off">Off</option>
                  <option value="relative">Relative</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1">
                  Auto Bracket Closing
                </label>
                <select
                  value={settings.autoClosingBrackets}
                  onChange={(e) => onUpdateSettings({ autoClosingBrackets: e.target.value as "always" | "never" })}
                  className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="always">Always</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Layout & Appearance */}
          <div className="space-y-3 border-t border-slate-100 dark:border-navy-750 pt-4">
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-semibold">
              <Layout className="w-3.5 h-3.5 text-brand-500" />
              <span>Workspace Arrangement</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pl-5">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1">
                  Output Panel Position
                </label>
                <select
                  value={settings.layout}
                  onChange={(e) => onUpdateSettings({ layout: e.target.value as "bottom" | "right" })}
                  className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="bottom">Bottom Panel</option>
                  <option value="right">Right Side Panel</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1">
                  Monaco Color Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => onUpdateSettings({ theme: e.target.value as "vs-dark" | "vs" | "auto" })}
                  className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="auto">Sync with Site Theme</option>
                  <option value="vs-dark">Dark (VS Code)</option>
                  <option value="vs">Light (Visual Studio)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-navy-750 bg-slate-50 dark:bg-navy-900 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
