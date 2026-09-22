"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, GraduationCap, Server, Layers, Cpu } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionary";

gsap.registerPlugin(ScrollTrigger);

interface Milestone {
  readonly year: string;
  readonly badge: string;
  readonly badgeColor: string;
  readonly title: string;
  readonly description: string;
  readonly icon: typeof Server;
  readonly tags: readonly string[];
}

interface HorizontalTimelineSectionProps {
  readonly dict: Dictionary;
}

const MILESTONES: readonly Milestone[] = [
  {
    year: "2022-",
    badge: "FOUNDATION",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    title: "SOFTWARE ENGINEERING AT NTTU",
    description:
      "Chương trình Cử nhân Kỹ thuật Phần mềm tại Đại học Nguyễn Tất Thành. Xây dựng nền tảng vững chắc về cấu trúc dữ liệu, giải thuật, cơ sở dữ liệu quan hệ và kiến trúc hướng đối tượng.",
    icon: GraduationCap,
    tags: ["Software Engineering", "Algorithms", "Database Systems", "OOP"],
  },
  {
    year: "2024-",
    badge: "FULL-STACK",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
    title: "TYPE-SAFE WEB ARCHITECTURES",
    description:
      "Chuyển dịch sang kiến trúc full-stack hiện đại với React, Next.js App Router, TypeScript và FastAPI. Thiết lập các ranh giới Clean Architecture rõ ràng giữa domain và presentation.",
    icon: Layers,
    tags: ["React", "Next.js", "TypeScript", "FastAPI", "Tailwind CSS"],
  },
  {
    year: "2025-",
    badge: "DISTRIBUTED",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    title: "BACKGROUND JOBS & PERSISTENCE",
    description:
      "Tối ưu hóa khả năng chịu tải và tính nhất quán với Redis caching, Celery distributed tasks, Neon PostgreSQL và cơ chế xử lý tranh chấp giao dịch ở tầng cơ sở dữ liệu.",
    icon: Server,
    tags: ["Redis Caching", "Celery Workers", "PostgreSQL", "Drizzle ORM", "Auth 2FA"],
  },
  {
    year: "2026-",
    badge: "PRODUCTION",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    title: "EVIDENCE PLATFORM & DEVSECOPS",
    description:
      "Hiện thực hóa nền tảng minh chứng năng lực kỹ thuật độc lập: Next.js 16 modular monolith, 33 suite kiểm thử tự động, Playwright E2E và triển khai zero-downtime trên Vercel.",
    icon: Cpu,
    tags: ["Next.js 16", "Clean Architecture", "Vitest", "Playwright E2E", "Vercel CI/CD"],
  },
];

/**
 * Ariyana V3 Horizontal Timeline / Milestones Experience (§14).
 *
 * Implements Ariyana Section 04 signature mechanic:
 * 1. Pinned horizontal scroll scrubbing via GSAP ScrollTrigger.
 * 2. Oversized condensed year numerals (2020-, 2021-) with angled badges.
 * 3. Bidirectional responsiveness: progresses on scroll down, reverses on scroll up.
 * 4. Graceful vertical stack fallback on mobile (< 768px).
 */
export function HorizontalTimelineSection({ dict }: HorizontalTimelineSectionProps) {
  void dict;
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Only pin on desktop/tablet where horizontal scroll is ergonomic
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const getScrollDistance = () => track.scrollWidth - window.innerWidth + 120;

      const anim = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        anim.kill();
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === container) st.kill();
        });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="timeline"
      aria-label="Tiến trình phát triển kỹ thuật"
      className="relative w-full bg-canvas border-t border-white/10 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-16 pt-20 pb-8">
        {/* Caption Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="caption-pill">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            <span>EVOLUTION // MILESTONES</span>
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-xs text-brand-primary-soft uppercase tracking-widest">
            03 // MILESTONES
          </span>
        </div>

        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-fg leading-tight">
            ENGINEERING EVOLUTION
          </h2>
          <p className="mt-3 text-body-l text-fg-muted">
            Quá trình tích lũy chiều sâu công nghệ, kỷ luật kỹ thuật và tư duy kiến trúc hệ thống qua từng giai đoạn.
          </p>
        </div>
      </div>

      {/* Horizontal Track Container */}
      <div className="w-full overflow-hidden pb-20 md:pb-28">
        <div
          ref={trackRef}
          className="flex flex-col md:flex-row gap-8 md:gap-16 px-6 md:px-16 w-full md:w-max items-stretch"
        >
          {MILESTONES.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.year}
                className="w-full md:w-[460px] lg:w-[520px] shrink-0 flex flex-col justify-between rounded-[2rem] border border-white/15 bg-surface/50 p-8 md:p-10 backdrop-blur-md group hover:border-brand-primary/50 transition-colors duration-300"
              >
                <div>
                  {/* Big Year with Angled Ariyana Badge */}
                  <div className="relative inline-block mb-8">
                    <span className="text-6xl sm:text-7xl md:text-8xl font-display text-fg tracking-tight select-none">
                      {item.year}
                    </span>
                    <span
                      className={`absolute -top-3 right-0 translate-x-4 -rotate-6 rounded-md border px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <div className="h-px w-full bg-white/10 mb-6" />

                  {/* Title & Description */}
                  <div className="flex items-center gap-3 text-brand-primary-soft mb-2">
                    <Icon className="size-5" />
                    <span className="font-mono text-xs uppercase tracking-widest">
                      PHASE 0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-fg mb-4 group-hover:text-brand-primary-soft transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-body text-fg-muted leading-relaxed mb-8">
                    {item.description}
                  </p>
                </div>

                {/* Tech Chips */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-fg-subtle"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ArrowUpRight className="size-4 text-brand-primary-soft opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
