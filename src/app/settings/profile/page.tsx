import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserWithProfile } from "@/lib/auth/actions";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";

export const metadata: Metadata = {
  title: "Profile & Account Settings — OneCompilerHub",
  description: "Manage your developer profile, custom handle, avatar, and account security settings.",
};

export default async function ProfileSettingsPage() {
  const { user, profile } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/login?returnUrl=/settings/profile");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-brand-500/20">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure your developer identity, security credentials, and preferences.
          </p>
        </div>

        <ProfileSettingsForm initialProfile={profile} user={user} />
      </main>

      <Footer />
    </div>
  );
}
