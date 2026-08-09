import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case");

/** Create fills sortOrder default; update keeps every field optional (no clobber). */
export const tagCreateSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1).max(80),
  sortOrder: z.number().int().min(0).default(0),
});

export const tagUpdateSchema = z.object({
  slug: slugSchema.optional(),
  name: z.string().trim().min(1).max(80).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type TagCreateInput = z.infer<typeof tagCreateSchema>;
export type TagUpdateInput = z.infer<typeof tagUpdateSchema>;
