"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import BlurText from "@/components/ui/blur-text";
import { PortraitFrame } from "@/components/public/visual/portrait-frame";

interface Cta {
  readonly label: string;
  readonly href: string;
}

interface HeroSectionProps {
  readonly name: string;
  readonly role: string;
  readonly headline: string;
  readonly availability: string;
  readonly primary: Cta;
  readonly secondary: Cta;
}

const metaContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const metaItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * HERO — #home. Strongest first impression. Editorial asymmetric split:
 * identity (left ~55%) + real portrait (right, vantho.png) framed on the cosmic
 * canvas with an orbital accent echoing the logo's atom/orbit motif. Motion
 * signature: BlurText name reveal + staggered meta + portrait depth entrance +
 * slow orbital drift (LEVEL 3, strategic area). All motion is reduced-motion gated.
 * Technology data authority is Neon/Admin, so no tech inventory lives here.
 */
export function HeroSection({
  name,
  role,
  headline,
  availability,
  primary,
  secondary,
}: HeroSectionProps) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-label="Giới thiệu"
      className="relative mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col justify-center gap-12 px-6 pb-16 pt-28 lg:flex-row lg:items-center lg:gap-16 lg:pt-0"
    >
      {/* ── Left — identity ─────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-1 flex-col lg:max-w-[55%]"
        variants={reduced ? undefined : metaContainer}
        initial={reduced ? false : "hidden"}
        animate={reduced ? false : "visible"}
      >
        <motion.span
          variants={reduced ? undefined : metaItem}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 label-mono text-fg-muted"
        >
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            {!reduced && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          {availability}
        </motion.span>

        <div className="mt-6">
          {reduced ? (
            <h1 className="text-display text-fg">{name}</h1>
          ) : (
            <BlurText
              text={name}
              animateBy="letters"
              delay={55}
              stepDuration={0.28}
              className="text-display text-fg"
            />
          )}
        </div>

        <motion.p
          variants={reduced ? undefined : metaItem}
          className="mt-4 font-mono text-sm uppercase tracking-[0.16em] text-accent"
        >
          {role}
        </motion.p>

        <motion.p
          variants={reduced ? undefined : metaItem}
          className="mt-5 max-w-[46ch] text-body-l text-fg-muted"
        >
          {headline}
        </motion.p>

        <motion.div
          variants={reduced ? undefined : metaItem}
          className="mt-9 flex flex-wrap gap-3"
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
            className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/50 px-6 py-3 text-sm font-medium text-fg transition-all hover:border-accent/50 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.97]"
          >
            {secondary.label}
            <Mail size={15} aria-hidden />
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Right — portrait + orbital accent ───────────────────────────── */}
      <motion.div
        className="relative flex flex-1 items-center justify-center"
        initial={reduced ? false : { opacity: 0, scale: 0.94, y: 16 }}
        animate={reduced ? false : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        {!reduced && <OrbitalAccent />}
        <PortraitFrame alt={`Chân dung ${name}`} priority />
      </motion.div>
    </section>
  );
}

/** Slow concentric orbital rings (blue + gold) echoing the logo. Decorative;
 *  rendered only when motion is allowed. */
function OrbitalAccent() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
    >
      <motion.div
        className="absolute aspect-square w-[118%] rounded-full border border-brand-primary/15"
        animate={{ rotate: 360 }}
        transition={{ duration: 64, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute aspect-square w-[92%] rounded-full border border-brand-secondary/12"
        animate={{ rotate: -360 }}
        transition={{ duration: 96, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute aspect-square w-[118%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 64, ease: "linear", repeat: Infinity }}
      >
        <span
          className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-brand-primary"
          style={{ boxShadow: "var(--glow-primary-soft)" }}
        />
      </motion.div>
    </div>
  );
}
