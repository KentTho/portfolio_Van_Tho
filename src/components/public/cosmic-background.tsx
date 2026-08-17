/**
 * Cosmic engineering backdrop: a soft accent aurora + a masked grid. Pure CSS (no
 * WebGL, no external asset) so it never blocks LCP and degrades cleanly (§L / §M).
 */
export function CosmicBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Restrained ambient aurora — darker canvas overall so the hero portrait
          backlight, not the background, carries the light (Owner V2 direction). */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -12%, color-mix(in oklab, var(--accent) 7%, transparent), transparent 68%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 42% 34% at 86% 8%, color-mix(in oklab, var(--accent-3) 5%, transparent), transparent 60%)",
        }}
      />
      {/* Atmospheric grid — barely-there texture, never a subject. */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 58% 48% at 50% 2%, #000 22%, transparent 92%)",
          WebkitMaskImage: "radial-gradient(ellipse 58% 48% at 50% 2%, #000 22%, transparent 92%)",
        }}
      />
    </div>
  );
}
