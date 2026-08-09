import "server-only";
import { desc } from "drizzle-orm";
import type { AuditEntryView, AuditReadPort } from "@/modules/audit/application/ports/audit-read-port";
import { getDb } from "@/infrastructure/database/client";
import { auditLogs, type AuditLogRow } from "@/infrastructure/database/schema";

function toView(r: AuditLogRow): AuditEntryView {
  return {
    id: r.id,
    actorUserId: r.actorUserId,
    action: r.action,
    entityType: r.entityType,
    entityId: r.entityId,
    metadata: r.metadata,
    createdAt: r.createdAt,
  };
}

/** Neon-backed read of the append-only audit trail (newest first). */
export class DrizzleAuditReadRepository implements AuditReadPort {
  async listRecent(limit: number): Promise<readonly AuditEntryView[]> {
    const rows = await getDb().select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
    return rows.map(toView);
  }
}
