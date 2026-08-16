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
 * Field validators with NO defaults. `create` layers defaults on top; `update` uses
 * `.partial()` over these raw fields so an omitted key stays undefined (and never
 * silently clobbers a column back to its create-time default). See CLAUDE.md §8.
 */
const fields = {
  slug: slugSchema,
  name: z.string().trim().min(1).max(120),
  category: z.enum(TECHNOLOGY_CATEGORIES),
  deviconKey: z.string().trim().min(1).max(64).nullable(),
  brandColor: brandColorSchema.nullable(),
  website: z.url().nullable(),
  sortOrder: z.number().int().min(0),
  isVisible: z.boolean(),
};

/** Trust-boundary validation for creating a technology (defaults fill optional fields). */
export const technologyCreateSchema = z.object({
  slug: fields.slug,
  name: fields.name,
  category: fields.category,
  deviconKey: fields.deviconKey.default(null),
  brandColor: fields.brandColor.default(null),
  website: fields.website.default(null),
  sortOrder: fields.sortOrder.default(0),
  isVisible: fields.isVisible.default(true),
});

/** Partial update — only the provided keys are validated and applied. */
export const technologyUpdateSchema = z.object(fields).partial();

export type TechnologyCreateInput = z.infer<typeof technologyCreateSchema>;
export type TechnologyUpdateInput = z.infer<typeof technologyUpdateSchema>;
