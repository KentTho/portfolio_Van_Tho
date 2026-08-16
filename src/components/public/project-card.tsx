import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pick, type Locale } from "@/shared/i18n";
import type { ProjectSummary } from "@/modules/public-portfolio/domain/types";
import { SampleBadge } from "@/components/public/sample-badge";
import { TechnologyLogo } from "@/components/technology/technology-logo";

/**
 * ProjectCard — shared between featured projects and projects list.
 * COSMIC ENGINEERING EDITORIAL: bold sans display title, not italic serif.
 */
export function ProjectCard({
  project,
  locale,
  href,
  sampleLabel,
}: {
  readonly project: ProjectSummary;
  readonly locale: Locale;
  readonly href: string;
  readonly sampleLabel: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-border bg-surface/40 p-6 transition-all hover:border-accent/30 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <div className="flex items-center justify-between">
        <span className="label-mono">{project.year ?? ""}</span>
        {project.sample ? <SampleBadge label={sampleLabel} /> : null}
      </div>
      <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-fg transition-colors group-hover:text-accent">
        {pick(project.title, locale)}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
        {pick(project.summary, locale)}
      </p>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
        {project.techIds.slice(0, 5).map((id) => (
          <li key={id}>
            <TechnologyLogo id={id} size={28} />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-1 text-xs text-fg-subtle transition-colors group-hover:text-accent">
        <ArrowUpRight size={12} aria-hidden />
        <span>View project</span>
      </div>
    </Link>
  );
}
