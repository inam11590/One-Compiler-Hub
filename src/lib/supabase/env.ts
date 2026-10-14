/**
 * Supabase Environment Variable Validator
 * Ensures client and server code have access to validated Supabase configuration.
 */

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

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
