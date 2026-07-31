import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/shared/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { getPortfolioRepository } from "@/composition/public-portfolio";
import { buildLocaleMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/public/page-header";
import { ProjectCard } from "@/components/public/project-card";

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
    path: "/projects",
    title: dict.meta.projectsTitle,
    description: dict.home.featuredSubtitle,
  });
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const projects = await getPortfolioRepository().listProjects();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <PageHeader eyebrow="Projects" title={dict.nav.projects} subtitle={dict.home.featuredSubtitle} />
      {projects.length === 0 ? (
        <p className="text-fg-muted">{dict.labels.empty}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              href={`/${locale}/projects/${project.slug}`}
              sampleLabel={dict.labels.sample}
            />
          ))}
        </div>
      )}
    </div>
  );
}
