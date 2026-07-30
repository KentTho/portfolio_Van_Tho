import "server-only";
import { db } from "@/infrastructure/database/client";
import { auditLogs, type NewAuditLogRow } from "@/infrastructure/database/schema";

/** Append an audit entry. Never pass secrets/tokens in `metadata`. */
export async function writeAuditLog(
  entry: Omit<NewAuditLogRow, "id" | "createdAt">,
): Promise<void> {
  await db.insert(auditLogs).values(entry);
}
