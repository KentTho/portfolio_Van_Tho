import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Code2, ExternalLink } from "lucide-react";
import { isLocale, pick, type Locale } from "@/shared/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { getPortfolioRepository } from "@/composition/public-portfolio";
import { buildLocaleMetadata } from "@/lib/seo";
import { SampleBadge } from "@/components/public/sample-badge";
import { TechnologyLogo } from "@/components/technology/technology-logo";

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
  const project = await getPortfolioRepository().getProject(slug);
  if (!project) return {};
  return buildLocaleMetadata({
    locale,
    path: `/projects/${slug}`,
    title: pick(project.title, locale),
    description: pick(project.summary, locale),
    index: !project.sample,
  });
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-subtle">{label}</h2>
      <div className="mt-2 leading-8 text-fg-muted">{children}</div>
    </section>
  );
}

function ListBlock({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <Block label={label}>
      <ul className="list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Block>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = await getPortfolioRepository().getProject(slug);
  if (!project) notFound();

  const dict = getDictionary(locale);
  const cs = dict.caseStudy;
  const l: Locale = locale;

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16">
      <Link
        href={`/${locale}/projects`}
        className="inline-flex items-center gap-2 text-sm text-fg-subtle transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft size={14} aria-hidden />
        {dict.nav.projects}
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <span className="font-mono text-xs text-fg-subtle">{project.year ?? ""}</span>
        {project.sample ? <SampleBadge label={dict.labels.sample} /> : null}
      </div>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-fg">{pick(project.title, l)}</h1>
      <p className="mt-4 text-lg text-fg-muted">{pick(project.summary, l)}</p>

      <ul className="mt-6 flex flex-wrap gap-2" aria-label={dict.labels.techStack}>
        {project.techIds.map((id) => (
          <li key={id}>
            <TechnologyLogo id={id} size={34} />
          </li>
        ))}
      </ul>

      {project.repoUrl || project.demoUrl ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-fg-muted transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Code2 size={15} aria-hidden />
              {dict.actions.viewSource}
            </a>
          ) : null}
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-fg-muted transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ExternalLink size={15} aria-hidden />
              {dict.actions.liveDemo}
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="mt-10 space-y-8">
        <Block label={cs.problem}>{pick(project.problem, l)}</Block>
        <Block label={cs.context}>{pick(project.context, l)}</Block>
        <Block label={cs.role}>{pick(project.role, l)}</Block>
        <Block label={cs.architecture}>{pick(project.architecture, l)}</Block>
        <ListBlock label={cs.decisions} items={project.decisions.map((d) => pick(d, l))} />
        <ListBlock label={cs.tradeoffs} items={project.tradeoffs.map((t) => pick(t, l))} />
        <Block label={cs.results}>{pick(project.results, l)}</Block>
        <Block label={cs.limitations}>{pick(project.limitations, l)}</Block>
        <Block label={cs.nextStep}>{pick(project.nextStep, l)}</Block>
      </div>
    </article>
  );
}
