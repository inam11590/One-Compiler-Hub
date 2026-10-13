"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ToolsGrid } from "@/components/tools-grid";
import { Workspace } from "@/components/workspace";
import { WhyUs } from "@/components/why-us";
import { HowItWorks } from "@/components/how-it-works";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import { ProgrammingTool } from "@/types";
import { PROGRAMMING_TOOLS } from "@/data/tools";

export default function HomePage() {
  const [selectedTool, setSelectedTool] = useState<ProgrammingTool>(PROGRAMMING_TOOLS[1]); // Default Python
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectToolForWorkspace = (tool: ProgrammingTool) => {
    setSelectedTool(tool);
    scrollToSection("workspace");
  };

  const handleNavCategoryFilter = (category: string) => {
    setActiveCategoryFilter(category);
    scrollToSection("tools");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-navy-900 transition-colors">
      {/* Navigation */}
      <Navbar
        onSelectTool={handleSelectToolForWorkspace}
        onFilterCategory={handleNavCategoryFilter}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onStartCoding={() => scrollToSection("workspace")}
          onExploreLanguages={() => scrollToSection("tools")}
        />

        {/* 18 Programming Tools Section */}
        <ToolsGrid
          onSelectToolForWorkspace={handleSelectToolForWorkspace}
          activeCategoryFilter={activeCategoryFilter}
        />

        {/* Coding Workspace Section */}
        <Workspace
          selectedTool={selectedTool}
          onToolChange={(tool) => setSelectedTool(tool)}
        />

        {/* Why OneCompilerHub */}
        <WhyUs />

        {/* How It Works */}
        <HowItWorks />

        {/* Frequently Asked Questions */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
