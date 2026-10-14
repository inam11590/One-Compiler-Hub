/**
 * Supabase Environment Variable Validator & Normalizer
 * Ensures client and server code have access to validated, sanitized Supabase configuration.
 */

export function normalizeSupabaseUrl(rawUrl: string): string {
  let url = (rawUrl || "").trim();
  if (!url) return "";

  // Check if user accidentally pasted the Supabase Dashboard URL:
  // e.g. https://supabase.com/dashboard/project/abcdefghijklm
  const dashboardMatch = url.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/);
  if (dashboardMatch) {
    url = `https://${dashboardMatch[1]}.supabase.co`;
  }

  // Ensure protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  // Strip trailing slashes
  url = url.replace(/\/+$/, "");

  // Strip misplaced subpaths like /auth/v1 or /rest/v1
  url = url.replace(/\/(auth|rest)(\/v1)?\/?$/, "");

  // Strip double slashes (except after protocol)
  url = url.replace(/([^:]\/)\/+/g, "$1");

  return url;
}

export function getSupabaseEnv() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const url = normalizeSupabaseUrl(rawUrl);
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

  let siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
  if (!siteUrl) {
    siteUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  }
  if (!siteUrl.startsWith("http://") && !siteUrl.startsWith("https://")) {
    siteUrl = `https://${siteUrl}`;
  }
  siteUrl = siteUrl.replace(/\/+$/, "");

  const isConfigured = Boolean(
    url &&
    anonKey &&
    !url.includes("your-project.supabase.co") &&
    !anonKey.includes("your-anon-key")
  );

  return {
    url,
    anonKey,
    siteUrl,
    isConfigured,
  };
}

export function assertSupabaseConfigured() {
  const { isConfigured, url, anonKey } = getSupabaseEnv();
  if (!isConfigured) {
    throw new Error(
      "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment (.env.local or Vercel Settings)."
    );
  }
  return { url, anonKey };
}
