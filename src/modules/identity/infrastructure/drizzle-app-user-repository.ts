import "server-only";
import { eq } from "drizzle-orm";
import type {
  AppUserRecord,
  AppUserRepositoryPort,
  ProvisionOwnerInput,
} from "@/modules/identity/application/ports/app-user-repository-port";
import { getDb } from "@/infrastructure/database/client";
import { appUsers } from "@/infrastructure/database/schema";

export class DrizzleAppUserRepository implements AppUserRepositoryPort {
  async findBySupabaseUserId(supabaseUserId: string): Promise<AppUserRecord | null> {
    const rows = await getDb()
      .select()
      .from(appUsers)
      .where(eq(appUsers.supabaseAuthUserId, supabaseUserId))
      .limit(1);

    const row = rows[0];
    if (!row) return null;
    return { id: row.id, email: row.email, role: row.role, status: row.status };
  }

  async provisionOwner(input: ProvisionOwnerInput): Promise<AppUserRecord> {
    const db = getDb();
    // Insert with schema defaults (role=owner_admin, status=active) on first login; on a
    // repeat login only refresh email + last_login_at — never re-grant a revoked role.
    await db
      .insert(appUsers)
      .values({
        supabaseAuthUserId: input.supabaseUserId,
        email: input.email,
        displayName: input.displayName ?? null,
        lastLoginAt: new Date(),
      })
      .onConflictDoUpdate({
        target: appUsers.supabaseAuthUserId,
        set: { email: input.email, lastLoginAt: new Date(), updatedAt: new Date() },
      });
    const found = await this.findBySupabaseUserId(input.supabaseUserId);
    if (!found) throw new Error("provisionOwner: row not found after upsert");
    return found;
  }
}
