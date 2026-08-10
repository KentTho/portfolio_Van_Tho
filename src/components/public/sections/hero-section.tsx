"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { TechnologyLogo } from "@/components/technology/technology-logo";

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

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/** Home hero: one high-impact entrance; CTAs are visible without waiting (§L). */
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
  const motionProps = reduced
    ? {}
    : ({ variants: container, initial: "hidden", animate: "visible" } as const);
  const childProps = reduced ? {} : ({ variants: item } as const);

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
      <motion.div {...motionProps}>
        <motion.p
          {...childProps}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs text-fg-muted"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden />
          {availability}
        </motion.p>

        <motion.h1
          {...childProps}
          className="mt-6 font-display text-5xl italic leading-[0.95] tracking-tight text-fg sm:text-7xl"
        >
          {name}
        </motion.h1>

        <motion.p {...childProps} className="mt-4 text-lg text-accent sm:text-xl">
          {role}
        </motion.p>

        <motion.p {...childProps} className="mt-5 max-w-2xl text-base leading-8 text-fg-muted">
          {headline}
        </motion.p>

        <motion.div {...childProps} className="mt-8 flex flex-wrap gap-3">
          <Link
            href={primary.href}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-canvas transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            {primary.label}
            <ArrowRight size={16} aria-hidden />
          </Link>
          <Link
            href={secondary.href}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-6 py-3 text-sm font-medium text-fg transition hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            {secondary.label}
            <FileText size={16} aria-hidden />
          </Link>
        </motion.div>

        <motion.ul {...childProps} className="mt-12 flex flex-wrap gap-3">
          {techIds.map((id) => (
            <li key={id}>
              <TechnologyLogo id={id} size={40} />
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
