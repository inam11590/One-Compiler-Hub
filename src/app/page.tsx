"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ToolsGrid } from "@/components/tools-grid";
import { WhyUs } from "@/components/why-us";
import { HowItWorks } from "@/components/how-it-works";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import { ToolCategory, ProgrammingTool } from "@/types";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavCategoryFilter = (category: string) => {
    setSelectedCategory((category as ToolCategory) || "all");
    scrollToSection("tools");
  };

  const handleSelectTool = (tool: ProgrammingTool) => {
    if (typeof window !== "undefined") {
      window.location.href = `/editor/${tool.slug}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-navy-900 transition-colors">
      {/* Navigation */}
      <Navbar
        onSelectTool={handleSelectTool}
        onFilterCategory={handleNavCategoryFilter}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Centered Hero Section with Wide Search & Category Filter */}
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onStartCoding={() => scrollToSection("tools")}
          onExploreLanguages={() => scrollToSection("tools")}
        />

        {/* 18 Programming Tools Section */}
        <ToolsGrid
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
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
