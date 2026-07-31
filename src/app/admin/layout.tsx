import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { getCurrentAdmin } from "@/composition/identity";

/**
 * The admin area is authenticated and session-dependent: it must be rendered at
 * request time, never statically prerendered/exported at build. This also keeps
 * `next build` from evaluating the DB/auth path (and its server env) during page
 * data collection.
 */
export const dynamic = "force-dynamic";

/**
 * Admin layout. Enforces authorization server-side (allow-list + active
 * owner_admin/editor) in addition to the middleware authentication gate.
 * Live sign-in requires a configured Supabase project (target proof pending).
 */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin-login");
  }
  return <AdminShell adminEmail={admin.email}>{children}</AdminShell>;
}
