import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isLocale, pick } from "@/shared/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { getPortfolioRepository } from "@/composition/public-portfolio";
import { buildLocaleMetadata } from "@/lib/seo";
import { SampleBadge } from "@/components/public/sample-badge";
import { Markdown } from "@/components/public/markdown";

// Slugs render on demand from the live Neon read model (see [locale]/layout `dynamic`);
// no build-time DB access, so no params are pre-generated here.
export async function generateStaticParams() {
  return [] as { locale: string; slug: string }[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = await getPortfolioRepository().getArticle(slug);
  if (!article) return {};
  return buildLocaleMetadata({
    locale,
    path: `/articles/${slug}`,
    title: pick(article.title, locale),
    description: pick(article.summary, locale),
    index: !article.sample,
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const article = await getPortfolioRepository().getArticle(slug);
  if (!article) notFound();

  const dict = getDictionary(locale);

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-sm text-fg-subtle transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft size={14} aria-hidden />
        {dict.nav.articles}
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <time className="font-mono text-xs text-fg-subtle" dateTime={article.publishedAt}>
          {article.publishedAt}
        </time>
        {article.sample ? <SampleBadge label={dict.labels.sample} /> : null}
      </div>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-fg">
        {pick(article.title, locale)}
      </h1>

      <div className="mt-8">
        <Markdown source={pick(article.body, locale)} />
      </div>

      {article.tags.length > 0 ? (
        <ul className="mt-10 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border px-3 py-1 font-mono text-xs text-fg-subtle"
            >
              #{tag}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
