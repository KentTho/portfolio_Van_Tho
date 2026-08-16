/**
 * Site settings — a typed key/value store (jsonb value). `isPublic` gates whether a setting
 * may be read by the public site; private settings never leave the admin boundary.
 */
export interface SiteSetting {
  readonly key: string;
  readonly value: unknown;
  readonly isPublic: boolean;
}
