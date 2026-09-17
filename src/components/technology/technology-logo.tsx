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
  const color = meta?.color ?? "var(--fg-muted)";

  // The object tag natively attempts to load the SVG. 
  // If the resource returns 404, it renders its children (our geometric placeholder).
  return (
    <div className="flex flex-col items-center gap-2">
      <object
        data={`/technology-logos/${id}.png`}
        type="image/png"
        className="pointer-events-none"
        style={{ width: size, height: size }}
        aria-label={name}
      >
        <div
          className="grid place-items-center rounded-full border border-border/50 bg-surface/10 backdrop-blur-sm"
          style={{
            width: size,
            height: size,
            boxShadow: `inset 0 0 10px 1px color-mix(in oklab, ${color} 10%, transparent)`,
          }}
          role="img"
          aria-label={name}
          title={name}
        >
          <div className="h-1/3 w-1/3 rounded-full opacity-20" style={{ backgroundColor: color }} />
        </div>
      </object>
      {showLabel ? <span className="text-xs text-fg-subtle">{name}</span> : null}
    </div>
  );
}
