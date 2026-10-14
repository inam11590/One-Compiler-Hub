/**
 * OneCompilerHub - Live Preview Types
 * Types for the sandboxed HTML, CSS & JavaScript preview playground.
 */

export type DeviceMode = "desktop" | "tablet" | "mobile";

export type ConsoleLogLevel = "log" | "info" | "warn" | "error";

export interface ConsoleLogEntry {
  id: string;
  level: ConsoleLogLevel;
  args: string[];
  timestamp: number;
  count?: number;
}

export interface PreviewMessagePayload {
  source: "onecompiler-preview";
  channelToken: string;
  type: "console" | "runtime-error" | "ready";
  level?: ConsoleLogLevel;
  args?: string[];
  error?: {
    message: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    stack?: string;
  };
  timestamp: number;
}

export interface StarterTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  files: {
    name: string;
    path: string;
    content: string;
    language: string;
  }[];
}
