import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { ProjectSummary } from "@/modules/public-portfolio/domain/types";
import { SectionHeading } from "@/components/public/section-heading";
import { ProjectCard } from "@/components/public/project-card";
import { Reveal } from "@/components/public/reveal";

export function FeaturedProjectsSection({
  projects,
  locale,
  dict,
}: {
  readonly projects: readonly ProjectSummary[];
  readonly locale: Locale;
  readonly dict: Dictionary;
}) {
  if (projects.length === 0) return null;

  return (
    <section aria-labelledby="featured-heading" className="mx-auto w-full max-w-6xl px-6 py-16">
      <SectionHeading
        id="featured-heading"
        eyebrow="03"
        title={dict.sections.featured}
        subtitle={dict.home.featuredSubtitle}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.05} className="h-full">
            <ProjectCard
              project={project}
              locale={locale}
              href={`/${locale}/projects/${project.slug}`}
              sampleLabel={dict.labels.sample}
            />
          </Reveal>
        ))}
      </div>
      <div className="mt-8">
        <Link
          href={`/${locale}/projects`}
          className="inline-flex items-center gap-2 text-sm text-accent transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          {dict.actions.viewAll}
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
