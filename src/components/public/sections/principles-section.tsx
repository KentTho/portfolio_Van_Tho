import type { Dictionary } from "@/i18n/dictionary";
import { Reveal } from "@/components/public/reveal";

/**
 * COSMIC ENGINEERING EDITORIAL — Principles
 *
 * Manifesto layout: large numbered principles in a list, not cards.
 * Each principle is a full-width row with index + title + body.
 * No SectionHeading (already at limit of 1 eyebrow-style per 3 sections).
 */
export function PrinciplesSection({ dict }: { readonly dict: Dictionary }) {
  return (
    <section aria-labelledby="principles-heading" className="mx-auto w-full max-w-6xl px-6 py-24">
      {/* Hairline divider */}
      <div className="mb-12 h-px w-full bg-border/50" aria-hidden />

      <h2
        id="principles-heading"
        className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl"
      >
        {dict.sections.principles}
      </h2>

      <ol className="mt-12 divide-y divide-border/50">
        {dict.principles.map((principle, index) => (
          <Reveal
            key={principle.title}
            as="li"
            delay={index * 0.05}
            className="grid grid-cols-[3rem_1fr] items-baseline gap-6 py-8 sm:grid-cols-[4rem_1fr]"
          >
            {/* Counter */}
            <span
              className="label-mono text-right tabular-nums text-fg-subtle"
              aria-hidden
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            {/* Content */}
            <div>
              <h3 className="font-display text-xl font-bold tracking-tight text-fg">
                {principle.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
                {principle.body}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
