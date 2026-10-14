"use server";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { UserProfile } from "@/types/auth";
import { revalidatePath } from "next/cache";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Retrieves the current authenticated user and their profile data.
 */
export async function getCurrentUserWithProfile(): Promise<{
  user: {
    id: string;
    email?: string;
    email_confirmed_at?: string | null;
    user_metadata?: Record<string, unknown>;
  } | null;
  profile: UserProfile | null;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  // Fetch profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code === "PGRST116") {
    // Record not found: attempt to create profile fallback
    const defaultName =
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      user.email?.split("@")[0] ||
      "Developer";

    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        display_name: defaultName,
        avatar_url: (user.user_metadata?.avatar_url as string) || null,
      })
      .select()
      .single();

    return {
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        user_metadata: user.user_metadata,
      },
      profile: (newProfile as UserProfile) || null,
    };
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      email_confirmed_at: user.email_confirmed_at,
      user_metadata: user.user_metadata,
    },
    profile: (profile as UserProfile) || null,
  };
}

/**
 * Updates the user's profile information with safe server-side validation.
 */
export async function updateProfile(formData: {
  display_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
}): Promise<ActionResult<UserProfile>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const updates: Partial<UserProfile> = {};

  // Display Name validation
  if (formData.display_name !== undefined) {
    const trimmed = formData.display_name.trim();
    if (trimmed.length > 60) {
      return { success: false, error: "Display name cannot exceed 60 characters." };
    }
    updates.display_name = trimmed || null;
  }

  // Bio validation
  if (formData.bio !== undefined) {
    const trimmed = formData.bio.trim();
    if (trimmed.length > 300) {
      return { success: false, error: "Bio cannot exceed 300 characters." };
    }
    updates.bio = trimmed || null;
  }

  // Avatar URL validation
  if (formData.avatar_url !== undefined) {
    updates.avatar_url = formData.avatar_url.trim() || null;
  }

  // Username validation & uniqueness check
  if (formData.username !== undefined) {
    const cleanUsername = formData.username.trim().toLowerCase();

    if (cleanUsername) {
      // Validate format: 3-24 characters, alphanumeric, underscores, hyphens
      const usernameRegex = /^[a-z0-9_-]{3,24}$/;
      if (!usernameRegex.test(cleanUsername)) {
        return {
          success: false,
          error: "Username must be 3-24 characters, containing only lowercase letters, numbers, hyphens, or underscores.",
        };
      }

      // Check if another user owns this username
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", cleanUsername)
        .neq("id", user.id)
        .maybeSingle();

      if (existingUser) {
        return { success: false, error: "This username is already taken. Please choose another." };
      }

      updates.username = cleanUsername;
    } else {
      updates.username = null;
    }
  }

  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/settings/profile");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Profile updated successfully.",
    data: updatedProfile as UserProfile,
  };
}

/**
 * Changes the user's password securely.
 */
export async function changePassword(newPassword: string): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long." };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Your password has been changed successfully." };
}

/**
 * Sends a password reset email without revealing whether the email exists.
 */
export async function sendPasswordReset(email: string): Promise<ActionResult> {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const { siteUrl } = getSupabaseEnv();
  const supabase = createClient();

  const redirectUrl = `${siteUrl}/auth/callback?next=/auth/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: redirectUrl,
  });

  if (error) {
    console.warn("Password reset error:", error.message);
    // Don't expose whether the user exists or rate-limit nuances to avoid user enumeration
    if (error.status === 429) {
      return {
        success: false,
        error: "Too many password reset requests. Please wait a few minutes before trying again.",
      };
    }
  }

  // Consistent message to prevent email enumeration attacks
  return {
    success: true,
    message:
      "If an account is associated with this email address, you will receive password reset instructions shortly.",
  };
}

/**
 * Resends the verification confirmation email with rate-limit protection.
 */
export async function resendConfirmationEmail(email: string): Promise<ActionResult> {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please provide a valid email address." };
  }

  const { siteUrl } = getSupabaseEnv();
  const supabase = createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim().toLowerCase(),
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    if (error.status === 429) {
      return {
        success: false,
        error: "Rate limit reached. Please wait a moment before requesting another verification email.",
      };
    }
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "A verification email has been resent. Please check your inbox and spam folder.",
  };
}
