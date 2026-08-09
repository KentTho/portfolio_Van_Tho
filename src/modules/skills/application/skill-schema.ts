import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case");

export const skillCreateSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(80).default("general"),
  proficiencyLabel: z.string().trim().max(80).nullable().default(null),
  evidenceText: z.string().trim().max(1000).nullable().default(null),
  displayOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const skillUpdateSchema = z.object({
  slug: slugSchema.optional(),
  name: z.string().trim().min(1).max(120).optional(),
  category: z.string().trim().min(1).max(80).optional(),
  proficiencyLabel: z.string().trim().max(80).nullable().optional(),
  evidenceText: z.string().trim().max(1000).nullable().optional(),
  displayOrder: z.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
});

export type SkillCreateInput = z.infer<typeof skillCreateSchema>;
export type SkillUpdateInput = z.infer<typeof skillUpdateSchema>;
