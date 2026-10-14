import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

/**
 * Creates a Supabase client for use in browser client components.
 */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(
    url || "https://placeholder.supabase.co",
    anonKey || "placeholder-anon-key"
  );
}
