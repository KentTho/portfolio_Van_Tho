"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Copy, Check, Sparkles } from "lucide-react";
import type { SocialLink } from "@/modules/public-portfolio/domain/types";
import { GithubMark, LinkedinMark } from "@/components/public/visual/brand-icons";
import { Magnetic } from "@/components/public/motion/interactions";
import type { CopyState } from "@/components/public/sections/contact-copy";

gsap.registerPlugin(ScrollTrigger);

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
  readonly email: { readonly address: string; readonly href: string } | null;
  readonly channels: readonly SocialLink[];
  readonly t: ContactCopy;
}

function ChannelIcon({ kind }: { readonly kind: SocialLink["kind"] }) {
  if (kind === "linkedin") return <LinkedinMark size={16} />;
  return <GithubMark size={16} />;
}

/**
 * Ariyana V3 Kinetic CTA Section (§22).
 *
 * Implements Ariyana's signature kinetic CTA mechanic:
 * 1. Two alternating, oversized repeated text rows driven by GSAP ScrollTrigger scrub.
 * 2. Row 1 moves left, Row 2 moves right on scroll down; both reverse smoothly on scroll up.
 * 3. Centered floating magnetic CTA button ("LET'S CONTACT") with copy-email state machine.
 * 4. Verified network chips and direct email action.
 */
export function ContactCtaSection({ email, channels, t }: ContactCtaSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const onCopy = async () => {
    if (!email) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard-unavailable");
      await navigator.clipboard.writeText(email.address);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    timerRef.current = window.setTimeout(() => setCopyState("idle"), 2200);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!container || !row1 || !row2) return;

    // Row 1 shifts left on scroll
    const anim1 = gsap.to(row1, {
      x: "-18%",
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    // Row 2 shifts right on scroll
    const anim2 = gsap.to(row2, {
      x: "18%",
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    return () => {
      anim1.kill();
      anim2.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, []);

  const kineticText = "LET'S CONNECT AND LET'S WORK TOGETHER • CÙNG NHAU XÂY DỰNG • ";

  return (
    <section
      ref={containerRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full border-t border-white/10 pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden bg-canvas"
    >
      {/* ── 1. SECTION CAPTION ────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[1680px] px-6 md:px-12 lg:px-16 mb-12">
        <div className="flex items-center gap-3">
          <span className="caption-pill">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            <span>COLLABORATION // DIRECT INQUIRY</span>
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-xs text-brand-primary-soft uppercase tracking-widest hidden sm:inline-block">
            07 // KINETIC CONVERGENCE
          </span>
        </div>
      </div>

      {/* ── 2. ARIYANA KINETIC TEXT RUNWAYS ───────────────────────────────── */}
      <div className="relative py-12 md:py-20 select-none overflow-hidden">
        {/* Row 1: Solid Condensed Typography (Moving Left on Scroll) */}
        <div
          ref={row1Ref}
          className="flex whitespace-nowrap will-change-transform"
          style={{ transform: "translate3d(0, 0, 0)" }}
        >
          <span className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] uppercase tracking-tighter text-fg/90 pr-8">
            {kineticText.repeat(4)}
          </span>
        </div>

        {/* Row 2: Outlined Stroke Typography (Moving Right on Scroll) */}
        <div
          ref={row2Ref}
          className="flex whitespace-nowrap will-change-transform -mt-2 sm:-mt-6 md:-mt-10"
          style={{ transform: "translate3d(-15%, 0, 0)" }}
        >
          <span
            className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] uppercase tracking-tighter pr-8"
            style={{
              WebkitTextStroke: "1px rgba(255, 255, 255, 0.25)",
              color: "transparent",
            }}
          >
            {kineticText.repeat(4)}
          </span>
        </div>

        {/* Floating Centered Magnetic CTA Pill */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <Magnetic>
            <div className="pointer-events-auto flex items-center gap-4">
              {email && (
                <a
                  href={email.href}
                  className="group flex items-center gap-4 rounded-full bg-brand-primary px-8 py-5 sm:px-12 sm:py-6 text-sm sm:text-base font-mono uppercase tracking-widest text-canvas font-bold shadow-[0_0_50px_rgba(0,240,255,0.5)] transition-all duration-300 hover:scale-105 hover:bg-brand-primary-soft"
                >
                  <span id="contact-heading">{t.emailMe || "LET'S CONTACT"}</span>
                  <div className="size-8 rounded-full bg-canvas text-brand-primary flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <ArrowUpRight className="size-5" />
                  </div>
                </a>
              )}
            </div>
          </Magnetic>
        </div>
      </div>

      {/* ── 3. STRIPED HAIRLINE DIVIDER & VERIFIED CHANNELS BAR ───────────── */}
      <div className="mx-auto w-full max-w-[1680px] px-6 md:px-12 lg:px-16 pt-12">
        {/* Striped Hairline Borders (Ariyana signature detail) */}
        <div className="space-y-1.5 mb-12">
          <div className="h-px w-full bg-white/20" />
          <div className="h-px w-full bg-white/10" />
          <div className="h-px w-full bg-white/5" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-brand-primary-soft uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              <span>DIRECT AVAILABILITY</span>
            </div>
            <p className="text-body text-fg-muted max-w-xl">
              {t.lead ||
                "Tôi sẵn sàng cho các cơ hội kỹ sư phần mềm, tư vấn kiến trúc hệ thống và xây dựng sản phẩm công nghệ cao cấp."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {email && (
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-xs font-mono uppercase tracking-widest text-fg hover:border-brand-primary hover:bg-white/10 transition-colors"
              >
                {copyState === "copied" ? (
                  <>
                    <Check className="size-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 text-brand-primary-soft" />
                    <span>{email.address}</span>
                  </>
                )}
              </button>
            )}

            {channels.map((channel) => (
              <a
                key={channel.href}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={channel.label}
                className="size-11 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-fg hover:border-brand-primary hover:text-brand-primary-soft transition-all"
              >
                <ChannelIcon kind={channel.kind} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
