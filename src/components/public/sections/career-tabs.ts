/**
 * Pure Career state-machine helpers (no React/motion) so the tab logic and the
 * period formatting are unit-testable in isolation. The Career section renders
 * tabs ONLY when both datasets exist; with a single dataset it shows that one
 * timeline (no useless empty tab). Experience-ready: Experience is the default
 * tab when both are present.
 */
export type CareerTabKey = "experience" | "education";

export function careerTabKeys(hasExperience: boolean, hasEducation: boolean): CareerTabKey[] {
  const keys: CareerTabKey[] = [];
  if (hasExperience) keys.push("experience");
  if (hasEducation) keys.push("education");
  return keys;
}

/** True only when both datasets exist → a real [Experience | Education] tablist. */
export function careerHasTabs(hasExperience: boolean, hasEducation: boolean): boolean {
  return careerTabKeys(hasExperience, hasEducation).length > 1;
}

/** "2022 — Hiện tại" / "2022 — 2025" / "2022". `present` is the locale word for ongoing. */
export function formatPeriod(
  startYear: string,
  endYear: string,
  isCurrent: boolean,
  present: string,
): string {
  if (!startYear) return "";
  const end = isCurrent ? present : endYear;
  return end ? `${startYear} — ${end}` : startYear;
}
