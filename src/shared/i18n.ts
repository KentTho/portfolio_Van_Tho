/**
 * Locale primitives shared across layers (kernel). Framework-free.
 * `vi` is the default locale; `en` is secondary.
 */
export const LOCALES = ["vi", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "vi";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** A value expressed in every supported locale. */
export type Localized<T> = Record<Locale, T>;

/** Resolve a localized value for a locale. */
export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
