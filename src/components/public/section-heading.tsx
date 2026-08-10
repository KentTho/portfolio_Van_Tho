interface SectionHeadingProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly id?: string;
}

/** Shared editorial section heading (eyebrow rule + display-serif title). */
export function SectionHeading({ eyebrow, title, subtitle, id }: SectionHeadingProps) {
  return (
    <div className="mb-10">
      <p className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-fg-subtle">
        <span className="h-px w-8 bg-border" aria-hidden />
        {eyebrow}
      </p>
      <h2 id={id} className="mt-4 font-display text-3xl italic leading-tight text-fg sm:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-3 max-w-2xl text-fg-muted">{subtitle}</p> : null}
    </div>
  );
}
