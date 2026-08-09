import "server-only";
import { and, asc, desc, eq, isNull } from "drizzle-orm";
import type { AdminArticleAggregate, Article } from "@/modules/articles/domain/article";
import type { Locale } from "@/shared/domain/locale";
import type {
  ArticleRepositoryPort,
  ArticleStatusChange,
  ArticleWriteOutcome,
} from "@/modules/articles/application/ports/article-repository-port";
import type {
  ArticleCreateInput,
  ArticleUpdateInput,
} from "@/modules/articles/application/article-schema";
import { getDb } from "@/infrastructure/database/client";
import {
  articleTags,
  articleTranslations,
  articles,
  type ArticleRow,
} from "@/infrastructure/database/schema";

type Db = ReturnType<typeof getDb>;
// drizzle batch() is typed for fixed tuples; our list is built dynamically but every
// element is a valid pg batch item. Narrow cast to the method's own parameter type.
type BatchArg = Parameters<Db["batch"]>[0];

function toArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    featured: row.featured,
    featuredOrder: row.featuredOrder,
    coverMediaId: row.coverMediaId,
    publishedAt: row.publishedAt,
    rowVersion: row.rowVersion,
  };
}

function scalarPatch(patch: ArticleUpdateInput) {
  const out: Partial<Pick<ArticleRow, "slug" | "featured" | "featuredOrder" | "coverMediaId">> = {};
  if (patch.slug !== undefined) out.slug = patch.slug;
  if (patch.featured !== undefined) out.featured = patch.featured;
  if (patch.featuredOrder !== undefined) out.featuredOrder = patch.featuredOrder;
  if (patch.coverMediaId !== undefined) out.coverMediaId = patch.coverMediaId;
  return out;
}

/** Neon-backed admin article repository (Group 3). Atomic multi-table writes via db.batch. */
export class DrizzleArticleRepository implements ArticleRepositoryPort {
  async findBySlug(slug: string): Promise<{ id: string } | null> {
    const rows = await getDb()
      .select({ id: articles.id })
      .from(articles)
      .where(and(eq(articles.slug, slug), isNull(articles.deletedAt)))
      .limit(1);
    const row = rows[0];
    return row ? { id: row.id } : null;
  }

  async listAdmin(): Promise<readonly Article[]> {
    const rows = await getDb()
      .select()
      .from(articles)
      .where(isNull(articles.deletedAt))
      .orderBy(desc(articles.updatedAt));
    return rows.map(toArticle);
  }

  private async loadArticle(id: string): Promise<Article | null> {
    const rows = await getDb()
      .select()
      .from(articles)
      .where(and(eq(articles.id, id), isNull(articles.deletedAt)))
      .limit(1);
    const row = rows[0];
    return row ? toArticle(row) : null;
  }

  async findAdminById(id: string): Promise<AdminArticleAggregate | null> {
    const db = getDb();
    const article = await this.loadArticle(id);
    if (!article) return null;
    const [translations, tags] = await Promise.all([
      db.select().from(articleTranslations).where(eq(articleTranslations.articleId, id)),
      db
        .select()
        .from(articleTags)
        .where(eq(articleTags.articleId, id))
        .orderBy(asc(articleTags.sortOrder)),
    ]);
    return {
      article,
      translations: translations.map((t) => ({
        locale: t.locale as Locale,
        title: t.title,
        summary: t.summary,
        bodyMd: t.bodyMd,
      })),
      tags: tags.map((t) => ({ tagId: t.tagId, sortOrder: t.sortOrder })),
    };
  }

  private childInserts(db: Db, articleId: string, input: ArticleCreateInput | ArticleUpdateInput) {
    const q: unknown[] = [];
    for (const t of input.translations ?? []) {
      q.push(db.insert(articleTranslations).values({ articleId, ...t }));
    }
    for (const tag of input.tags ?? []) {
      q.push(db.insert(articleTags).values({ articleId, ...tag }));
    }
    return q;
  }

  async create(input: ArticleCreateInput): Promise<Article> {
    const db = getDb();
    const articleId = crypto.randomUUID();
    const queries: unknown[] = [
      db.insert(articles).values({
        id: articleId,
        slug: input.slug,
        status: "draft",
        featured: input.featured,
        featuredOrder: input.featuredOrder,
        coverMediaId: input.coverMediaId,
      }),
      ...this.childInserts(db, articleId, input),
    ];
    await db.batch(queries as unknown as BatchArg);
    return {
      id: articleId,
      slug: input.slug,
      status: "draft",
      featured: input.featured,
      featuredOrder: input.featuredOrder,
      coverMediaId: input.coverMediaId,
      publishedAt: null,
      rowVersion: 1,
    };
  }

  async update(
    id: string,
    expectedRowVersion: number,
    patch: ArticleUpdateInput,
  ): Promise<ArticleWriteOutcome> {
    const db = getDb();
    const existing = await db
      .select({ v: articles.rowVersion })
      .from(articles)
      .where(and(eq(articles.id, id), isNull(articles.deletedAt)))
      .limit(1);
    const cur = existing[0];
    if (!cur) return { kind: "not_found" };
    if (cur.v !== expectedRowVersion) return { kind: "stale" };

    const queries: unknown[] = [
      db
        .update(articles)
        .set({ ...scalarPatch(patch), rowVersion: expectedRowVersion + 1, updatedAt: new Date() })
        .where(and(eq(articles.id, id), eq(articles.rowVersion, expectedRowVersion))),
    ];
    if (patch.translations !== undefined) {
      queries.push(db.delete(articleTranslations).where(eq(articleTranslations.articleId, id)));
    }
    if (patch.tags !== undefined) {
      queries.push(db.delete(articleTags).where(eq(articleTags.articleId, id)));
    }
    queries.push(...this.childInserts(db, id, patch));
    await db.batch(queries as unknown as BatchArg);

    const article = await this.loadArticle(id);
    return article ? { kind: "updated", article } : { kind: "not_found" };
  }

  async setStatus(
    id: string,
    expectedRowVersion: number,
    change: ArticleStatusChange,
  ): Promise<ArticleWriteOutcome> {
    const db = getDb();
    const existing = await db
      .select({ v: articles.rowVersion })
      .from(articles)
      .where(and(eq(articles.id, id), isNull(articles.deletedAt)))
      .limit(1);
    const cur = existing[0];
    if (!cur) return { kind: "not_found" };
    if (cur.v !== expectedRowVersion) return { kind: "stale" };
    await db
      .update(articles)
      .set({
        status: change.status,
        publishedAt: change.publishedAt,
        rowVersion: expectedRowVersion + 1,
        updatedAt: new Date(),
      })
      .where(and(eq(articles.id, id), eq(articles.rowVersion, expectedRowVersion)));
    const article = await this.loadArticle(id);
    return article ? { kind: "updated", article } : { kind: "not_found" };
  }
}
