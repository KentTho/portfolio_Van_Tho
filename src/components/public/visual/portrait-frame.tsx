import Image from "next/image";
import portraitImg from "@/components/public/image/vantho.png";

/**
 * PortraitFrame — the real Owner portrait (vantho.png, 1090×1443) presented as an
 * editorial framed asset on the cosmic canvas: brand glow behind, hairline gold
 * inner edge, and a bottom fade that dissolves the studio floor into --canvas
 * (the "emerge from depth" technique). next/image handles responsive sizing +
 * blur placeholder; no heavy filtering, no distortion. Server component.
 */
export function PortraitFrame({
  alt,
  priority = false,
}: {
  readonly alt: string;
  readonly priority?: boolean;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-[22rem] lg:max-w-[25rem]">
      {/* Atmospheric brand glow behind the portrait */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[2.5rem] blur-3xl"
        style={{
          background:
            "radial-gradient(58% 58% at 52% 30%, color-mix(in oklab, var(--brand-primary) 24%, transparent), transparent 72%)",
        }}
      />
      <div
        className="relative overflow-hidden rounded-[1.75rem] border border-border-strong bg-surface"
        style={{
          boxShadow:
            "var(--glow-primary-soft), inset 0 1px 0 color-mix(in oklab, var(--brand-primary-soft) 18%, transparent)",
        }}
      >
        <Image
          src={portraitImg}
          alt={alt}
          priority={priority}
          placeholder="blur"
          sizes="(max-width: 640px) 76vw, (max-width: 1024px) 22rem, 25rem"
          className="h-auto w-full select-none object-cover"
        />
        {/* Cool brand tint to harmonise the light studio backdrop with the canvas */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--brand-primary) 10%, transparent) 0%, transparent 35%)",
          }}
        />
        {/* Bottom fade — dissolve the floor into the canvas */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
          style={{ background: "linear-gradient(to top, var(--canvas) 4%, transparent)" }}
        />
        {/* Restrained gold hairline edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[1.75rem]"
          style={{
            boxShadow:
              "inset 0 0 0 1px color-mix(in oklab, var(--brand-secondary) 16%, transparent)",
          }}
        />
      </div>
    </div>
  );
}
