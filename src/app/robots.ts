import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/compilers",
          "/web-development",
          "/databases",
          "/explore",
          "/tools/",
          "/editor/",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/settings",
          "/settings/",
          "/auth",
          "/auth/",
          "/api",
          "/api/",
          "/login",
          "/signup",
          "/forgot-password",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
