"use client";

import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import type { SocialLink } from "@/modules/public-portfolio/domain/types";
import { PortraitFrame } from "@/components/public/visual/portrait-frame";
import { Magnetic, PointerTilt } from "@/components/public/motion/interactions";
import { useIntroReady } from "@/components/public/motion/intro-gate";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";
import { GithubMark, LinkedinMark } from "@/components/public/visual/brand-icons";
import { useReplayableReveal } from "@/components/public/motion/use-replayable-reveal";
import { MOTION_DURATION, MOTION_EASING } from "@/styles/motion-tokens";

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
  readonly focusLabel?: string;
  readonly scrollLabel?: string;
  readonly primary: Cta;
  readonly secondary: Cta;
  readonly socials: readonly SocialLink[];
}

function SocialIcon({ kind, size = 18 }: { readonly kind: SocialLink["kind"]; readonly size?: number }) {
  if (kind === "linkedin") return <LinkedinMark size={size} />;
  if (kind === "email") return <Mail size={size} aria-hidden />;
  return <GithubMark size={size} />;
}

/**
 * Ariyana V3 Hero Section — True Spatial Parity Rebuild.
 *
 * Implements Ariyana's monumental visual grammar:
 * 1. Edge-to-edge monumental typography (HÀ VĂN THỌ) layered behind the subject.
 * 2. Full environmental background video (enter_portfolio_micro_workspace_Protocol.mp4)
 *    seamlessly blended into the canvas with soft radial masking — ZERO rectangular borders.
 * 3. Authentic portrait seamlessly integrated in the foreground — NO isolated card.
 * 4. Asymmetric lower editorial anchors (Title Left, Statement + Actions Right).
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

  const { ref: heroRef, hasEntered } = useReplayableReveal("-10% 0px -10% 0px", "30% 0px 30% 0px");

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const isAnimated = !reduced && ready && hasEntered;

  return (
    <section
      ref={heroRef}
      id="home"
      aria-label="Giới thiệu"
      className="relative min-h-[95vh] w-full overflow-hidden flex flex-col justify-between pt-6 pb-16 md:pb-24 lg:pb-28"
    >
      {/* ── 1. ENVIRONMENTAL VIDEO SURFACE (FULL BLEED, MASK BLENDED) ──────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          style={{ y: reduced ? 0 : mediaY, scale: reduced ? 1 : mediaScale }}
          className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[120vw] max-w-[2000px] h-[110%] opacity-45 sm:opacity-55 mix-blend-screen"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="w-full h-full object-cover object-center select-none"
            style={{
              maskImage:
                "radial-gradient(ellipse 75% 65% at 50% 48%, black 30%, rgba(0,0,0,0.5) 65%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 65% at 50% 48%, black 30%, rgba(0,0,0,0.5) 65%, transparent 100%)",
            }}
          >
            <source src="/video/enter_portfolio_micro_workspace_Protocol.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Ambient Cosmic Lights */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 h-[50vw] w-[85vw] rounded-full blur-[150px] opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0, 240, 255, 0.25) 0%, rgba(30, 64, 175, 0.2) 45%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-10 right-1/4 h-[35vw] w-[45vw] rounded-full blur-[140px] opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212, 175, 55, 0.2) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-between relative z-10">
        {/* ── 2. TOP METADATA RIBBON ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: MOTION_DURATION.section, ease: MOTION_EASING.out }}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-4 sm:mb-8"
        >
          <div className="flex items-center gap-3">
            <span className="caption-pill">
              <span className="size-1.5 rounded-full bg-brand-primary animate-pulse" />
              <span>{intro || "SENIOR SOFTWARE ENGINEER"}</span>
            </span>
            <span className="hidden sm:inline-block font-mono text-xs text-fg-subtle tracking-wider uppercase">
              {"//"} ARCHITECTURE · FULL-STACK · CLOUD
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-fg-muted">
              {availability || "Available for high-impact contracts"}
            </span>
          </div>
        </motion.div>

        {/* ── 3. MONUMENTAL IDENTITY & INTEGRATED PORTRAIT CENTER ──────────── */}
        <div className="relative my-auto py-8 sm:py-12 lg:py-16 flex flex-col items-center justify-center">
          {/* Giant Monumental Wordmark (Behind Subject) */}
          <motion.div
            style={{ y: reduced ? 0 : textY }}
            className="w-full text-center select-none pointer-events-none"
          >
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.9, ease: MOTION_EASING.cinematic, delay: 0.1 }}
              className="text-mega font-display text-white/95 uppercase tracking-tighter leading-none"
              style={{
                textShadow:
                  "0 0 80px rgba(0, 240, 255, 0.25), 0 20px 40px rgba(0, 0, 0, 0.8)",
              }}
            >
              {name || "HÀ VĂN THỌ"}
            </motion.h1>
          </motion.div>

          {/* Integrated Portrait Anchor (Organically Blended, NO CARD FRAME) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={isAnimated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.85, ease: MOTION_EASING.cinematic, delay: 0.25 }}
            className="relative -mt-16 sm:-mt-24 md:-mt-32 lg:-mt-40 z-20 pointer-events-auto"
          >
            <PointerTilt max={6}>
              <div className="relative w-48 sm:w-60 md:w-72 lg:w-80 group">
                {/* Backlit Silhouette Halo */}
                <div className="absolute inset-0 -top-4 rounded-full bg-gradient-to-t from-brand-primary/30 via-brand-secondary/20 to-transparent blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Chân dung nguyên bản, không đóng khung hộp chữ nhật */}
                <div className="relative drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] filter">
                  <PortraitFrame alt={`Chân dung ${name}`} priority />
                </div>

                {/* Minimalist Signature Pill below Portrait */}
                <div className="mt-3 flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-canvas/80 px-4 py-1 backdrop-blur-md font-mono text-[11px] tracking-widest text-brand-primary-soft uppercase">
                    <span className="size-1 rounded-full bg-brand-primary" />
                    <span>LEAD FULLSTACK ARCHITECT</span>
                  </span>
                </div>
              </div>
            </PointerTilt>
          </motion.div>
        </div>

        {/* ── 4. LOWER EDITORIAL ANCHORS (ARIYANA ASYMMETRIC 2-COL) ────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end pt-6 border-t border-white/10">
          {/* Bottom Left: Bold Condensed Role & Subtitle (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: MOTION_DURATION.section, ease: MOTION_EASING.out, delay: 0.35 }}
            className="lg:col-span-6 space-y-3"
          >
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-brand-primary-soft uppercase">
              <span>{focusLabel || "01 // DIRECTION"}</span>
              <span className="h-px w-8 bg-brand-primary/40" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight text-fg leading-none">
              {role || "FULL-STACK ENGINEER // SOFTWARE ARCHITECT"}
            </h2>
          </motion.div>

          {/* Bottom Right: Narrative Statement & Actions (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: MOTION_DURATION.section, ease: MOTION_EASING.out, delay: 0.45 }}
            className="lg:col-span-6 space-y-6 lg:pl-6"
          >
            <p className="text-body-l text-fg-muted leading-relaxed max-w-[54ch]">
              {headline ||
                "Xây dựng nền tảng ứng dụng web hiện đại, hệ thống phân tán chịu tải cao và kiến trúc phần mềm type-safe với tiêu chuẩn kiểm thử khắt khe."}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
              {/* CTAs */}
              <div className="flex items-center gap-4">
                <Magnetic>
                  <Link
                    href={primary.href}
                    className="group inline-flex items-center gap-3 rounded-full bg-brand-primary px-8 py-4 text-xs font-mono tracking-widest uppercase text-canvas font-bold transition-all duration-300 hover:bg-brand-primary-soft hover:shadow-[0_0_35px_rgba(0,240,255,0.4)]"
                  >
                    <span>{primary.label}</span>
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Magnetic>

                <Link
                  href={secondary.href}
                  className="group inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/15 bg-white/5 text-xs font-mono tracking-widest uppercase text-fg hover:border-brand-primary-soft hover:bg-white/10 transition-all duration-200"
                >
                  <span>{secondary.label}</span>
                  <ArrowUpRight className="size-3.5 text-fg-subtle group-hover:text-brand-primary-soft transition-colors" />
                </Link>
              </div>

              {/* Social Icon Pills */}
              {socials.length > 0 && (
                <div className="flex items-center gap-2.5">
                  {socials.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target={s.kind === "email" ? undefined : "_blank"}
                      rel={s.kind === "email" ? undefined : "noopener noreferrer"}
                      aria-label={s.label}
                      className="size-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-fg-subtle hover:text-brand-primary-soft hover:border-brand-primary hover:bg-white/10 transition-all duration-200"
                    >
                      <SocialIcon kind={s.kind} size={16} />
                    </a>
                  ))}
                </div>
              )}

              {/* Scroll Label Indicator */}
              {scrollLabel && (
                <div className="hidden xl:flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-fg-muted pl-3 border-l border-white/10">
                  <span className="size-1 rounded-full bg-brand-primary animate-pulse" />
                  <span>{scrollLabel}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
