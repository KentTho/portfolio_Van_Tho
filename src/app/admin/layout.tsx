import { AdminShell } from "@/components/layout/admin-shell";

/**
 * Admin layout skeleton. Authentication and authorization are NOT implemented
 * in Wave 02 — this is a visual shell only. Route protection arrives in Wave 03.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
