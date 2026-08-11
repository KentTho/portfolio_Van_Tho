interface SectionHeadingProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly id?: string;
  /** Optional index number displayed in mono as a counter glyph */
  readonly index?: string;
}

/**
 * COSMIC ENGINEERING EDITORIAL — Section Heading
 *
 * Left-aligned, editorial. Counter glyph (optional) sits as a tiny mono accent
 * to the left of the headline — NOT an eyebrow above it.
 * Max 1 eyebrow-style element per 3 sections (Taste Skill §4.7).
 */
export function SectionHeading({
  title,
  subtitle,
  id,
  index,
}: SectionHeadingProps) {
  return (
    <div className="mb-12">
      <div className="flex items-baseline gap-4">
        {index && (
          <span
            className="label-mono shrink-0 tabular-nums text-fg-subtle"
            aria-hidden
          >
            {index}
          </span>
        )}
        <h2
          id={id}
          className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl"
        >
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-fg-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}
