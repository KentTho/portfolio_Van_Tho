/** Inner-route header. Renders the page's single <h1> (correct heading order). */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle?: string;
}) {
  return (
    <header className="mb-10">
      <p className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-fg-subtle">
        <span className="h-px w-8 bg-border" aria-hidden />
        {eyebrow}
      </p>
      <h1 className="mt-4 font-display text-4xl italic leading-tight text-fg sm:text-5xl">{title}</h1>
      {subtitle ? <p className="mt-3 max-w-2xl text-fg-muted">{subtitle}</p> : null}
    </header>
  );
}
