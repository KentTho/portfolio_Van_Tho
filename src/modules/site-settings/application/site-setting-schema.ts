import { z } from "zod";

/** Any JSON value (typed as unknown at the boundary; jsonb-safe — no undefined/functions). */
const jsonValue: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValue),
    z.record(z.string(), jsonValue),
  ]),
);

const keySchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/, "key must be lowercase dotted/kebab identifier");

export const settingUpsertSchema = z.object({
  key: keySchema,
  value: jsonValue,
  isPublic: z.boolean().default(false),
});

export type SettingUpsertInput = z.infer<typeof settingUpsertSchema>;
