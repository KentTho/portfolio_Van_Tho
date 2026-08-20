"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { pick, type Locale } from "@/shared/i18n";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";
import type { Dictionary } from "@/i18n/dictionary";
import type { ProjectSummary } from "@/modules/public-portfolio/domain/types";
import { TechnologyLogo } from "@/components/technology/technology-logo";
import { SampleBadge } from "@/components/public/sample-badge";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";

/**
 * COSMIC ENGINEERING EDITORIAL — Featured Projects
 *
 * Visual cards with hover lift + border glow. ArrowUpRight for external feel.
 * Empty state: honest designed state (not null).
 */
export function FeaturedProjectsSection({
  projects,
  locale,
  dict,
  viewAllHref,
}: {
  readonly projects: readonly ProjectSummary[];
  readonly locale: Locale;
  readonly dict: Dictionary;
  /** When provided, render a "view all" link (used off-landing). On the single
   * landing the section already lists every published project, so it is omitted. */
  readonly viewAllHref?: string;
}) {
  const reduced = useReducedMotionSafe();

  return (
    <section
      aria-labelledby="featured-heading"
      className="mx-auto w-full max-w-6xl px-6 py-24"
    >
      <Reveal>
        <SectionHeading
          id="featured-heading"
          title={dict.sections.featured}
          subtitle={dict.home.featuredSubtitle}
        />
      </Reveal>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-border border-dashed bg-surface/20 px-8 py-16 text-center">
          <p className="label-mono mb-2 text-fg-subtle">No projects yet</p>
          <p className="text-sm text-fg-subtle">
            Projects will appear here once published.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.06} className="h-full">
              <ProjectCard
                project={project}
                locale={locale}
                href={`/${locale}/projects/${project.slug}`}
                sampleLabel={dict.labels.sample}
                reduced={!!reduced}
              />
            </Reveal>
          ))}
        </div>
      )}

      {viewAllHref && (
        <div className="mt-10">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            {dict.actions.viewAll}
            <ArrowUpRight size={15} aria-hidden />
          </Link>
        </div>
      )}
    </section>
  );
}

/* ── Project card ───────────────────────────────────────────────────────────── */
function ProjectCard({
  project,
  locale,
  href,
  sampleLabel,
  reduced,
}: {
  readonly project: ProjectSummary;
  readonly locale: Locale;
  readonly href: string;
  readonly sampleLabel: string;
  readonly reduced: boolean;
}) {
  return (
    <motion.div
      whileHover={
        reduced
          ? undefined
          : { y: -4, boxShadow: "var(--glow-soft)" }
      }
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={href}
        className="group flex h-full flex-col rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-accent/30 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        {/* Meta row */}
        <div className="flex items-center justify-between">
          <span className="label-mono">{project.year ?? ""}</span>
          {project.sample ? <SampleBadge label={sampleLabel} /> : null}
        </div>

        {/* Title */}
        <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-fg transition-colors group-hover:text-accent">
          {pick(project.title, locale)}
        </h3>

        {/* Summary */}
        <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
          {pick(project.summary, locale)}
        </p>

        {/* Tech logos */}
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
          {project.techIds.slice(0, 5).map((id) => (
            <li key={id}>
              <TechnologyLogo id={id} size={28} />
            </li>
          ))}
        </ul>

        {/* View indicator */}
        <div className="mt-4 flex items-center gap-1 text-xs text-fg-subtle transition-colors group-hover:text-accent">
          <ArrowUpRight size={13} aria-hidden />
          <span>View project</span>
        </div>
      </Link>
    </motion.div>
  );
}
