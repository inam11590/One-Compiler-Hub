"use client";

import React, { useState } from "react";
import {
  User,
  AtSign,
  FileText,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  LogOut,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { UserProfile } from "@/types/auth";
import { updateProfile, changePassword, resendConfirmationEmail } from "@/lib/auth/actions";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";

interface ProfileSettingsFormProps {
  initialProfile: UserProfile | null;
  user: {
    id: string;
    email?: string;
    email_confirmed_at?: string | null;
  };
}

export function ProfileSettingsForm({ initialProfile, user }: ProfileSettingsFormProps) {
  const { signOut, refreshProfile } = useAuth();
  const supabase = createClient();

  // Profile fields state
  const [displayName, setDisplayName] = useState(initialProfile?.display_name || "");
  const [username, setUsername] = useState(initialProfile?.username || "");
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url || "");

  // Status state
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Avatar upload state
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Email verification resend state
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const isEmailVerified = Boolean(user.email_confirmed_at);

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setIsSavingProfile(true);

    try {
      const res = await updateProfile({
        display_name: displayName,
        username: username,
        bio: bio,
        avatar_url: avatarUrl,
      });

      if (res.success) {
        setProfileSuccess("Profile updated successfully!");
        await refreshProfile();
      } else {
        setProfileError(res.error || "Failed to update profile.");
      }
    } catch {
      setProfileError("An unexpected error occurred while saving profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Avatar Upload to Supabase Storage with size and MIME validation
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Avatar image must be smaller than 2MB.");
      return;
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setAvatarError("Supported formats: JPEG, PNG, WebP, GIF.");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        setAvatarError(uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        setAvatarUrl(publicUrlData.publicUrl);
        // Persist to profile
        await updateProfile({ avatar_url: publicUrlData.publicUrl });
        await refreshProfile();
        setProfileSuccess("Avatar uploaded and updated!");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error uploading avatar";
      setAvatarError(message);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await changePassword(newPassword);
      if (res.success) {
        setPasswordSuccess("Password updated successfully.");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(res.error || "Failed to update password.");
      }
    } catch {
      setPasswordError("An unexpected error occurred while changing password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle Resend Verification Email
  const handleResendEmail = async () => {
    if (!user.email || resendCooldown > 0) return;
    setResendStatus("Dispatching confirmation email...");

    const res = await resendConfirmationEmail(user.email);
    if (res.success) {
      setResendStatus("Verification email sent! Please check your inbox.");
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setResendStatus(res.error || "Failed to send email.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Profile Information Form */}
      <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-brand-500" />
            <span>Profile Information</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update your public developer persona and identity across OneCompilerHub.
          </p>
        </div>

        {/* Success / Error Alerts */}
        {profileSuccess && (
          <div
            role="status"
            className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{profileSuccess}</span>
          </div>
        )}
        {profileError && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{profileError}</span>
          </div>
        )}

        {/* Avatar Section */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200/80 dark:border-navy-750 flex flex-col sm:flex-row items-center gap-5">
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white font-bold text-2xl flex items-center justify-center shadow-md overflow-hidden shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span>{(displayName || "U").slice(0, 2).toUpperCase()}</span>
            )}
            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <h3 className="font-semibold text-xs text-slate-900 dark:text-white">
              Profile Avatar
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Upload a custom PNG, JPG, or WebP avatar (max 2MB).
            </p>
            {avatarError && (
              <p className="text-[11px] font-medium text-rose-500">{avatarError}</p>
            )}

            <div className="pt-1 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Photo</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
              </label>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={async () => {
                    setAvatarUrl("");
                    await updateProfile({ avatar_url: "" });
                    await refreshProfile();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Display Name */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  maxLength={60}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Username (Unique handle)
              </label>
              <div className="relative">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="developer_handle"
                  maxLength={24}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono transition-colors"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Letters, numbers, hyphens, and underscores (3-24 characters).
              </p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="bio"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Bio
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {bio.length}/300
              </span>
            </div>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Software engineer exploring multi-language runtimes, web compilers, and cloud architectures."
                rows={3}
                maxLength={300}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="py-2.5 px-5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-brand-500 hover:bg-brand-600 active:scale-[0.99] transition-all shadow-md shadow-brand-500/20 flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Security & Password Section */}
      <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-500" />
            <span>Account Security</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your email verification status and update your login password.
          </p>
        </div>

        {/* Email Verification Status */}
        <div className="mb-8 p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200/80 dark:border-navy-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-slate-900 dark:text-white">
                  {user.email}
                </span>
                {isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Unverified
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Primary account identifier for authentication and recovery alerts.
              </p>
            </div>
          </div>

          {!isEmailVerified && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={resendCooldown > 0}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? "animate-spin" : ""}`} />
                <span>
                  {resendCooldown > 0 ? `Wait ${resendCooldown}s` : "Resend Verification"}
                </span>
              </button>
            </div>
          )}
        </div>

        {resendStatus && (
          <p className="mb-6 text-xs font-medium text-brand-600 dark:text-brand-400">
            {resendStatus}
          </p>
        )}

        {/* Change Password Form */}
        <div className="border-t border-slate-100 dark:border-navy-800 pt-6">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-500" />
            <span>Change Account Password</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Enter a new password of at least 8 characters.
          </p>

          {passwordSuccess && (
            <div
              role="status"
              className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}
          {passwordError && (
            <div
              role="alert"
              className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="confirmNewPassword"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-slate-800 dark:bg-navy-700 hover:bg-slate-900 dark:hover:bg-navy-600 transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Logout / Danger Zone */}
      <div className="bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Sign Out of OneCompilerHub
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            End your authenticated session across this browser.
          </p>
        </div>

        <button
          type="button"
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
