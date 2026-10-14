import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";
  const errorDescription = requestUrl.searchParams.get("error_description");

  // If Supabase returned an error in query params directly
  if (errorDescription) {
    const errorUrl = new URL("/login", request.url);
    errorUrl.searchParams.set("error", "auth_error");
    errorUrl.searchParams.set("message", errorDescription);
    return NextResponse.redirect(errorUrl);
  }

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error.message);
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("error", "token_invalid_or_expired");
      redirectUrl.searchParams.set("message", error.message);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Validate redirect URL against open redirects
  let destination = "/dashboard";
  if (next.startsWith("/") && !next.startsWith("//") && !next.includes("://")) {
    destination = next;
  }

  return NextResponse.redirect(new URL(destination, request.url));
}
