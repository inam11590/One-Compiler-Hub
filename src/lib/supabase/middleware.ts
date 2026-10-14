import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

export async function updateSession(request: NextRequest) {
  const { url, anonKey, isConfigured } = getSupabaseEnv();

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // If Supabase is not configured yet, allow public access but redirect protected routes with a message
  const pathname = request.nextUrl.pathname;
  const protectedRoutes = ["/dashboard", "/settings"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isConfigured) {
    if (isProtected) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("error", "supabase_not_configured");
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: "",
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });

  // Refresh auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Route Protection for unauthenticated users
  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";

    // Validate safe relative return URL (prevent open redirect attacks)
    const rawReturn = pathname + (request.nextUrl.search || "");
    if (rawReturn.startsWith("/") && !rawReturn.startsWith("//") && !rawReturn.includes("://")) {
      redirectUrl.searchParams.set("returnUrl", rawReturn);
    }

    return NextResponse.redirect(redirectUrl);
  }

  // 2. Redirect authenticated users away from /login and /signup
  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (isAuthRoute && user) {
    const redirectUrl = request.nextUrl.clone();
    const returnUrlParam = request.nextUrl.searchParams.get("returnUrl");

    let destination = "/dashboard";
    if (
      returnUrlParam &&
      returnUrlParam.startsWith("/") &&
      !returnUrlParam.startsWith("//") &&
      !returnUrlParam.includes("://")
    ) {
      destination = returnUrlParam;
    }

    redirectUrl.pathname = destination;
    redirectUrl.searchParams.delete("returnUrl");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
