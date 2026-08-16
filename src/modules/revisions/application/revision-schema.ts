import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/shared/domain/locale";
import { REVISION_CONTENT_TYPES } from "@/modules/revisions/domain/content-revision";

/** Any JSON value (jsonb-safe snapshot payload). */
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

/** Version is server-assigned (max+1 per entity), never client-provided. */
export const createRevisionSchema = z.object({
  contentType: z.enum(REVISION_CONTENT_TYPES),
  contentId: z.uuid(),
  locale: z.enum(SUPPORTED_LOCALES).nullable().default(null),
  snapshot: jsonValue,
});

export const revisionRefSchema = z.object({
  contentType: z.enum(REVISION_CONTENT_TYPES),
  contentId: z.uuid(),
});

export type CreateRevisionInput = z.infer<typeof createRevisionSchema>;
export type RevisionRef = z.infer<typeof revisionRefSchema>;
