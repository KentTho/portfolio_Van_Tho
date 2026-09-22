"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, Compass, ShieldCheck, GitBranch, Terminal } from "lucide-react";
import { Reveal } from "@/components/public/reveal";
import type { Dictionary } from "@/i18n/dictionary";

interface JourneySectionProps {
  readonly dict: Dictionary;
}

interface EngineeringProcessStep {
  readonly step: string;
  readonly title: string;
  readonly headline: string;
  readonly description: string;
  readonly deliverable: string;
  readonly icon: typeof Compass;
}

const ENGINEERING_STEPS: readonly EngineeringProcessStep[] = [
  {
    step: "Step 01",
    title: "DISCOVERY & ARCHITECTURE SCOPING",
    headline: "Khảo sát bài toán & Thiết lập ranh giới hệ thống",
    description:
      "Phân tích yêu cầu phi chức năng (throughput, SLA, data retention), xác định ranh giới Clean Architecture, mô hình hóa domain entities và loại bỏ rủi ro kiến trúc trước khi viết mã nguồn.",
    deliverable: "Domain Model & System Boundary Specs",
    icon: Compass,
  },
  {
    step: "Step 02",
    title: "CONTRACT-FIRST & TYPE INTEGRITY",
    headline: "Thiết kế hợp đồng giao tiếp & An toàn kiểu dữ liệu",
    description:
      "Định nghĩa schema cơ sở dữ liệu quan hệ (Drizzle ORM), type contracts giữa presentation và application layer. Đảm bảo 100% type-safe từ database đến giao diện người dùng.",
    deliverable: "Relational Schema & Type-Safe API Contracts",
    icon: GitBranch,
  },
  {
    step: "Step 03",
    title: "CONCURRENCY & DATA INTEGRITY",
    headline: "Hiện thực hóa nghiệp vụ & Kiểm soát tranh chấp đồng thời",
    description:
      "Hiện thực hóa business logic với giao dịch nguyên tử (Atomic Transactions), cơ chế khóa bản ghi SELECT FOR UPDATE chống Race Condition ngân sách và phân quyền bảo mật nhiều lớp.",
    deliverable: "Race-Condition Immune Service Implementations",
    icon: ShieldCheck,
  },
  {
    step: "Step 04",
    title: "MULTI-LAYER VERIFICATION & DELIVERY",
    headline: "Kiểm thử tự động đa tầng & Phát hành liên tục",
    description:
      "Thiết lập ma trận kiểm định nghiêm ngặt: Unit test domain logic, Integration test writeside Neon, và Playwright E2E cho hành trình thực tế. Tự động hóa CI/CD với Vercel zero-downtime.",
    deliverable: "100% Automated Test Matrix & Production Release",
    icon: Terminal,
  },
];

/**
 * Ariyana V3 Section 02 — Engineering Process (§27–28).
 *
 * Semantic Authority: "HOW I ENGINEER / METHODOLOGY"
 * Completely deduplicated from Section 06 (Capabilities / What I Can Deliver).
 *
 * Implements Ariyana's exact step_section mechanics:
 * - Connected timeline axis with step indicators (Step 01 to Step 04)
 * - Oversized step titles with gradient text hover state
 * - Interactive accordion expand/collapse via chevron trigger with smooth height transition
 * - Verified engineering deliverable chips
 */
export function JourneySection({ dict }: JourneySectionProps) {
  void dict;
  // Default first step open, matching Ariyana default active state
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
    3: false,
  });

  const toggleStep = (index: number) => {
    setOpenSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="relative w-full border-t border-white/10 py-24 lg:py-36 overflow-hidden bg-canvas"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-16">
        {/* Section Caption Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="caption-pill">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            <span>METHODOLOGY // PROCESS</span>
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-xs text-brand-primary-soft uppercase tracking-widest hidden sm:inline-block">
            02 // HOW I BUILD
          </span>
        </div>

        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <Reveal direction="up" distance={20}>
              <h2
                id="journey-heading"
                className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-fg leading-tight"
              >
                ASSESS, ARCHITECT, AND OPERATE
              </h2>
            </Reveal>
            <Reveal direction="up" distance={20} delay={0.1}>
              <p className="mt-4 text-body-l text-fg-muted max-w-2xl">
                Quy trình phát triển phần mềm chuẩn mực từ phân tích yêu cầu, thiết kế kiến trúc phân tán đến kiểm thử đa tầng tự động.
              </p>
            </Reveal>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-surface/50 px-4 py-2 font-mono text-xs text-brand-primary-soft uppercase tracking-wider">
            <Sparkles className="size-3.5 text-brand-primary" />
            <span>DISCIPLINED WORKFLOW</span>
          </div>
        </div>

        {/* Steps List with Ariyana Connective Axis & Accordion Toggles */}
        <div className="relative divide-y divide-white/10 border-t border-b border-white/10">
          {ENGINEERING_STEPS.map((step, idx) => {
            const isOpen = Boolean(openSteps[idx]);
            const Icon = step.icon;

            return (
              <div
                key={step.step}
                className="group relative transition-colors duration-300 hover:bg-surface/30"
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  aria-controls={`step-content-${idx}`}
                  onClick={() => toggleStep(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleStep(idx);
                    }
                  }}
                  className="w-full py-8 sm:py-10 flex items-start justify-between gap-6 text-left cursor-pointer select-none"
                >
                  {/* Left: Step Count & Main Titles */}
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 flex-1">
                    <span className="font-mono text-xs uppercase tracking-widest text-brand-primary-soft font-semibold w-24 shrink-0">
                      {step.step}
                    </span>

                    <div className="space-y-1 flex-1">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display uppercase tracking-tight text-fg group-hover:text-brand-primary-soft transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-sm font-mono text-fg-subtle uppercase tracking-wider">
                        {step.headline}
                      </p>
                    </div>
                  </div>

                  {/* Right: Interactive Toggle Icon (Ariyana chevron) */}
                  <div className="shrink-0 flex items-center gap-4 pt-1">
                    <div
                      className={`size-10 sm:size-11 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-fg transition-all duration-300 group-hover:border-brand-primary group-hover:bg-brand-primary/10 ${
                        isOpen ? "rotate-180 border-brand-primary text-brand-primary" : ""
                      }`}
                    >
                      <ChevronDown className="size-5" />
                    </div>
                  </div>
                </div>

                {/* Smooth Animated Height Info Wrap */}
                <div
                  id={`step-content-${idx}`}
                  className={`grid transition-all duration-500 ease-out overflow-hidden ${
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-8" : "grid-rows-[0fr] opacity-0 pb-0"
                  }`}
                >
                  <div className="min-h-0 pl-0 md:pl-36 pr-4 sm:pr-16 space-y-4">
                    <p className="text-body-l text-fg-muted leading-relaxed max-w-3xl">
                      {step.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <span className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
                        KEY DELIVERABLE:
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3.5 py-1 font-mono text-xs text-brand-primary-soft uppercase tracking-wider">
                        <Icon className="size-3.5 text-brand-primary" />
                        <span>{step.deliverable}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
