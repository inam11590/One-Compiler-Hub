import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DEFAULT_TITLE,
  SITE_DEFAULT_DESCRIPTION,
  TOOL_SEO_MAP,
  getCanonicalUrl,
  getWebSiteJsonLd,
  getOrganizationJsonLd,
  getSoftwareApplicationJsonLd,
  getBreadcrumbJsonLd,
} from "../src/lib/seo.ts";

const EXPECTED_TOOL_SLUGS = [
  "html",
  "python",
  "javascript",
  "java",
  "mysql",
  "c",
  "cpp",
  "php",
  "csharp",
  "fastapi",
  "lua",
  "plsql",
  "nodejs",
  "mongodb",
  "spring-boot",
  "react",
  "postgresql",
  "pygame",
];

describe("SEO Centralized Configuration & Tool Metadata", () => {
  test("defines correct base URL, brand name, and homepage metadata", () => {
    assert.equal(SITE_URL, "https://one-compiler-hub.vercel.app");
    assert.equal(SITE_NAME, "OneCompilerHub");
    assert.ok(SITE_DEFAULT_TITLE.includes("OneCompilerHub"));
    assert.ok(SITE_DEFAULT_DESCRIPTION.length > 50);
  });

  test("covers all 18 tools with unique titles and accurate descriptions", () => {
    const titles = new Set();

    for (const slug of EXPECTED_TOOL_SLUGS) {
      const toolSeo = TOOL_SEO_MAP[slug];
      assert.ok(toolSeo, `Missing SEO config for tool slug: ${slug}`);
      assert.ok(toolSeo.title.length > 10, `${slug} title is too short`);
      assert.ok(toolSeo.description.length >= 40, `${slug} description is too short`);
      assert.ok(toolSeo.keywords.length >= 3, `${slug} should have at least 3 keywords`);

      // Ensure titles are unique across tools
      assert.ok(!titles.has(toolSeo.title), `Duplicate title detected for ${slug}: ${toolSeo.title}`);
      titles.add(toolSeo.title);

      // Verify honesty in advertising: non-HTML tools should not claim live execution
      if (slug !== "html") {
        assert.equal(toolSeo.isLivePreview, undefined);
      } else {
        assert.equal(toolSeo.isLivePreview, true);
      }
    }
  });

  test("builds correct canonical URLs", () => {
    assert.equal(getCanonicalUrl("/"), "https://one-compiler-hub.vercel.app");
    assert.equal(getCanonicalUrl("compilers"), "https://one-compiler-hub.vercel.app/compilers");
    assert.equal(getCanonicalUrl("/tools/python"), "https://one-compiler-hub.vercel.app/tools/python");
  });
});

describe("Structured Data (JSON-LD) Generators", () => {
  test("generates valid WebSite schema with search action", () => {
    const schema = getWebSiteJsonLd();
    assert.equal(schema["@context"], "https://schema.org");
    assert.equal(schema["@type"], "WebSite");
    assert.equal(schema.name, "OneCompilerHub");
    assert.equal(schema.url, "https://one-compiler-hub.vercel.app");
    assert.ok(schema.potentialAction);
  });

  test("generates valid Organization schema", () => {
    const schema = getOrganizationJsonLd();
    assert.equal(schema["@context"], "https://schema.org");
    assert.equal(schema["@type"], "Organization");
    assert.equal(schema.name, "OneCompilerHub");
    assert.ok(schema.logo.includes("favicon.ico"));
  });

  test("generates valid SoftwareApplication schema for root and tools", () => {
    const rootSchema = getSoftwareApplicationJsonLd();
    assert.equal(rootSchema["@type"], "SoftwareApplication");
    assert.equal(rootSchema.offers.price, "0");

    const htmlSchema = getSoftwareApplicationJsonLd("html");
    assert.ok(htmlSchema.name.includes("HTML"));
    assert.ok(htmlSchema.featureList.includes("Live HTML/CSS/JS preview"));

    const pythonSchema = getSoftwareApplicationJsonLd("python");
    assert.ok(pythonSchema.name.includes("Python"));
    assert.ok(pythonSchema.featureList.includes("Monaco code editor"));
  });

  test("generates valid BreadcrumbList schema", () => {
    const breadcrumbs = getBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Programming Tools", path: "/compilers" },
      { name: "Python", path: "/tools/python" },
    ]);
    assert.equal(breadcrumbs["@type"], "BreadcrumbList");
    assert.equal(breadcrumbs.itemListElement.length, 3);
    assert.equal(breadcrumbs.itemListElement[0].position, 1);
    assert.equal(breadcrumbs.itemListElement[2].item, "https://one-compiler-hub.vercel.app/tools/python");
  });
});

describe("Sitemap & Robots Verification", () => {
  test("sitemap source contains all public pages and excludes private utility routes", () => {
    const sitemapContent = fs.readFileSync(
      path.resolve(process.cwd(), "src/app/sitemap.ts"),
      "utf8"
    );

    // Verify key static routes are present
    assert.ok(sitemapContent.includes("SITE_URL"));
    assert.ok(sitemapContent.includes("/compilers"));
    assert.ok(sitemapContent.includes("/web-development"));
    assert.ok(sitemapContent.includes("/databases"));
    assert.ok(sitemapContent.includes("/explore"));
    assert.ok(sitemapContent.includes("/privacy"));
    assert.ok(sitemapContent.includes("/terms"));
    assert.ok(sitemapContent.includes("/editor/html"));
    assert.ok(sitemapContent.includes("/tools/${tool.slug}"));
    assert.ok(sitemapContent.includes("/editor/${tool.slug}"));

    // Verify private routes are not included
    assert.ok(!sitemapContent.includes('"/dashboard"'));
    assert.ok(!sitemapContent.includes('"/settings"'));
    assert.ok(!sitemapContent.includes('"/login"'));
    assert.ok(!sitemapContent.includes('"/signup"'));
    assert.ok(!sitemapContent.includes('"/auth"'));
  });

  test("robots.ts source configures allowed public paths and disallowed private paths", () => {
    const robotsContent = fs.readFileSync(
      path.resolve(process.cwd(), "src/app/robots.ts"),
      "utf8"
    );

    assert.ok(robotsContent.includes("sitemap: `${SITE_URL}/sitemap.xml`"));
    assert.ok(robotsContent.includes('userAgent: "*"'));
    assert.ok(robotsContent.includes('"/compilers"'));
    assert.ok(robotsContent.includes('"/tools/"'));
    assert.ok(robotsContent.includes('"/editor/"'));

    // Check disallowed routes
    assert.ok(robotsContent.includes('"/dashboard"'));
    assert.ok(robotsContent.includes('"/settings"'));
    assert.ok(robotsContent.includes('"/auth"'));
    assert.ok(robotsContent.includes('"/api"'));
    assert.ok(robotsContent.includes('"/login"'));
    assert.ok(robotsContent.includes('"/signup"'));
  });
});
