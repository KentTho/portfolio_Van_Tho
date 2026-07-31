import Link from "next/link";
import { pick, type Locale } from "@/shared/i18n";
import type { ProjectSummary } from "@/modules/public-portfolio/domain/types";
import { SampleBadge } from "@/components/public/sample-badge";
import { TechnologyLogo } from "@/components/technology/technology-logo";

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
      className="group flex h-full flex-col rounded-2xl border border-border bg-surface/40 p-5 transition hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-fg-subtle">{project.year ?? ""}</span>
        {project.sample ? <SampleBadge label={sampleLabel} /> : null}
      </div>
      <h3 className="mt-3 font-display text-xl italic text-fg transition-colors group-hover:text-accent">
        {pick(project.title, locale)}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-fg-muted">{pick(project.summary, locale)}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.techIds.slice(0, 5).map((id) => (
          <li key={id}>
            <TechnologyLogo id={id} size={30} />
          </li>
        ))}
      </ul>
    </Link>
  );
}
