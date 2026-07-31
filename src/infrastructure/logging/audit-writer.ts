import "server-only";
import { getDb } from "@/infrastructure/database/client";
import { auditLogs, type NewAuditLogRow } from "@/infrastructure/database/schema";

/** Append an audit entry. Never pass secrets/tokens in `metadata`. */
export async function writeAuditLog(
  entry: Omit<NewAuditLogRow, "id" | "createdAt">,
): Promise<void> {
  await getDb().insert(auditLogs).values(entry);
}
