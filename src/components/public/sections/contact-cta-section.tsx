"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";

/**
 * COSMIC ENGINEERING EDITORIAL — Contact CTA
 *
 * One focal point: a large edge-to-edge banner with a single CTA.
 * Subtle gradient from surface to elevated. No centered card floated on nothing.
 */
export function ContactCtaSection({
  locale,
  dict,
}: {
  readonly locale: Locale;
  readonly dict: Dictionary;
}) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-label={dict.sections.contactCta}
      className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16"
    >
      {/* Hairline divider */}
      <div className="mb-16 h-px w-full bg-border/50" aria-hidden />

      <motion.div
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-elevated px-8 py-16 sm:px-16"
        whileHover={
          reduced
            ? undefined
            : { boxShadow: "var(--glow-soft)" }
        }
        transition={{ duration: 0.3 }}
      >
        {/* Ambient glow — top right */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--accent) 10%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              {dict.sections.contactCta}
            </h2>
            <p className="mt-3 max-w-lg text-base text-fg-muted">
              {dict.contact.subtitle}
            </p>
          </div>

          <Link
            href={`/${locale}/contact`}
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-canvas transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.97]"
          >
            {dict.actions.contactMe}
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
