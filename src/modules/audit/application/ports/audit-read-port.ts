/** Read model over the append-only audit_logs trail. */
export interface AuditEntryView {
  readonly id: string;
  readonly actorUserId: string | null;
  readonly action: string;
  readonly entityType: string;
  readonly entityId: string | null;
  readonly metadata: unknown;
  readonly createdAt: Date;
}

export interface AuditReadPort {
  /** Most recent entries first, bounded by `limit`. */
  listRecent(limit: number): Promise<readonly AuditEntryView[]>;
}
