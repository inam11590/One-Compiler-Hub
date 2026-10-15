import React from "react";
import type { Metadata } from "next";
import { CodeWorkspace } from "@/components/ide/code-workspace";
import { getCanonicalUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Online IDE & Code Workspace — OneCompilerHub",
  description:
    "Production-grade browser coding workspace powered by Monaco Editor. Edit, organize files, and experiment in 18 programming languages.",
  alternates: {
    canonical: getCanonicalUrl("/editor"),
  },
  openGraph: {
    title: "Online IDE & Code Workspace — OneCompilerHub",
    description:
      "Production-grade browser coding workspace powered by Monaco Editor. Edit, organize files, and experiment in 18 programming languages.",
    url: getCanonicalUrl("/editor"),
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online IDE & Code Workspace — OneCompilerHub",
    description:
      "Production-grade browser coding workspace powered by Monaco Editor. Edit, organize files, and experiment in 18 programming languages.",
  },
};

export default function EditorRootPage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-900 flex flex-col">
      <CodeWorkspace initialToolSlug="python" isEmbedded={false} />
    </div>
  );
}
