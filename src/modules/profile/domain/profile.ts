import type { Locale } from "@/shared/domain/locale";

/** Owner availability signal shown on the public profile. */
export const AVAILABILITY_STATUSES = ["open", "limited", "unavailable", "unknown"] as const;
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

/** Singleton owner profile (one row, key "primary"). No fabricated content is seeded. */
export interface Profile {
  readonly fullName: string;
  readonly professionalTitle: string;
  readonly location: string | null;
  readonly publicEmail: string | null;
  readonly availabilityStatus: AvailabilityStatus;
  readonly defaultLocale: Locale;
}
