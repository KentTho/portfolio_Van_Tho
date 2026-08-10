import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/infrastructure/supabase/middleware-client";
import { DEFAULT_LOCALE, LOCALES } from "@/shared/i18n";

/**
 * Two responsibilities:
 *  - Admin/auth routes: refresh the Supabase session and gate /admin (authorization
 *    is enforced again in the admin layout — defense in depth).
 *  - Public routes: ensure a locale prefix (default `vi`), redirecting when absent.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminApp = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAuthFlow = pathname === "/admin-login" || pathname.startsWith("/auth");

  if (isAdminApp || isAuthFlow) {
    const { response, user } = await updateSession(request);
    if (isAdminApp && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin-login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // All routes except Next internals, API handlers and files with an extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
