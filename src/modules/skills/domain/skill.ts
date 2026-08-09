/**
 * Skill domain — flat catalog row (no translations, no soft-delete column). `isVisible` is
 * the public gate; deletion is a hard delete. Evidence text keeps claims verifiable (§1).
 */
export interface Skill {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly proficiencyLabel: string | null;
  readonly evidenceText: string | null;
  readonly displayOrder: number;
  readonly isVisible: boolean;
}
