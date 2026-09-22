"use client";

import { useState } from "react";
import { ArrowUpRight, Sparkles, Layers, Server, Database, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/public/reveal";

export interface CapabilityItem {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly technologies: readonly string[];
  readonly metric: string;
}

const DEFAULT_VERIFIED_CAPABILITIES: readonly CapabilityItem[] = [
  {
    id: "frontend",
    index: "01",
    title: "FRONTEND & INTERFACE CRAFT",
    subtitle: "REACT 19 · NEXT.JS APP ROUTER · TYPESCRIPT",
    description:
      "Phát triển giao diện web tương tác cao, chuẩn SEO, responsive đa thiết bị với tư duy kiến trúc component chặt chẽ, tối ưu hóa Core Web Vitals và nhịp chuyển động 60fps.",
    technologies: ["React 19", "Next.js 16", "TypeScript", "Tailwind CSS", "Motion & GSAP", "Clean Architecture"],
    metric: "100% Type-Safe · WCAG 2.1 AA Compliant",
  },
  {
    id: "backend",
    index: "02",
    title: "BACKEND & DISTRIBUTED SERVICE LAYER",
    subtitle: "FASTAPI · PYTHON · SERVICE LAYER · JWT & 2FA",
    description:
      "Thiết kế RESTful API type-safe, xử lý nghiệp vụ kiểm soát ngân sách đồng thời chống Race Condition bằng SELECT FOR UPDATE, phân quyền 2FA TOTP và điều phối Celery async jobs.",
    technologies: ["FastAPI", "Python", "RESTful API", "JWT & 2FA TOTP", "Celery Workers", "Alembic Migrations"],
    metric: "Atomic Transactions · Race Condition Immune",
  },
  {
    id: "data-systems",
    index: "03",
    title: "DATA ARCHITECTURE & PERSISTENCE",
    subtitle: "NEON POSTGRESQL · DRIZZLE ORM · REDIS CACHING",
    description:
      "Mô hình hóa cơ sở dữ liệu quan hệ, tối ưu hóa truy vấn prefetch triệt tiêu lỗi N+1, thiết lập bộ nhớ đệm Redis và xây dựng mô hình phân tích phân khúc khách hàng tự động.",
    technologies: ["PostgreSQL", "Neon Database", "Drizzle ORM", "Redis Caching", "SQL Analytics", "Database Indexing"],
    metric: "Sub-millisecond Cache · Zero Orphaned Records",
  },
  {
    id: "devsecops",
    index: "04",
    title: "DEVSECOPS & QUALITY ENGINEERING",
    subtitle: "VITEST · PLAYWRIGHT E2E · PYTEST · VERCEL CI/CD",
    description:
      "Xây dựng ma trận kiểm thử tự động đa tầng từ unit test, integration test tới Playwright E2E cho trải nghiệm người dùng thực, container hóa với Docker và triển khai Vercel.",
    technologies: ["Vitest (33 Suites)", "Playwright E2E", "Pytest", "Docker", "GitHub Actions", "Vercel CI/CD"],
    metric: "100% Automated Test Matrix · Zero Downtime",
  },
];

interface CapabilitiesSectionProps {
  readonly capabilities?: readonly CapabilityItem[];
  readonly locale?: string;
}

const ICONS = [Layers, Server, Database, ShieldCheck];

/**
 * Ariyana V3 Section 06 — Expert Solutions / Capabilities (§21–24).
 * Replaces generic cards with Ariyana's signature editorial horizontal rows:
 * - Numeric index (01 to 04)
 * - Oversized condensed display headings
 * - Interactive row expansion on hover with subtle translate
 * - Verified technology tag rails and architectural metrics
 */
export function CapabilitiesSection({
  capabilities = DEFAULT_VERIFIED_CAPABILITIES,
}: CapabilitiesSectionProps) {
  const [activeId, setActiveId] = useState<string>("frontend");

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative w-full border-t border-white/10 py-24 lg:py-36 overflow-hidden bg-canvas"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-16">
        {/* Ariyana Caption Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="caption-pill">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            <span>EXPERT SOLUTIONS // CAPABILITIES</span>
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-xs text-brand-primary-soft uppercase tracking-widest hidden sm:inline-block">
            06 // SOLUTIONS
          </span>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <Reveal direction="up" distance={20}>
              <h2
                id="capabilities-heading"
                className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-fg leading-tight"
              >
                SPECIALIZED ENGINEERING CAPABILITIES
              </h2>
            </Reveal>
            <Reveal direction="up" distance={20} delay={0.1}>
              <p className="mt-4 text-body-l text-fg-muted max-w-2xl">
                Năng lực kỹ thuật được chứng thực qua hệ thống thực tế: từ giao diện người dùng chính xác đến cơ sở dữ liệu phân tán bền vững.
              </p>
            </Reveal>
          </div>

          <div className="hidden lg:flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-primary-soft bg-surface/60 border border-white/10 px-4 py-2 rounded-full">
            <Sparkles className="size-3.5" />
            <span>AUTHENTIC RESUME COMPETENCIES</span>
          </div>
        </div>

        {/* Ariyana Editorial Rows (List / Accordion Hybrid) */}
        <div className="border-t border-white/10 divide-y divide-white/10">
          {capabilities.map((item, idx) => {
            const Icon = ICONS[idx % ICONS.length] ?? Layers;
            const isActive = activeId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveId(item.id)}
                onClick={() => setActiveId(item.id)}
                className={`group transition-all duration-300 py-10 lg:py-14 px-4 sm:px-8 cursor-pointer rounded-2xl ${
                  isActive
                    ? "bg-surface/50 border-l-4 border-l-brand-primary shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                    : "hover:bg-surface/20"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Index + Title (5 cols) */}
                  <div className="lg:col-span-5 flex items-start gap-6">
                    <span className="font-display text-4xl sm:text-5xl text-brand-primary-soft/70 font-normal select-none">
                      {item.index}
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-brand-primary" />
                        <span className="font-mono text-[11px] uppercase tracking-widest text-brand-primary-soft font-semibold">
                          {item.subtitle}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display uppercase tracking-tight text-fg transition-transform duration-300 group-hover:translate-x-1">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description (4 cols) */}
                  <div className="lg:col-span-4">
                    <p className="text-body text-fg-muted leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 font-mono text-xs text-brand-primary-soft font-medium">
                      <span className="size-1.5 rounded-full bg-brand-primary" />
                      <span>{item.metric}</span>
                    </div>
                  </div>

                  {/* Tech Tags + Action (3 cols) */}
                  <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-between gap-4">
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      {item.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-fg-subtle"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-fg-subtle group-hover:text-brand-primary-soft transition-colors">
                      <span className="uppercase tracking-widest">DETAILS</span>
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
