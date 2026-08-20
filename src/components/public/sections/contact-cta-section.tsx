"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail, Copy, Check, AlertCircle } from "lucide-react";
import { motion, type Variants } from "motion/react";
import type { SocialLink } from "@/modules/public-portfolio/domain/types";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";
import { GithubMark, LinkedinMark } from "@/components/public/visual/brand-icons";
import { EASE_OUT } from "@/components/public/motion/motion-tokens";
import { copyAnnounce, type CopyState } from "@/components/public/sections/contact-copy";

interface ContactCopy {
  readonly eyebrow: string;
  readonly headline: string;
  readonly lead: string;
  readonly emailMe: string;
  readonly copyEmail: string;
  readonly copied: string;
  readonly copyError: string;
  readonly copiedAnnounce: string;
  readonly copyErrorAnnounce: string;
  readonly channels: string;
}

interface ContactCtaSectionProps {
  /** Real public email (address + mailto href), or null if none is published. */
  readonly email: { readonly address: string; readonly href: string } | null;
  /** Verified professional channels (GitHub/LinkedIn — never fabricated). */
  readonly channels: readonly SocialLink[];
  readonly t: ContactCopy;
}

function ChannelIcon({ kind }: { readonly kind: SocialLink["kind"] }) {
  if (kind === "linkedin") return <LinkedinMark size={16} />;
  if (kind === "email") return <Mail size={16} aria-hidden />;
  return <GithubMark size={16} />;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: EASE_OUT } },
};

/**
 * CONTACT — #contact (V2). The conversion point: a calm, focused, recruiter-first
 * closing statement with a REAL email as the primary action. Editorial centred
 * composition, large negative space, one dominant accent — no glass card, no
 * decoration competing with the CTA. The copy-email utility is a robust React
 * state machine (idle/copied/error) with clipboard try/catch, a stable-width
 * (grid-stacked) label, timer cleanup, and an aria-live announcement. Verified
 * channels only (no fabricated social platforms). Contact write boundary (form/
 * Turnstile/delivery) stays out of scope (Wave 06A). Reduced-motion → static.
 */
export function ContactCtaSection({ email, channels, t }: ContactCtaSectionProps) {
  const reduced = useReducedMotionSafe();
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const onCopy = async () => {
    if (!email) return;
    if (timerRef.current) window.clearTimeout(timerRef.current); // last click owns the reset
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard-unavailable");
      await navigator.clipboard.writeText(email.address);
      setCopyState("copied");
    } catch {
      setCopyState("error"); // primary mailto CTA still works
    }
    timerRef.current = window.setTimeout(() => setCopyState("idle"), 2200);
  };

  return (
    <section aria-labelledby="contact-heading" className="mx-auto w-full max-w-6xl px-6 py-28 lg:py-36">
      <motion.div
        className="mx-auto flex max-w-2xl flex-col items-center text-center"
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.p variants={reduced ? undefined : rise} className="label-mono text-brand-primary-soft">
          {t.eyebrow}
        </motion.p>
        <motion.h2
          variants={reduced ? undefined : rise}
          id="contact-heading"
          className="mt-4 font-display text-h2 font-semibold tracking-tight text-fg"
        >
          {t.headline}
        </motion.h2>
        <motion.p variants={reduced ? undefined : rise} className="mt-5 max-w-[46ch] text-body-l text-fg-muted">
          {t.lead}
        </motion.p>

        {/* Actions — primary real email, secondary copy utility */}
        <motion.div variants={reduced ? undefined : rise} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          {email && (
            <a
              href={email.href}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-8 text-sm font-semibold text-canvas transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              style={{ boxShadow: "var(--glow-primary-soft)" }}
            >
              <Mail size={16} aria-hidden />
              {t.emailMe}
            </a>
          )}
          {email && (
            <button
              type="button"
              onClick={onCopy}
              className="group relative inline-flex min-h-12 items-center justify-center rounded-full border border-border-strong bg-surface/40 px-6 text-sm font-medium text-fg transition-colors hover:border-brand-primary-soft/50 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.98] motion-reduce:active:scale-100"
            >
              {/* Grid-stacked labels → width = widest state → no width jump */}
              <span className="grid" aria-hidden>
                <span className={`col-start-1 row-start-1 inline-flex items-center gap-2 transition-opacity ${copyState === "idle" ? "opacity-100" : "opacity-0"}`}>
                  <Copy size={15} /> {t.copyEmail}
                </span>
                <span className={`col-start-1 row-start-1 inline-flex items-center gap-2 transition-opacity ${copyState === "copied" ? "opacity-100" : "opacity-0"}`}>
                  <Check size={15} className="text-success" /> {t.copied}
                </span>
                <span className={`col-start-1 row-start-1 inline-flex items-center gap-2 transition-opacity ${copyState === "error" ? "opacity-100" : "opacity-0"}`}>
                  <AlertCircle size={15} className="text-warning" /> {t.copyError}
                </span>
              </span>
              {/* Stable accessible name regardless of visual state */}
              <span className="sr-only">
                {t.copyEmail}
                {email ? `: ${email.address}` : ""}
              </span>
            </button>
          )}
        </motion.div>

        {/* Live region — announces copy result without spamming */}
        <span role="status" aria-live="polite" className="sr-only">
          {copyAnnounce(copyState, t)}
        </span>

        {/* Verified channels — hover INCREASES affordance (never dims) */}
        {channels.length > 0 && (
          <motion.div variants={reduced ? undefined : rise} className="mt-12 flex flex-col items-center gap-3">
            <span className="label-mono text-fg-subtle">{t.channels}</span>
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {channels.map((c) => (
                <li key={c.href}>
                  <a
                    href={c.href}
                    target={c.kind === "email" ? undefined : "_blank"}
                    rel={c.kind === "email" ? undefined : "noopener noreferrer"}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface/40 px-4 text-sm text-fg-muted transition-colors hover:border-brand-primary-soft/50 hover:text-brand-primary-soft focus-visible:text-brand-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ChannelIcon kind={c.kind} />
                    {c.label}
                    {c.kind !== "email" && (
                      <ArrowUpRight
                        size={13}
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
