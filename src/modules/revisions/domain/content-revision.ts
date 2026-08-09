/**
 * Content revision domain — immutable point-in-time snapshots. Distinct authority from
 * audit_logs (who/when) — a revision holds the full content STATE. Append-only: there is no
 * update/delete path; a "restore" is a NEW forward mutation on the live entity (previewed
 * here, never a destructive rewrite). `contentType` is a validated polymorphic tag.
 */
export const REVISION_CONTENT_TYPES = [
  "project",
  "article",
  "experience",
  "education",
  "certification",
  "profile",
] as const;
export type RevisionContentType = (typeof REVISION_CONTENT_TYPES)[number];

/** Lightweight list row (no snapshot payload). */
export interface RevisionSummary {
  readonly id: string;
  readonly contentType: RevisionContentType;
  readonly contentId: string;
  readonly locale: string | null;
  readonly version: number;
  readonly actorUserId: string | null;
  readonly createdAt: Date;
}

/** Full revision including the immutable snapshot payload. */
export interface ContentRevision extends RevisionSummary {
  readonly snapshot: unknown;
}
