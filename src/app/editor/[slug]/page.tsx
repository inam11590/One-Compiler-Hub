import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROGRAMMING_TOOLS, getToolBySlug } from "@/data/tools";
import { CodeWorkspace } from "@/components/ide/code-workspace";

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
      title: "Workspace Not Found — OneCompilerHub",
    };
  }

  return {
    title: `${tool.name} Online IDE & Editor — OneCompilerHub`,
    description: `Write and edit ${tool.name} code in a full-featured browser workspace with Monaco Editor, file management, and customizable themes.`,
  };
}

export default function EditorSlugPage({ params }: EditorSlugPageProps) {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col p-2 sm:p-4">
      <div className="flex-1 w-full max-w-[1700px] mx-auto">
        <CodeWorkspace initialToolSlug={tool.slug} />
      </div>
    </div>
  );
}
