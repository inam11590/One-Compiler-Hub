export type ToolCategory =
  | "all"
  | "popular"
  | "programming"
  | "web"
  | "database"
  | "framework";

export type AvailabilityStatus =
  | "available_demo"
  | "coming_soon"
  | "in_development";

export interface ProgrammingTool {
  id: string;
  name: string;
  slug: string;
  category: "programming" | "web" | "database" | "framework";
  categories: ToolCategory[];
  isPopular: boolean;
  isFeatured: boolean;
  isBeginnerFriendly: boolean;
  availabilityStatus: AvailabilityStatus;
  shortDescription: string;
  longDescription: string;
  searchKeywords: string[];
  aliases: string[];
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
  features: string[];
  beginnerExplanation: string;
  relatedToolSlugs: string[];
  documentationUrl?: string;
}

export interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface NavItem {
  label: string;
  href: string;
  category?: ToolCategory;
  dropdown?: NavDropdownItem[];
}
