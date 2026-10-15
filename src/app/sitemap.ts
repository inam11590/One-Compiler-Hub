import { MetadataRoute } from "next";
import { PROGRAMMING_TOOLS } from "@/data/tools";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Core public static marketing & category pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/compilers`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/web-development`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/databases`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/explore`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Dynamic documentation & overview pages for all 18 tools
  const toolPages: MetadataRoute.Sitemap = PROGRAMMING_TOOLS.map((tool) => ({
    url: `${SITE_URL}/tools/${tool.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: tool.slug === "html" ? 0.95 : 0.85,
  }));

  // Interactive editor workspaces (highlighting live HTML preview)
  const editorPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/editor`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/editor/html`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    ...PROGRAMMING_TOOLS.filter((t) => t.slug !== "html").map((tool) => ({
      url: `${SITE_URL}/editor/${tool.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];

  return [...staticPages, ...toolPages, ...editorPages];
}
