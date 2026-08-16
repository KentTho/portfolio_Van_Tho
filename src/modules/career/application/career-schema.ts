import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/shared/domain/locale";

/** ISO calendar date (Postgres `date`): YYYY-MM-DD, no time component. */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");
const httpUrl = z.url().max(500);
const localeSchema = z.enum(SUPPORTED_LOCALES);

const uniqueLocales = (arr: readonly { locale: string }[]): boolean =>
  new Set(arr.map((t) => t.locale)).size === arr.length;

const experienceTranslationSchema = z.object({
  locale: localeSchema,
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().max(2000).nullable().default(null),
});

// ---- Experiences (base + localized translations) -------------------------------------

export const experienceCreateSchema = z.object({
  organization: z.string().trim().min(1).max(200),
  employmentType: z.string().trim().max(80).nullable().default(null),
  location: z.string().trim().max(200).nullable().default(null),
  url: httpUrl.nullable().default(null),
  startDate: isoDate,
  endDate: isoDate.nullable().default(null),
  isCurrent: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
  translations: z
    .array(experienceTranslationSchema)
    .min(1, "at least one translation is required")
    .refine(uniqueLocales, "duplicate translation locale"),
});

export const experienceUpdateSchema = z.object({
  organization: z.string().trim().min(1).max(200).optional(),
  employmentType: z.string().trim().max(80).nullable().optional(),
  location: z.string().trim().max(200).nullable().optional(),
  url: httpUrl.nullable().optional(),
  startDate: isoDate.optional(),
  endDate: isoDate.nullable().optional(),
  isCurrent: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
  translations: z
    .array(experienceTranslationSchema)
    .min(1)
    .refine(uniqueLocales, "duplicate translation locale")
    .optional(),
});

// ---- Education -----------------------------------------------------------------------

export const educationCreateSchema = z.object({
  institution: z.string().trim().min(1).max(200),
  degree: z.string().trim().max(200).nullable().default(null),
  fieldOfStudy: z.string().trim().max(200).nullable().default(null),
  startDate: isoDate.nullable().default(null),
  endDate: isoDate.nullable().default(null),
  isCurrent: z.boolean().default(false),
  url: httpUrl.nullable().default(null),
  sortOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const educationUpdateSchema = z.object({
  institution: z.string().trim().min(1).max(200).optional(),
  degree: z.string().trim().max(200).nullable().optional(),
  fieldOfStudy: z.string().trim().max(200).nullable().optional(),
  startDate: isoDate.nullable().optional(),
  endDate: isoDate.nullable().optional(),
  isCurrent: z.boolean().optional(),
  url: httpUrl.nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
});

// ---- Certifications ------------------------------------------------------------------

export const certificationCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  issuer: z.string().trim().min(1).max(200),
  issueDate: isoDate.nullable().default(null),
  expiryDate: isoDate.nullable().default(null),
  credentialId: z.string().trim().max(200).nullable().default(null),
  credentialUrl: httpUrl.nullable().default(null),
  sortOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const certificationUpdateSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  issuer: z.string().trim().min(1).max(200).optional(),
  issueDate: isoDate.nullable().optional(),
  expiryDate: isoDate.nullable().optional(),
  credentialId: z.string().trim().max(200).nullable().optional(),
  credentialUrl: httpUrl.nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
});

export type ExperienceCreateInput = z.infer<typeof experienceCreateSchema>;
export type ExperienceUpdateInput = z.infer<typeof experienceUpdateSchema>;
export type EducationCreateInput = z.infer<typeof educationCreateSchema>;
export type EducationUpdateInput = z.infer<typeof educationUpdateSchema>;
export type CertificationCreateInput = z.infer<typeof certificationCreateSchema>;
export type CertificationUpdateInput = z.infer<typeof certificationUpdateSchema>;
