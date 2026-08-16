import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { bootstrapOwnerAdmin } from "@/composition/identity";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectParam = searchParams.get("redirect") ?? "/admin";
  // Redirect allow-list: only same-origin absolute paths (no open redirect).
  const safePath = redirectParam.startsWith("/") ? redirectParam : "/admin";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // First-login provisioning: bridge the verified allow-listed owner to an app_users
      // owner_admin record. Deny-by-default and idempotent; a non-allow-listed identity is
      // simply not provisioned (the admin layout will then redirect it to /admin-login).
      await bootstrapOwnerAdmin();
      return NextResponse.redirect(`${origin}${safePath}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}
