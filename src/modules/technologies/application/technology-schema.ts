import { z } from "zod";
import { TECHNOLOGY_CATEGORIES } from "@/modules/technologies/domain/technology";

/** kebab-case identifier, e.g. "next-js", "postgresql". */
const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case");

const brandColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "brand color must be a #rrggbb hex value");

/**
 * Trust-boundary validation for technology mutations. DTOs are inferred from the schema
 * (single source of truth per CLAUDE.md §8). `category` is validated against the same
 * tuple the DB enum uses.
 */
export const technologyCreateSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1).max(120),
  category: z.enum(TECHNOLOGY_CATEGORIES),
  deviconKey: z.string().trim().min(1).max(64).nullable().default(null),
  brandColor: brandColorSchema.nullable().default(null),
  website: z.url().nullable().default(null),
  sortOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const technologyUpdateSchema = technologyCreateSchema.partial();

export type TechnologyCreateInput = z.infer<typeof technologyCreateSchema>;
export type TechnologyUpdateInput = z.infer<typeof technologyUpdateSchema>;
