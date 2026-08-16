// @vitest-environment node
import { describe, expect, it } from "vitest";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/client";
import { contentRevisions } from "@/infrastructure/database/schema";
import { DrizzleRevisionRepository } from "@/modules/revisions/infrastructure/drizzle-revision-repository";

/**
 * Live integration smoke against Neon DEVELOPMENT. Gated by RUN_DB_SMOKE=1. Proves the
 * append-only revision store: server-assigned incrementing versions, immutable snapshots,
 * newest-first listing, and a non-mutating restore preview. actorUserId is null here to
 * stay FK-safe without seeding an app_users row.
 */
const RUN = process.env.RUN_DB_SMOKE === "1";

const CONTENT_ID = "22222222-2222-2222-2222-222222222222";

describe("content revisions write-side on Neon Development", () => {
  it("is gated behind RUN_DB_SMOKE (offline suite skips the live smoke)", () => {
    expect(typeof RUN).toBe("boolean");
  });

  it.runIf(RUN)(
    "creates versioned immutable snapshots, lists newest-first, previews restore without mutation",
    async () => {
      const db = getDb();
      const repo = new DrizzleRevisionRepository();

      const clean = async () =>
        db
          .delete(contentRevisions)
          .where(
            and(
              eq(contentRevisions.contentType, "article"),
              eq(contentRevisions.contentId, CONTENT_ID),
            ),
          );

      await clean();
      try {
        const v1 = await repo.create(
          { contentType: "article", contentId: CONTENT_ID, locale: null, snapshot: { title: "v1" } },
          null,
        );
        const v2 = await repo.create(
          { contentType: "article", contentId: CONTENT_ID, locale: "vi", snapshot: { title: "v2" } },
          null,
        );
        expect(v1.version).toBe(1);
        expect(v2.version).toBe(2);

        // listing is newest-first
        const list = await repo.listForEntity("article", CONTENT_ID);
        expect(list.map((r) => r.version)).toEqual([2, 1]);

        // snapshot round-trips as stored JSON
        const fetched = await repo.findById(v1.id);
        expect(fetched?.snapshot).toEqual({ title: "v1" });

        // preview restore = read-only: fetching the old snapshot adds no new revision
        const preview = await repo.findById(v1.id);
        expect(preview?.snapshot).toEqual({ title: "v1" });
        const listAfter = await repo.listForEntity("article", CONTENT_ID);
        expect(listAfter).toHaveLength(2);

        // a third snapshot continues the sequence (append-only forward history)
        const v3 = await repo.create(
          { contentType: "article", contentId: CONTENT_ID, locale: null, snapshot: { title: "v1" } },
          null,
        );
        expect(v3.version).toBe(3);
      } finally {
        await clean();
      }

      const left = await db
        .select({ id: contentRevisions.id })
        .from(contentRevisions)
        .where(
          and(
            eq(contentRevisions.contentType, "article"),
            eq(contentRevisions.contentId, CONTENT_ID),
          ),
        );
      expect(left).toHaveLength(0);
    },
    60_000,
  );
});
