"use client";

import React, { useState } from "react";
import { Hero } from "@/components/hero";
import { ToolsGrid } from "@/components/tools-grid";
import { ToolCategory } from "@/types";

export function HomeToolsExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all");

  const scrollToTools = () => {
    const el = document.getElementById("tools");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Centered Hero Section with Wide Search & Category Filter */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onStartCoding={scrollToTools}
        onExploreLanguages={scrollToTools}
      />

      {/* 18 Programming Tools Section */}
      <ToolsGrid
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </>
  );
}
