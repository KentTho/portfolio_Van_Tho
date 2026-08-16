import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/shared/domain/locale";

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
  summary: z.string().trim().max(500).nullable().default(null),
  /** Markdown/MDX body; sanitized at render (no trusted raw HTML executed). */
  bodyMd: z.string().default(""),
});

const tagRefSchema = z.object({
  tagId: z.uuid(),
  sortOrder: z.number().int().min(0).default(0),
});

const uniqueLocales = (arr: readonly { locale: string }[]): boolean =>
  new Set(arr.map((t) => t.locale)).size === arr.length;

const translationsCreate = z
  .array(translationSchema)
  .min(1, "at least one translation is required")
  .refine(uniqueLocales, "duplicate translation locale");

export const articleCreateSchema = z.object({
  slug: slugSchema,
  featured: z.boolean().default(false),
  featuredOrder: z.number().int().min(0).nullable().default(null),
  coverMediaId: z.uuid().nullable().default(null),
  translations: translationsCreate,
  tags: z.array(tagRefSchema).default([]),
});

/** Update: every field optional, no top-level default — omitted keys leave facets untouched. */
export const articleUpdateSchema = z.object({
  slug: slugSchema.optional(),
  featured: z.boolean().optional(),
  featuredOrder: z.number().int().min(0).nullable().optional(),
  coverMediaId: z.uuid().nullable().optional(),
  translations: z
    .array(translationSchema)
    .min(1)
    .refine(uniqueLocales, "duplicate translation locale")
    .optional(),
  tags: z.array(tagRefSchema).optional(),
});

export type ArticleCreateInput = z.infer<typeof articleCreateSchema>;
export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>;
