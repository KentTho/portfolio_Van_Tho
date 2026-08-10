import { getTechnology, isTechId } from "@/config/technology-catalog";

interface TechnologyLogoProps {
  readonly id: string;
  /** Tile size in pixels. */
  readonly size?: number;
  readonly showLabel?: boolean;
}

/**
 * Accessible branded technology tile. Preserves a consistent square footprint and
 * exposes a screen-reader label. Unknown ids degrade to a neutral tile rather than
 * breaking the layout. (Server component — no client JS.)
 */
export function TechnologyLogo({ id, size = 44, showLabel = false }: TechnologyLogoProps) {
  const known = isTechId(id);
  const meta = known ? getTechnology(id) : null;
  const name = meta?.name ?? id;
  const short = meta?.short ?? id.slice(0, 2).toUpperCase();
  const color = meta?.color ?? "var(--fg-muted)";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="grid place-items-center rounded-xl border border-border bg-elevated font-mono font-semibold"
        style={{
          width: size,
          height: size,
          color,
          boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${color} 22%, transparent), 0 0 18px color-mix(in oklab, ${color} 14%, transparent)`,
          fontSize: Math.round(size * 0.32),
        }}
        role="img"
        aria-label={name}
        title={name}
      >
        <span aria-hidden>{short}</span>
      </div>
      {showLabel ? <span className="text-xs text-fg-subtle">{name}</span> : null}
    </div>
  );
}
