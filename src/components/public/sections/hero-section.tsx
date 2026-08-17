"use client";

import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { motion, type Variants } from "motion/react";
import type { SocialLink } from "@/modules/public-portfolio/domain/types";
import { PortraitFrame } from "@/components/public/visual/portrait-frame";
import { KineticText } from "@/components/public/motion/kinetic-text";
import { Magnetic, PointerTilt } from "@/components/public/motion/interactions";
import { useIntroReady } from "@/components/public/motion/intro-gate";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";
import { GithubMark, LinkedinMark } from "@/components/public/visual/brand-icons";
import { EASE_OUT } from "@/components/public/motion/motion-tokens";

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
  visible: { transition: { staggerChildren: 0.07, delayChildren } },
});
const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

/**
 * HERO — #home (V2). Reference-inspired three-zone cinematic composition on the
 * cosmic canvas: LEFT identity (intro + name focal + value line + CTAs), CENTER
 * real portrait (vantho.png) backlit and emerging from the dark, RIGHT profession
 * (focus label + role + availability). A vertical social rail anchors the lower
 * left. Motion: portrait descends while text rises (opposing vectors), released
 * as the intro curtain lifts so the entrance is *seen*, plays once, never loops,
 * and is fully reduced-motion gated. Brand blue is the accent; gold is restrained.
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
  // Non-reduced entrance holds hidden until the stage clears; reduced motion and
  // the SSR/no-JS path render everything in place (no animation dependency).
  const state = reduced ? false : ready ? "visible" : "hidden";

  return (
    <section
      aria-label="Giới thiệu"
      className="relative w-full overflow-hidden"
    >
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col items-center justify-center gap-10 px-6 pb-24 pt-28 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,auto)_minmax(0,0.95fr)] lg:items-center lg:gap-6 lg:pb-0 lg:pt-0">
        {/* ── LEFT — identity ─────────────────────────────────────────────── */}
        <motion.div
          className="order-2 flex w-full max-w-md flex-col items-center text-center lg:order-1 lg:max-w-none lg:items-start lg:text-left"
          variants={reduced ? undefined : zone(0.24)}
          initial={reduced ? false : "hidden"}
          animate={state}
        >
          <motion.span
            variants={reduced ? undefined : rise}
            className="label-mono text-brand-primary-soft"
          >
            {intro}
          </motion.span>

          <h1 className="mt-3 text-display text-fg">
            <KineticText text={name} as="span" play={!reduced && ready} delay={0.06} stagger={0.03} />
          </h1>

          <motion.p
            variants={reduced ? undefined : rise}
            className="mt-5 max-w-[42ch] text-body-l text-fg-muted"
          >
            {headline}
          </motion.p>

          <motion.div
            variants={reduced ? undefined : rise}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Magnetic>
              <Link
                href={primary.href}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-canvas transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                style={{ boxShadow: "var(--glow-primary-soft)" }}
              >
                {primary.label}
                <ArrowUpRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href={secondary.href}
                className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/40 px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-brand-primary-soft/50 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                {secondary.label}
                <Mail size={15} aria-hidden />
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* ── CENTER — portrait ───────────────────────────────────────────── */}
        <motion.div
          className="relative order-1 flex items-end justify-center lg:order-2 lg:h-full"
          initial={reduced ? false : { opacity: 0, scale: 0.985, y: -28 }}
          animate={
            reduced ? false : ready ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.985, y: -28 }
          }
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.12 }}
        >
          {!reduced && <OrbitalAccent />}
          <PointerTilt max={5}>
            <PortraitFrame alt={`Chân dung ${name}`} priority />
          </PointerTilt>
        </motion.div>

        {/* ── RIGHT — profession / capability ─────────────────────────────── */}
        <motion.div
          className="order-3 flex w-full max-w-md flex-col items-center text-center lg:max-w-none lg:items-end lg:text-right"
          variants={reduced ? undefined : zone(0.36)}
          initial={reduced ? false : "hidden"}
          animate={state}
        >
          <motion.span
            variants={reduced ? undefined : rise}
            className="label-mono text-brand-secondary-soft"
          >
            {focusLabel}
          </motion.span>

          <p className="mt-3 text-h1 font-display font-semibold leading-[1.05] text-fg">
            <KineticText
              text={role}
              as="span"
              play={!reduced && ready}
              delay={0.14}
              stagger={0.028}
              duration={0.7}
            />
          </p>

          <motion.span
            variants={reduced ? undefined : rise}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1.5 label-mono text-fg-muted"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              {!reduced && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              )}
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
          className="pointer-events-none absolute bottom-16 left-6 z-10 hidden flex-col gap-1 lg:flex"
          variants={reduced ? undefined : zone(0.5)}
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
        <div className="mx-auto -mt-6 flex max-w-6xl items-center justify-center gap-4 px-6 pb-10 lg:hidden">
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
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
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

/** Slow concentric orbital rings (blue + gold) echoing the logo. Decorative;
 *  rendered only when motion is allowed. Sits behind the portrait. */
function OrbitalAccent() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
    >
      <motion.div
        className="absolute aspect-square w-[112%] rounded-full border border-brand-primary/12"
        animate={{ rotate: 360 }}
        transition={{ duration: 70, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute aspect-square w-[88%] rounded-full border border-brand-secondary/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 104, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute aspect-square w-[112%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 70, ease: "linear", repeat: Infinity }}
      >
        <span
          className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand-primary"
          style={{ boxShadow: "var(--glow-primary-soft)" }}
        />
      </motion.div>
    </div>
  );
}
