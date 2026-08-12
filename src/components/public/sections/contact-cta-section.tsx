"use client";

import { ArrowUpRight, Mail, Link as LinkGlyph } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Dictionary } from "@/i18n/dictionary";
import type { Profile } from "@/modules/public-portfolio/domain/types";

/**
 * SINGLE LANDING — Contact
 *
 * One focal banner exposing REAL contact methods from the profile (email + social
 * links). The contact write boundary (form + Turnstile + delivery) is Wave 06A;
 * until it is verified we never render a form that claims a message was sent.
 * (lucide-react v1 removed brand marks; the social's own label carries the platform.)
 */
export function ContactCtaSection({
  profile,
  dict,
}: {
  readonly profile: Profile;
  readonly dict: Dictionary;
}) {
  const reduced = useReducedMotion();
  const email = profile.socials.find((s) => s.kind === "email");
  const others = profile.socials.filter((s) => s.kind !== "email");

  return (
    <section
      aria-labelledby="contact-heading"
      className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16"
    >
      <div className="mb-16 h-px w-full bg-border/50" aria-hidden />

      <motion.div
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-elevated px-8 py-16 sm:px-16"
        whileHover={reduced ? undefined : { boxShadow: "var(--glow-soft)" }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--accent) 10%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2
              id="contact-heading"
              className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl"
            >
              {dict.sections.contactCta}
            </h2>
            <p className="mt-3 max-w-lg text-base text-fg-muted">{dict.contact.subtitle}</p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            {email && (
              <a
                href={email.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-canvas transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.97]"
              >
                <Mail size={15} aria-hidden />
                {dict.actions.contactMe}
              </a>
            )}
            {others.length > 0 && (
              <ul className="flex flex-wrap items-center gap-2">
                {others.map((social) => (
                  <li key={social.kind}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-4 py-2.5 text-sm text-fg transition-colors hover:border-accent/40 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                    >
                      <LinkGlyph size={14} aria-hidden />
                      {social.label}
                      <ArrowUpRight size={12} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
