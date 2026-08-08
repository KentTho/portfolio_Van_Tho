/**
 * Application-level audit port. Feature use-cases record sensitive mutations through
 * this interface; the composition root binds it to the concrete audit writer. Keeps
 * the application layer free of infrastructure per CLAUDE.md §4. Never pass secrets.
 */
export interface AuditEntry {
  /** app_users.id of the actor, or null for system actions. */
  readonly actorUserId: string | null;
  /** Stable machine action, e.g. "technology.create". */
  readonly action: string;
  readonly entityType: string;
  readonly entityId: string | null;
  readonly metadata?: Record<string, unknown> | null;
}

export interface AuditLogPort {
  record(entry: AuditEntry): Promise<void>;
}
