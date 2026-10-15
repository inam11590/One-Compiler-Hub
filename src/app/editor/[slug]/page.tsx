import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROGRAMMING_TOOLS, getToolBySlug } from "@/data/tools";
import { CodeWorkspace } from "@/components/ide/code-workspace";
import {
  SITE_NAME,
  TOOL_SEO_MAP,
  getCanonicalUrl,
  getSoftwareApplicationJsonLd,
} from "@/lib/seo";

interface EditorSlugPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return PROGRAMMING_TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: EditorSlugPageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return {
      title: `Workspace Not Found — ${SITE_NAME}`,
    };
  }

  const seo = TOOL_SEO_MAP[params.slug];
  const title = tool.slug === "html"
    ? `HTML Live Preview Playground & Code Editor — ${SITE_NAME}`
    : `${tool.name} Online Code Editor & Workspace — ${SITE_NAME}`;

  const description = tool.slug === "html"
    ? "Interactive HTML, CSS, and JavaScript browser playground with real-time live preview, console bridge, and starter templates."
    : `Write and organize ${tool.name} source code in a full-featured browser workspace with Monaco Editor and local persistence.`;

  const canonicalUrl = getCanonicalUrl(`/editor/${tool.slug}`);

  return {
    title,
    description,
    keywords: seo?.keywords || [tool.name, "online editor", "code workspace"],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function EditorSlugPage({ params }: EditorSlugPageProps) {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    notFound();
  }

  const softwareSchema = getSoftwareApplicationJsonLd(tool.slug);

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-navy-950 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />
      <CodeWorkspace initialToolSlug={tool.slug} isEmbedded={false} />
    </div>
  );
}
