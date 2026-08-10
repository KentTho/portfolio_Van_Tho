/**
 * Cosmic engineering backdrop: a soft accent aurora + a masked grid. Pure CSS (no
 * WebGL, no external asset) so it never blocks LCP and degrades cleanly (§L / §M).
 */
export function CosmicBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 85% 10%, color-mix(in oklab, var(--accent-3) 10%, transparent), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 65% 55% at 50% 0%, #000 35%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 0%, #000 35%, transparent 100%)",
        }}
      />
    </div>
  );
}
