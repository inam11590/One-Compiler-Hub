export type ToolCategory =
  | "all"
  | "popular"
  | "programming"
  | "web"
  | "database"
  | "framework";

export interface ProgrammingTool {
  id: string;
  name: string;
  slug: string;
  category: "programming" | "web" | "database" | "framework";
  categories: ToolCategory[];
  isPopular: boolean;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  fileExtension: string;
  monacoLanguage: string;
  fileName: string;
  defaultCode: string;
  mockOutput: string;
  mockExecutionTime: string;
  sampleInput?: string;
  documentationUrl?: string;
}

export interface NavItem {
  label: string;
  href: string;
}
