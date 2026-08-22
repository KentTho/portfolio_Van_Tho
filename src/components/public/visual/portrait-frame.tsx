import Image from "next/image";
import portraitImg from "@/components/public/image/vantho.png";

/**
 * PortraitFrame — the real Owner portrait presented frameless on the cosmic
 * canvas (V2). A precise optical mask (radial vignette + bottom linear fade)
 * completely dissolves the rectangular edges of the studio backdrop so the
 * subject emerges organically from the depth field. Backlight separates the
 * silhouette from the canvas.
 *
 * Server component (pure CSS; pointer depth is layered by the hero via PointerTilt).
 */
export function PortraitFrame({
  alt,
  priority = false,
}: {
  readonly alt: string;
  readonly priority?: boolean;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[18rem] sm:max-w-[21rem] lg:max-w-[27rem]">
      {/* Backlight — focused blue core behind head/torso (the light source of the
          hero), restrained gold undertone below. Dark-on-dark silhouette rim. */}
      <div
        aria-hidden
        className="absolute -inset-x-20 -bottom-12 -top-10 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(46% 42% at 50% 34%, color-mix(in oklab, var(--brand-primary) 52%, transparent), transparent 68%), radial-gradient(40% 30% at 50% 72%, color-mix(in oklab, var(--brand-secondary) 15%, transparent), transparent 74%)",
        }}
      />

      {/* Portrait — precise mask-composite dissolves all 4 edges (radial + linear bottom). */}
      <div className="relative">
        <Image
          src={portraitImg}
          alt={alt}
          priority={priority}
          placeholder="blur"
          sizes="(max-width: 640px) 68vw, (max-width: 1024px) 20rem, 24rem"
          className="h-auto w-full select-none object-contain"
          style={{
            WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 45%, #000 45%, transparent 85%), linear-gradient(to top, transparent 1%, #000 22%)",
            maskImage: "radial-gradient(ellipse 70% 65% at 50% 45%, #000 45%, transparent 85%), linear-gradient(to top, transparent 1%, #000 22%)",
            WebkitMaskComposite: "source-in, intersect",
            maskComposite: "intersect",
          }}
        />

        {/* Cool brand tint over the subject to marry skin/shirt to the blue canvas.
            This is applied with mix-blend-soft-light over the masked area only. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--brand-primary) 26%, transparent) 0%, transparent 46%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 45%, #000 45%, transparent 85%), linear-gradient(to top, transparent 1%, #000 22%)",
            maskImage: "radial-gradient(ellipse 70% 65% at 50% 45%, #000 45%, transparent 85%), linear-gradient(to top, transparent 1%, #000 22%)",
            WebkitMaskComposite: "source-in, intersect",
            maskComposite: "intersect",
          }}
        />
      </div>
    </div>
  );
}
