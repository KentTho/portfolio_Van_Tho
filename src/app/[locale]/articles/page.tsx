import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, pick } from "@/shared/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { getPortfolioRepository } from "@/composition/public-portfolio";
import { buildLocaleMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/public/page-header";
import { SampleBadge } from "@/components/public/sample-badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildLocaleMetadata({
    locale,
    path: "/articles",
    title: dict.meta.articlesTitle,
    description: dict.home.writingSubtitle,
  });
}

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const articles = await getPortfolioRepository().listArticles();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <PageHeader eyebrow="Writing" title={dict.nav.articles} subtitle={dict.home.writingSubtitle} />
      {articles.length === 0 ? (
        <p className="text-fg-muted">{dict.labels.empty}</p>
      ) : (
        <ul className="divide-y divide-border">
          {articles.map((article) => (
            <li key={article.slug} className="py-6">
              <Link
                href={`/${locale}/articles/${article.slug}`}
                className="group block focus-visible:outline-none"
              >
                <div className="flex items-center gap-3">
                  <time className="font-mono text-xs text-fg-subtle" dateTime={article.publishedAt}>
                    {article.publishedAt}
                  </time>
                  {article.sample ? <SampleBadge label={dict.labels.sample} /> : null}
                </div>
                <h2 className="mt-2 font-display text-2xl italic text-fg transition-colors group-hover:text-accent">
                  {pick(article.title, locale)}
                </h2>
                <p className="mt-2 text-fg-muted">{pick(article.summary, locale)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
