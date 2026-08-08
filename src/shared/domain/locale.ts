/**
 * Supported content locales for the CMS (CLAUDE.md — vi/en only in V1). Single source
 * of truth mirrored by the DB `... in ('vi','en')` check constraints; a test guards drift.
 */
export const SUPPORTED_LOCALES = ["vi", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "vi";

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
