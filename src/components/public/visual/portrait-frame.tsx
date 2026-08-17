import Image from "next/image";
import portraitImg from "@/components/public/image/vantho.png";

/**
 * PortraitFrame — the real Owner portrait (vantho.png, 1090×1443) presented
 * frameless on the cosmic canvas (V2): a blue backlight (with a restrained gold
 * undertone) separates the silhouette from the near-black canvas, a radial
 * vignette + bottom fade dissolve the studio backdrop's rectangular edges so the
 * subject reads as *emerging from depth* rather than sitting in a card/box.
 *
 * No hard border, no surface box (recruiter-first cinematic, not a SaaS card).
 * next/image handles responsive sizing + blur placeholder; no distortion.
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

      {/* Portrait — bottom-masked so the figure dissolves into the canvas floor. */}
      <div className="relative">
        <Image
          src={portraitImg}
          alt={alt}
          priority={priority}
          placeholder="blur"
          sizes="(max-width: 640px) 68vw, (max-width: 1024px) 20rem, 24rem"
          className="h-auto w-full select-none object-contain"
          style={{
            WebkitMaskImage: "linear-gradient(to top, transparent 1%, #000 18%)",
            maskImage: "linear-gradient(to top, transparent 1%, #000 18%)",
          }}
        />

        {/* Sink the light studio backdrop toward the canvas at the top + sides. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "radial-gradient(64% 58% at 50% 40%, transparent 40%, var(--canvas) 86%)",
          }}
        />

        {/* Radial vignette — feather the photo's rectangular edges into the canvas
            (opaque canvas by ~84% radius so no rectangular frame remains). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(66% 60% at 50% 40%, transparent 38%, var(--canvas) 84%)",
          }}
        />

        {/* Cool brand tint over the subject to marry skin/shirt to the blue canvas. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--brand-primary) 26%, transparent) 0%, transparent 46%)",
          }}
        />

        {/* Bottom fade — dissolve the floor into --canvas (emerge-from-depth). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: "linear-gradient(to top, var(--canvas) 10%, transparent)" }}
        />
      </div>
    </div>
  );
}
