import type {
  AdminArticleAggregate,
  Article,
  ArticleStatus,
} from "@/modules/articles/domain/article";
import type {
  ArticleCreateInput,
  ArticleUpdateInput,
} from "@/modules/articles/application/article-schema";

export type ArticleWriteOutcome =
  | { readonly kind: "updated"; readonly article: Article }
  | { readonly kind: "not_found" }
  | { readonly kind: "stale" };

export interface ArticleStatusChange {
  readonly status: ArticleStatus;
  readonly publishedAt: Date | null;
}

/**
 * Admin-side article repository. Multi-table writes (article + translations + tags) are
 * atomic via the Neon HTTP batched transaction. Optimistic concurrency via row_version.
 */
export interface ArticleRepositoryPort {
  findBySlug(slug: string): Promise<{ readonly id: string } | null>;
  findAdminById(id: string): Promise<AdminArticleAggregate | null>;
  listAdmin(): Promise<readonly Article[]>;
  create(input: ArticleCreateInput): Promise<Article>;
  update(
    id: string,
    expectedRowVersion: number,
    patch: ArticleUpdateInput,
  ): Promise<ArticleWriteOutcome>;
  setStatus(
    id: string,
    expectedRowVersion: number,
    change: ArticleStatusChange,
  ): Promise<ArticleWriteOutcome>;
}
