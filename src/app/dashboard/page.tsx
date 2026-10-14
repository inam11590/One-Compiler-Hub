import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserWithProfile } from "@/lib/auth/actions";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Developer Dashboard — OneCompilerHub",
  description: "View your developer profile, quick access coding workspaces, and recent sessions.",
};

export default async function DashboardPage() {
  const { user, profile } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/login?returnUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-brand-500/20">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <DashboardView user={user} profile={profile} />
      </main>

      <Footer />
    </div>
  );
}
