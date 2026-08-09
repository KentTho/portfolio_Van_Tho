import "server-only";
import { ListAuditEntries } from "@/modules/audit/application/use-cases/list-audit-entries";
import { DrizzleAuditReadRepository } from "@/modules/audit/infrastructure/drizzle-audit-read-repository";

/** Composition root for the read-only audit viewer. */
export function getAuditUseCases() {
  const repo = new DrizzleAuditReadRepository();
  return { list: new ListAuditEntries({ repo }) };
}
