import type { Dictionary } from "@/i18n/dictionary";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";

export function PrinciplesSection({ dict }: { readonly dict: Dictionary }) {
  return (
    <section aria-labelledby="principles-heading" className="mx-auto w-full max-w-6xl px-6 py-16">
      <SectionHeading
        id="principles-heading"
        eyebrow="04"
        title={dict.sections.principles}
        subtitle={dict.home.principlesSubtitle}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {dict.principles.map((principle, index) => (
          <Reveal
            key={principle.title}
            delay={index * 0.05}
            className="rounded-2xl border border-border bg-surface/40 p-5"
          >
            <h3 className="font-display text-lg italic text-fg">{principle.title}</h3>
            <p className="mt-2 text-sm leading-6 text-fg-muted">{principle.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
