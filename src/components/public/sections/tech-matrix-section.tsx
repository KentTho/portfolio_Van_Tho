import { pick, type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { TechGroup } from "@/modules/public-portfolio/domain/types";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";
import { TechnologyLogo } from "@/components/technology/technology-logo";

export function TechMatrixSection({
  groups,
  locale,
  dict,
}: {
  readonly groups: readonly TechGroup[];
  readonly locale: Locale;
  readonly dict: Dictionary;
}) {
  return (
    <section aria-labelledby="tech-heading" className="mx-auto w-full max-w-6xl px-6 py-16">
      <SectionHeading
        id="tech-heading"
        eyebrow="02"
        title={dict.sections.techMatrix}
        subtitle={dict.home.techSubtitle}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, index) => (
          <Reveal key={group.id} delay={index * 0.05} className="rounded-2xl border border-border bg-surface/40 p-5">
            <h3 className="text-sm font-semibold text-fg">{pick(group.title, locale)}</h3>
            <p className="mt-1 text-xs text-fg-subtle">{pick(group.caption, locale)}</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {group.techIds.map((id) => (
                <li key={id}>
                  <TechnologyLogo id={id} size={38} showLabel />
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
