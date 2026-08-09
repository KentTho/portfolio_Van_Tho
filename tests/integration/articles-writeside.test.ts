// @vitest-environment node
import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/client";
import { articles, tags } from "@/infrastructure/database/schema";
import {
  articleCreateSchema,
  articleUpdateSchema,
} from "@/modules/articles/application/article-schema";
import { DrizzleArticleRepository } from "@/modules/articles/infrastructure/drizzle-article-repository";
import { DrizzlePortfolioRepository } from "@/modules/projects/infrastructure/drizzle-portfolio-repository";

/**
 * Live integration smoke against Neon DEVELOPMENT. Registered as a SKIPPED test in the
 * default suite (and CI) — it only runs when RUN_DB_SMOKE=1, so the offline suite needs no
 * database or secrets. `getDb()` is called inside the test body so collection never touches
 * env. Exercises the real article repositories: atomic batched writes, optimistic
 * concurrency, published-only reads, tag RESTRICT reference, and draft/archive leak rules.
 */
const RUN = process.env.RUN_DB_SMOKE === "1";

const ARTICLE_SLUG = "smoke-article-g3";
const TAG_SLUG = "smoke-tag-g3";

describe("articles write-side on Neon Development", () => {
  it("is gated behind RUN_DB_SMOKE (offline suite skips the live smoke)", () => {
    expect(typeof RUN).toBe("boolean");
  });

  it.runIf(RUN)(
    "runs the full lifecycle: create → translations/tags → publish → public read → stale → unpublish → archive, with atomicity + reference rules",
    async () => {
      const db = getDb();
      const repo = new DrizzleArticleRepository();
      const portfolio = new DrizzlePortfolioRepository();

      const clean = async () => {
        await db.delete(articles).where(eq(articles.slug, ARTICLE_SLUG));
        await db.delete(tags).where(eq(tags.slug, TAG_SLUG));
      };

      await clean(); // fresh slate
      try {
        // a referenced tag (article_tags RESTRICT target)
        const tagId = crypto.randomUUID();
        await db.insert(tags).values({ id: tagId, slug: TAG_SLUG, name: "SmokeTag" });

        // create draft (atomic multi-table batch: article + translations + tags)
        const input = articleCreateSchema.parse({
          slug: ARTICLE_SLUG,
          translations: [
            { locale: "vi", title: "Bài viết Smoke", summary: "tóm tắt", bodyMd: "# Xin chào" },
          ],
          tags: [{ tagId, sortOrder: 0 }],
        });
        const created = await repo.create(input);
        expect(created.status).toBe("draft");
        expect(created.rowVersion).toBe(1);

        // aggregate reflects children
        const agg = await repo.findAdminById(created.id);
        expect(agg?.translations).toHaveLength(1);
        expect(agg?.tags).toHaveLength(1);

        // draft leak check: not visible publicly
        const beforePublish = await portfolio.listPublishedArticles("vi");
        expect(beforePublish.some((a) => a.slug === ARTICLE_SLUG)).toBe(false);

        // publish (optimistic concurrency, version 1 → 2)
        const pub = await repo.setStatus(created.id, 1, {
          status: "published",
          publishedAt: new Date(),
        });
        expect(pub.kind === "updated" && pub.article.status).toBe("published");

        // public read now returns it, localized, with the tag name
        const detail = await portfolio.getPublishedArticle(ARTICLE_SLUG, "vi");
        expect(detail).not.toBeNull();
        expect(detail?.title).toBe("Bài viết Smoke");
        expect(detail?.bodyMd).toBe("# Xin chào");
        expect(detail?.tags).toContain("SmokeTag");

        // stale write rejected (current version is 2)
        const stale = await repo.update(created.id, 1, articleUpdateSchema.parse({ featured: true }));
        expect(stale.kind).toBe("stale");

        // unpublish → disappears from public
        const un = await repo.setStatus(created.id, 2, { status: "draft", publishedAt: null });
        expect(un.kind).toBe("updated");
        expect(await portfolio.getPublishedArticle(ARTICLE_SLUG, "vi")).toBeNull();

        // reference RESTRICT: cannot delete a tag still referenced by article_tags
        let restricted = false;
        try {
          await db.delete(tags).where(eq(tags.id, tagId));
        } catch {
          restricted = true;
        }
        expect(restricted).toBe(true);

        // transaction atomicity: a batch that violates the tag FK inserts nothing
        let threw = false;
        try {
          await repo.create(
            articleCreateSchema.parse({
              slug: "smoke-article-atomic",
              translations: [{ locale: "vi", title: "Atomic" }],
              tags: [{ tagId: crypto.randomUUID(), sortOrder: 0 }], // non-existent → FK restrict
            }),
          );
        } catch {
          threw = true;
        }
        expect(threw).toBe(true);
        expect(await repo.findBySlug("smoke-article-atomic")).toBeNull();

        // archive → still not public
        const arch = await repo.setStatus(created.id, 3, { status: "archived", publishedAt: null });
        expect(arch.kind === "updated" && arch.article.status).toBe("archived");
        expect(await portfolio.getPublishedArticle(ARTICLE_SLUG, "vi")).toBeNull();
      } finally {
        await clean();
      }

      const leftArticles = await db
        .select({ id: articles.id })
        .from(articles)
        .where(eq(articles.slug, ARTICLE_SLUG));
      const leftTags = await db.select({ id: tags.id }).from(tags).where(eq(tags.slug, TAG_SLUG));
      expect(leftArticles).toHaveLength(0);
      expect(leftTags).toHaveLength(0);
    },
    60_000,
  );
});
