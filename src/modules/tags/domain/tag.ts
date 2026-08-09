/**
 * Tag domain entity — pure, framework-free. Shared content taxonomy consumed by articles
 * via `article_tags`. Storage row shape lives in infrastructure.
 */
export interface Tag {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly sortOrder: number;
}
