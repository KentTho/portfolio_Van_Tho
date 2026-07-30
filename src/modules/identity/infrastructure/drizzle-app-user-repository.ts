import "server-only";
import { eq } from "drizzle-orm";
import type {
  AppUserRecord,
  AppUserRepositoryPort,
} from "@/modules/identity/application/ports/app-user-repository-port";
import { db } from "@/infrastructure/database/client";
import { appUsers } from "@/infrastructure/database/schema";

export class DrizzleAppUserRepository implements AppUserRepositoryPort {
  async findBySupabaseUserId(supabaseUserId: string): Promise<AppUserRecord | null> {
    const rows = await db
      .select()
      .from(appUsers)
      .where(eq(appUsers.supabaseAuthUserId, supabaseUserId))
      .limit(1);

    const row = rows[0];
    if (!row) return null;
    return { id: row.id, email: row.email, role: row.role, status: row.status };
  }
}
