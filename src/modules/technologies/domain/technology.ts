/**
 * Technology domain entity — pure, framework-free. The category tuple is the single
 * source of truth mirrored by the `technology_category` Postgres enum; a test asserts
 * they never drift (tests/unit/technology-schema.test.ts).
 */

export const TECHNOLOGY_CATEGORIES = [
  "language",
  "backend",
  "frontend",
  "data",
  "cloud",
  "ai",
  "tooling",
] as const;

export type TechnologyCategory = (typeof TECHNOLOGY_CATEGORIES)[number];

export function isTechnologyCategory(value: string): value is TechnologyCategory {
  return (TECHNOLOGY_CATEGORIES as readonly string[]).includes(value);
}

/** Read model exposed to application/presentation. Storage row shape lives in infrastructure. */
export interface Technology {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly category: TechnologyCategory;
  readonly deviconKey: string | null;
  readonly brandColor: string | null;
  readonly website: string | null;
  readonly sortOrder: number;
  readonly isVisible: boolean;
}
