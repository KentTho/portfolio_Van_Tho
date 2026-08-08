import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/shared/domain/locale";
import {
  PROJECT_LINK_TYPES,
  PROJECT_SECTION_KINDS,
  PROJECT_VISIBILITIES,
} from "@/modules/projects/domain/project";

/** kebab-case slug shared with the public route. */
const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case");

const localeSchema = z.enum(SUPPORTED_LOCALES);

const translationSchema = z.object({
  locale: localeSchema,
  title: z.string().trim().min(1).max(200),
  tagline: z.string().trim().max(300).nullable().default(null),
  summary: z.string().trim().max(2000).nullable().default(null),
});

const linkSchema = z.object({
  linkType: z.enum(PROJECT_LINK_TYPES),
  url: z.url(),
  label: z.string().trim().max(120).nullable().default(null),
  sortOrder: z.number().int().min(0).default(0),
});

const metricSchema = z.object({
  label: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1).max(120),
  unit: z.string().trim().max(40).nullable().default(null),
  evidenceUrl: z.url().nullable().default(null),
  sortOrder: z.number().int().min(0).default(0),
});

const technologyRefSchema = z.object({
  technologyId: z.uuid(),
  sortOrder: z.number().int().min(0).default(0),
});

const sectionTranslationSchema = z.object({
  locale: localeSchema,
  heading: z.string().trim().max(200).nullable().default(null),
  bodyMd: z.string().default(""),
});

const sectionSchema = z.object({
  kind: z.enum(PROJECT_SECTION_KINDS),
  sortOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
  translations: z.array(sectionTranslationSchema).default([]),
});

const mediaRefSchema = z.object({
  mediaId: z.uuid(),
  role: z.string().trim().min(1).max(40).default("gallery"),
  caption: z.string().trim().max(300).nullable().default(null),
  sortOrder: z.number().int().min(0).default(0),
});

const uniqueLocales = (arr: readonly { locale: string }[]): boolean =>
  new Set(arr.map((t) => t.locale)).size === arr.length;

const translationsCreate = z
  .array(translationSchema)
  .min(1, "at least one translation is required")
  .refine(uniqueLocales, "duplicate translation locale");

/** Create requires at least one localized title; defaults fill optional structure. */
export const projectCreateSchema = z.object({
  slug: slugSchema,
  category: z.string().trim().min(1).max(60).default("software"),
  visibility: z.enum(PROJECT_VISIBILITIES).default("private"),
  featured: z.boolean().default(false),
  featuredOrder: z.number().int().min(0).nullable().default(null),
  role: z.string().trim().max(120).nullable().default(null),
  translations: translationsCreate,
  technologies: z.array(technologyRefSchema).default([]),
  links: z.array(linkSchema).default([]),
  metrics: z.array(metricSchema).default([]),
  sections: z.array(sectionSchema).default([]),
  media: z.array(mediaRefSchema).default([]),
});

/**
 * Update: every field OPTIONAL with NO top-level default, so an omitted key leaves that
 * facet untouched. A present array means "replace this collection" (full replace).
 */
export const projectUpdateSchema = z.object({
  slug: slugSchema.optional(),
  category: z.string().trim().min(1).max(60).optional(),
  visibility: z.enum(PROJECT_VISIBILITIES).optional(),
  featured: z.boolean().optional(),
  featuredOrder: z.number().int().min(0).nullable().optional(),
  role: z.string().trim().max(120).nullable().optional(),
  translations: z.array(translationSchema).min(1).refine(uniqueLocales, "duplicate translation locale").optional(),
  technologies: z.array(technologyRefSchema).optional(),
  links: z.array(linkSchema).optional(),
  metrics: z.array(metricSchema).optional(),
  sections: z.array(sectionSchema).optional(),
  media: z.array(mediaRefSchema).optional(),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type ProjectTranslationInput = z.infer<typeof translationSchema>;
export type ProjectSectionInput = z.infer<typeof sectionSchema>;
