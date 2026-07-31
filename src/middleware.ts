import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/infrastructure/supabase/middleware-client";

/**
 * Refreshes the Supabase session on every matched request and gates /admin.
 * Authentication (session present) is checked here; authorization (allow-list +
 * role) is enforced again server-side in the admin layout (defense in depth).
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin-login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
