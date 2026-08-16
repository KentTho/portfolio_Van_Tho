import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/shared/domain/locale";
import { AVAILABILITY_STATUSES } from "@/modules/profile/domain/profile";

/** Profile update: every field optional, no top-level default — omitted keys stay untouched. */
export const profileUpdateSchema = z.object({
  fullName: z.string().trim().max(200).optional(),
  professionalTitle: z.string().trim().max(200).optional(),
  location: z.string().trim().max(200).nullable().optional(),
  publicEmail: z.email().max(320).nullable().optional(),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES).optional(),
  defaultLocale: z.enum(SUPPORTED_LOCALES).optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
