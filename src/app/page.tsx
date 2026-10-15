import React from "react";
import { Navbar } from "@/components/navbar";
import { HomeToolsExplorer } from "@/components/home/home-tools-explorer";
import { WhyUs } from "@/components/why-us";
import { HowItWorks } from "@/components/how-it-works";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-navy-900 transition-colors">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <HomeToolsExplorer />
        <WhyUs />
        <HowItWorks />
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
