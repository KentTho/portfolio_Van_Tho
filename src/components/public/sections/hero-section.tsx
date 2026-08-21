"use client";

import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import type { SocialLink } from "@/modules/public-portfolio/domain/types";
import { PortraitFrame } from "@/components/public/visual/portrait-frame";
import { KineticText } from "@/components/public/motion/kinetic-text";
import { Magnetic, PointerTilt } from "@/components/public/motion/interactions";
import { useIntroReady } from "@/components/public/motion/intro-gate";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";
import { GithubMark, LinkedinMark } from "@/components/public/visual/brand-icons";
import { EASE_OUT } from "@/components/public/motion/motion-tokens";
import { useReplayableReveal } from "@/components/public/motion/use-replayable-reveal";
import { cn } from "@/lib/utils";

interface Cta {
  readonly label: string;
  readonly href: string;
}

interface HeroSectionProps {
  readonly name: string;
  readonly role: string;
  readonly headline: string;
  readonly availability: string;
  readonly intro: string;
  readonly focusLabel: string;
  readonly scrollLabel: string;
  readonly primary: Cta;
  readonly secondary: Cta;
  readonly socials: readonly SocialLink[];
}

/** Icon for a social kind. lucide dropped brand marks, so GitHub/LinkedIn are
 *  local SVGs; email uses lucide Mail. `resume` is filtered out before render. */
function SocialIcon({ kind, size = 18 }: { readonly kind: SocialLink["kind"]; readonly size?: number }) {
  if (kind === "linkedin") return <LinkedinMark size={size} />;
  if (kind === "email") return <Mail size={size} aria-hidden />;
  return <GithubMark size={size} />;
}

/** Zone container: children stagger in once the intro stage clears. */
const zone = (delayChildren: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren } },
});
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE_OUT } },
};

/**
 * HERO — #home (V2, corrected). Reference-inspired three-zone cinematic stage:
 * LEFT identity (intro · 2-line name focal · lead · one primary CTA + a light
 * secondary link), CENTER portrait as the vertical anchor (backlit, emerges from
 * the dark, sits high), RIGHT profession (focus · role · availability) tucked
 * close to the portrait's eye-line. Vertical social rail anchors the lower left.
 * Motion: portrait descends while text rises (opposing vectors), released when
 * the intro curtain lifts so the entrance is *seen*, plays once, no loop, and is
 * fully reduced-motion gated. Brand blue accent; gold strictly restrained.
 */
export function HeroSection({
  name,
  role,
  headline,
  availability,
  intro,
  focusLabel,
  scrollLabel,
  primary,
  secondary,
  socials,
}: HeroSectionProps) {
  const reduced = useReducedMotionSafe();
  const ready = useIntroReady();
  
  const { ref: heroRef, hasEntered } = useReplayableReveal(
    "-10% 0px -10% 0px", // Enter threshold
    "30% 0px 30% 0px"  // Exit arm threshold
  );

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Scroll-linked transition: video fades and scales slightly as user scrolls down.
  const videoOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [1, 1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const state = reduced ? false : (ready && hasEntered) ? "visible" : "hidden";

  // Owner-locked name break: "Hà Văn" / "Thọ" — head = all but last word, tail = last word.
  const parts = name.trim().split(/\s+/);
  const nameTail = parts.length > 1 ? parts[parts.length - 1] : "";
  const nameHead = parts.length > 1 ? parts.slice(0, -1).join(" ") : name.trim();

  return (
    <section ref={heroRef} aria-label="Giới thiệu" className="relative w-full overflow-hidden" style={{ perspective: "1200px" }}>
      {!reduced && (
        <motion.div style={{ opacity: videoOpacity, scale: videoScale }} className="pointer-events-none absolute inset-0 -z-20">
          <AmbientVideoField />
        </motion.div>
      )}
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col items-center justify-center gap-8 px-6 pb-24 pt-28 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,auto)_minmax(0,0.78fr)] lg:items-center lg:gap-x-6 lg:pb-0 lg:pt-0" style={{ transformStyle: "preserve-3d" }}>
        {/* ── LEFT — identity ─────────────────────────────────────────────── */}
        <motion.div
          className={cn("order-2 flex w-full max-w-md flex-col items-center text-center lg:order-1 lg:max-w-none lg:items-start lg:pr-2 lg:text-left")}
          variants={reduced ? undefined : zone(0.22)}
          initial={reduced ? false : "hidden"}
          animate={state}
        >
          <motion.span variants={reduced ? undefined : rise} className="label-mono text-brand-primary-soft">
            {intro}
          </motion.span>

          <h1
            aria-label={name}
            className="mt-3 font-display font-bold leading-[0.92] tracking-[-0.03em] text-fg text-[clamp(2.6rem,4.6vw+0.5rem,4.5rem)]"
          >
            <KineticText text={nameHead} as="span" className="block" play={!reduced && ready && hasEntered} delay={0.05} stagger={0.028} />
            {nameTail && (
              <KineticText text={nameTail} as="span" className="block" play={!reduced && ready && hasEntered} delay={0.2} stagger={0.028} />
            )}
          </h1>

          <motion.p variants={reduced ? undefined : rise} className="mt-5 max-w-[40ch] text-body-l text-fg-muted">
            {headline}
          </motion.p>

          <motion.div variants={reduced ? undefined : rise} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
            <Magnetic>
              <Link
                href={primary.href}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-canvas transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                style={{ boxShadow: "var(--glow-primary-soft)" }}
              >
                {primary.label}
                <ArrowUpRight size={16} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
            {/* Secondary is a light text link — must not compete with the primary CTA. */}
            <Link
              href={secondary.href}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg focus-visible:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <span className="relative">
                {secondary.label}
                <span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-primary-soft/60 transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* ── CENTER — portrait (vertical anchor, sits high) ───────────────── */}
        <motion.div
          className={cn("relative order-1 flex items-center justify-center lg:order-2 lg:-translate-y-2")}
          initial={reduced ? false : { opacity: 0, scale: 0.985, y: -34 }}
          animate={reduced ? false : (ready && hasEntered) ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.985, y: -34 }}
          transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.1 }}
        >
          <PointerTilt max={4}>
            <PortraitFrame alt={`Chân dung ${name}`} priority />
          </PointerTilt>
        </motion.div>

        {/* ── RIGHT — profession (tucked near the portrait eye-line) ───────── */}
        <motion.div
          className={cn("order-3 flex w-full max-w-md flex-col items-center text-center lg:max-w-none lg:items-end lg:-translate-y-6 lg:text-right")}
          variants={reduced ? undefined : zone(0.34)}
          initial={reduced ? false : "hidden"}
          animate={state}
        >
          <motion.span variants={reduced ? undefined : rise} className="label-mono text-brand-secondary-soft">
            {focusLabel}
          </motion.span>

          <p className="mt-3 font-display font-semibold leading-[1.02] text-fg text-[clamp(1.75rem,2vw+1rem,2.6rem)]">
            <KineticText text={role} as="span" play={!reduced && ready && hasEntered} delay={0.12} stagger={0.026} duration={0.7} />
          </p>

          <motion.span
            variants={reduced ? undefined : rise}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1.5 label-mono text-fg-muted"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              {!reduced && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            {availability}
          </motion.span>
        </motion.div>
      </div>

      {/* ── Social rail — desktop vertical, lower left ───────────────────── */}
      {socials.length > 0 && (
        <motion.ul
          aria-label="Liên kết mạng xã hội"
          className={cn("pointer-events-none absolute bottom-16 left-6 z-10 hidden flex-col gap-1 lg:flex")}
          variants={reduced ? undefined : zone(0.46)}
          initial={reduced ? false : "hidden"}
          animate={state}
        >
          {socials.map((s) => (
            <motion.li key={s.href} variants={reduced ? undefined : rise} className="pointer-events-auto">
              <a
                href={s.href}
                target={s.kind === "email" ? undefined : "_blank"}
                rel={s.kind === "email" ? undefined : "noopener noreferrer"}
                aria-label={s.label}
                className="group flex h-10 w-10 items-center justify-center rounded-full text-fg-subtle transition-all duration-300 hover:translate-x-1 hover:text-brand-primary-soft focus-visible:text-brand-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <SocialIcon kind={s.kind} />
              </a>
            </motion.li>
          ))}
          <li aria-hidden className="ml-[19px] mt-1 h-14 w-px bg-gradient-to-b from-border-strong to-transparent" />
        </motion.ul>
      )}

      {/* Mobile social row */}
      {socials.length > 0 && (
        <div className="mx-auto -mt-4 flex max-w-6xl items-center justify-center gap-4 px-6 pb-10 lg:hidden">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target={s.kind === "email" ? undefined : "_blank"}
              rel={s.kind === "email" ? undefined : "noopener noreferrer"}
              aria-label={s.label}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-fg-subtle transition-colors hover:text-brand-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <SocialIcon kind={s.kind} />
            </a>
          ))}
        </div>
      )}

      {/* Scroll cue — desktop only, bottom center */}
      <div aria-hidden className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="label-mono text-fg-subtle">{scrollLabel}</span>
        <span className="relative h-9 w-px overflow-hidden bg-border-strong">
          {!reduced && (
            <motion.span
              className="absolute inset-x-0 top-0 h-3 bg-brand-primary-soft"
              animate={{ y: ["-100%", "300%"] }}
              transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
            />
          )}
        </span>
      </div>
    </section>
  );
}

/** 
 * Atmospheric video field that sits at the very back of the Hero scene.
 * Uses a deep radial mask to ensure rectangular edges vanish, combined
 * with screen blend mode and blur to feel like an optical light source.
 */
function AmbientVideoField() {
  return (
    <motion.div 
      aria-hidden 
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2.4, ease: EASE_OUT }}
      style={{ transform: "translateZ(-100px)" }}
    >
      <div 
        className="relative h-[110vh] w-[110vw] max-w-[1400px] opacity-[0.35] mix-blend-screen"
        style={{ 
          maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)"
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="h-full w-full object-cover blur-[1px]"
        >
          <source src="/video/GEMINI_IMAGE_TO_VIDEO.mp4" type="video/mp4" />
        </video>
      </div>
    </motion.div>
  );
}

