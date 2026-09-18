"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";
import { pick, type Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { ProjectSummary } from "@/modules/public-portfolio/domain/types";
import { TechnologyLogo } from "@/components/technology/technology-logo";
import { Reveal } from "@/components/public/reveal";
import { PointerTilt } from "@/components/public/motion/interactions";

function GithubIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface FeaturedProjectsSectionProps {
  readonly projects: readonly ProjectSummary[];
  readonly locale: Locale;
  readonly dict: Dictionary;
  readonly viewAllHref?: string;
}

/**
 * Ariyana V3 Selected Works / Projects Section (§28).
 * Adapts Ariyana's high-impact Selected Works grammar to real portfolio projects (Expense Tracker).
 * Features split layout (Left narrative + Right visual surface), oversized project number, and verified tech tags.
 */
export function FeaturedProjectsSection({
  projects,
  locale,
  dict,
  viewAllHref,
}: FeaturedProjectsSectionProps) {
  return (
    <section
      id="projects"
      aria-labelledby="featured-heading"
      className="relative w-full border-t border-white/10 py-24 lg:py-36 overflow-hidden bg-canvas"
    >
      <div className="mx-auto w-full max-w-[1680px] px-6 md:px-12 lg:px-16">
        {/* Caption Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="caption-pill">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            <span>SELECTED WORKS // ARCHITECTURE</span>
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-xs text-brand-primary-soft uppercase tracking-widest hidden sm:inline-block">
            03 // SHOWCASE
          </span>
        </div>

        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <Reveal direction="up" distance={20}>
              <h2
                id="featured-heading"
                className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-fg"
              >
                {dict.sections?.featured || "FEATURED ENGINEERING WORKS"}
              </h2>
            </Reveal>
            <Reveal direction="up" distance={20} delay={0.1}>
              <p className="mt-3 text-body-l text-fg-muted max-w-2xl">
                {dict.home?.featuredSubtitle ||
                  "Production-grade software systems developed with clean architecture and extreme performance."}
              </p>
            </Reveal>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-surface/50 px-4 py-2 font-mono text-xs text-brand-primary-soft uppercase tracking-wider">
            <Sparkles className="size-3.5 text-brand-primary" />
            <span>LIVE PRODUCTION PROOF</span>
          </div>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/20 bg-surface/20 p-16 text-center">
            <p className="font-mono text-xs text-fg-subtle uppercase tracking-widest mb-2">
              NO PROJECTS PUBLISHED
            </p>
            <p className="text-body text-fg-muted">
              Projects will appear here once published from the repository.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {projects.map((project, index) => (
              <Reveal key={project.slug} direction="up" distance={30} delay={index * 0.1}>
                <AriyanaProjectItem
                  project={project}
                  locale={locale}
                  index={index}
                />
              </Reveal>
            ))}
          </div>
        )}

        {viewAllHref && (
          <div className="mt-16 text-center">
            <Link
              href={viewAllHref}
              className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-8 py-4 text-xs font-mono uppercase tracking-widest text-fg hover:border-brand-primary hover:bg-brand-primary/10 transition-all duration-300"
            >
              <span>{dict.actions?.viewAll || "VIEW ALL ARCHIVED PROJECTS"}</span>
              <ArrowUpRight className="size-4 text-brand-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function AriyanaProjectItem({
  project,
  locale,
  index,
}: {
  readonly project: ProjectSummary;
  readonly locale: Locale;
  readonly index: number;
}) {
  const title = pick(project.title, locale);
  const summary = pick(project.summary, locale);
  const projectNumber = String(index + 1).padStart(2, "0");

  return (
    <div className="group relative rounded-[2.5rem] border border-white/15 bg-surface/40 p-8 sm:p-12 lg:p-16 backdrop-blur-md transition-all duration-500 hover:border-brand-primary/40 hover:shadow-[0_20px_70px_rgba(0,0,0,0.6)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left: Project Metadata & Copy (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-4">
            <span className="font-display text-5xl sm:text-6xl text-brand-primary-soft/80 font-normal">
              {projectNumber}
            </span>
            <div className="h-6 w-px bg-white/15" />
            <span className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
              CASE STUDY // PRODUCTION
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight text-fg leading-none group-hover:text-brand-primary-soft transition-colors duration-300">
            {title}
          </h3>

          <p className="text-body-l text-fg-muted leading-relaxed max-w-[50ch]">
            {summary}
          </p>

          {/* Technology Badges with Real Logos */}
          {project.techIds && project.techIds.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2.5">
              {project.techIds.map((techId) => (
                <div
                  key={techId}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-fg-muted"
                >
                  <TechnologyLogo id={techId} size={14} />
                  <span className="capitalize">{techId}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href={`/${locale}/projects/${project.slug}`}
              className="group/btn inline-flex items-center gap-2.5 rounded-full bg-brand-primary px-7 py-3.5 text-xs font-mono uppercase tracking-widest text-canvas font-bold transition-all duration-300 hover:bg-brand-primary-soft hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
            >
              <span>EXPLORE CASE STUDY</span>
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-fg hover:border-brand-primary hover:text-brand-primary-soft hover:bg-white/5 transition-all duration-200"
              >
                <GithubIcon className="size-4" />
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live Demo"
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-fg hover:border-brand-primary hover:text-brand-primary-soft hover:bg-white/5 transition-all duration-200"
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        </div>

        {/* Right: Visual Showcase Surface (6 Cols) */}
        <div className="lg:col-span-6">
          <PointerTilt max={4}>
            <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden border border-white/15 bg-gradient-to-br from-[#0c1322] via-[#090d16] to-canvas p-8 shadow-2xl group/img flex flex-col justify-between">
              {/* Top Bar of Blueprint Preview */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-brand-primary animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-widest text-brand-primary-soft font-semibold">
                    SYSTEM ARCHITECTURE // PRODUCTION
                  </span>
                </div>
                <span className="font-mono text-xs text-white/40">
                  {project.year ?? 2026}
                </span>
              </div>

              {/* Center Architecture Spec Graphic */}
              <div className="my-auto py-6">
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-md bg-brand-primary/10 border border-brand-primary/30 px-3 py-1 font-mono text-[11px] text-brand-primary-soft">
                    <Sparkles className="size-3" />
                    <span>FULLSTACK & SERVICE LAYER</span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-fg">
                    {title}
                  </h4>
                  <p className="font-mono text-xs text-fg-subtle line-clamp-2">
                    Atomic transaction isolation · Redis caching · 2FA TOTP · Celery worker orchestration
                  </p>
                </div>

                {/* Ambient Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-4 right-8 w-48 h-48 bg-brand-accent/10 rounded-full blur-2xl pointer-events-none" />
              </div>

              {/* Bottom Tech Rail */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
                  NEON POSTGRESQL · FASTAPI · REDIS
                </span>
                <div className="flex items-center gap-1.5 text-brand-primary-soft text-xs font-mono">
                  <span>VERIFIED LIVE</span>
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/img:translate-x-0.5 group-hover/img:-translate-y-0.5" />
                </div>
              </div>

              {/* Glass subtle shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </PointerTilt>
        </div>
      </div>
    </div>
  );
}
