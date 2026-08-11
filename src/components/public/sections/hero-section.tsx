"use client";

import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { TechnologyLogo } from "@/components/technology/technology-logo";
import BlurText from "@/components/ui/blur-text";

interface Cta {
  readonly label: string;
  readonly href: string;
}

interface HeroSectionProps {
  readonly name: string;
  readonly role: string;
  readonly headline: string;
  readonly availability: string;
  readonly techIds: readonly string[];
  readonly primary: Cta;
  readonly secondary: Cta;
}

/** Stagger variants — right-side cluster */
const clusterContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.4 } },
};
const clusterItem: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Left-side meta + CTA stagger */
const metaContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const metaItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * COSMIC ENGINEERING EDITORIAL — Hero
 *
 * Layout: asymmetric split (left text 60% / right tech cluster 40%).
 * Priority: identity → role → value prop → CTAs → tech proof.
 * Motion: BlurText headline + stagger for meta; tech cluster entrance.
 * Accessibility: min-h-[100dvh] for iOS Safari, reduced-motion respected.
 */
export function HeroSection({
  name,
  role,
  headline,
  availability,
  techIds,
  primary,
  secondary,
}: HeroSectionProps) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-label="Introduction"
      className="relative mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col justify-center px-6 pb-20 pt-28 lg:flex-row lg:items-center lg:gap-16 lg:pt-0"
    >
      {/* ── Left column ─────────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-1 flex-col"
        variants={reduced ? undefined : metaContainer}
        initial={reduced ? false : "hidden"}
        animate={reduced ? false : "visible"}
      >
        {/* Availability badge */}
        <motion.span
          variants={reduced ? undefined : metaItem}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-fg-muted"
        >
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-success"
            aria-hidden
          />
          {availability}
        </motion.span>

        {/* Name — BlurText for cinematic entrance */}
        <div className="mt-6">
          {reduced ? (
            <h1 className="text-display font-display font-extrabold tracking-tight text-fg leading-[0.92]">
              {name}
            </h1>
          ) : (
            <BlurText
              text={name}
              animateBy="letters"
              delay={60}
              stepDuration={0.28}
              className="text-display font-display font-extrabold tracking-tight text-fg leading-[0.92]"
            />
          )}
        </div>

        {/* Role — accent */}
        <motion.p
          variants={reduced ? undefined : metaItem}
          className="mt-4 font-mono text-sm uppercase tracking-[0.14em] text-accent"
        >
          {role}
        </motion.p>

        {/* Headline — value prop */}
        <motion.p
          variants={reduced ? undefined : metaItem}
          className="mt-5 max-w-[54ch] text-base leading-[1.75] text-fg-muted sm:text-lg"
        >
          {headline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={reduced ? undefined : metaItem}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link
            href={primary.href}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-canvas transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.97]"
          >
            {primary.label}
            <ArrowRight size={15} aria-hidden />
          </Link>
          <Link
            href={secondary.href}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-6 py-3 text-sm font-medium text-fg transition-all hover:border-accent/40 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.97]"
          >
            {secondary.label}
            <Download size={15} aria-hidden />
          </Link>
        </motion.div>

        {/* Scroll hint — mobile only */}
        <motion.div
          variants={reduced ? undefined : metaItem}
          className="mt-12 hidden items-center gap-2 lg:hidden sm:flex"
          aria-hidden
        >
          <span className="h-px flex-1 bg-border" />
          <span className="label-mono text-fg-subtle">scroll</span>
          <span className="h-px flex-1 bg-border" />
        </motion.div>
      </motion.div>

      {/* ── Right column — tech cluster ──────────────────────────────────── */}
      <motion.div
        className="mt-16 flex flex-1 flex-col items-center justify-center lg:mt-0"
        variants={reduced ? undefined : clusterContainer}
        initial={reduced ? false : "hidden"}
        animate={reduced ? false : "visible"}
        aria-label="Technology expertise"
      >
        {/* Hexagonal orbit layout — two rows with visual offset */}
        <div className="relative">
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--accent) 8%, transparent) 0%, transparent 70%)",
            }}
            aria-hidden
          />

          {/* Row 1 — main strip */}
          <motion.ul
            className="flex flex-wrap justify-center gap-4"
            aria-label="Core technologies"
          >
            {techIds.slice(0, 4).map((id) => (
              <motion.li key={id} variants={reduced ? undefined : clusterItem}>
                <TechnologyLogo id={id} size={52} showLabel />
              </motion.li>
            ))}
          </motion.ul>

          {/* Row 2 — offset secondary */}
          <motion.ul
            className="mt-4 flex flex-wrap justify-center gap-4 px-6"
            aria-label="Additional technologies"
          >
            {techIds.slice(4).map((id) => (
              <motion.li key={id} variants={reduced ? undefined : clusterItem}>
                <TechnologyLogo id={id} size={44} showLabel />
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Engineering / identity caption */}
        <motion.p
          variants={reduced ? undefined : clusterItem}
          className="mt-8 label-mono text-center text-fg-subtle"
          aria-hidden
        >
          Full-Stack · AI/ML · Platform Engineering
        </motion.p>
      </motion.div>

      {/* ── Vertical rule — desktop only ───────────────────────────────── */}
      <div
        className="absolute left-1/2 hidden h-2/3 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border to-transparent lg:block"
        aria-hidden
      />
    </section>
  );
}
