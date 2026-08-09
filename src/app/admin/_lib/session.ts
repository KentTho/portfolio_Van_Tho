import "server-only";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/composition/identity";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";

/**
 * Resolve the current admin for a Server Component, or redirect to sign-in. The admin layout
 * already gates the whole /admin subtree; pages call this to get the typed AdminUser to pass
 * into application use-cases (the presentation layer never touches Drizzle directly).
 */
export async function getAdminOrRedirect(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin-login");
  return admin;
}
