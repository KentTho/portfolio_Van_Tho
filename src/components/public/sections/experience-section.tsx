"use client";

import { useId, useRef, useState } from "react";
import { motion, type Variants } from "motion/react";
import { pick, type Locale } from "@/shared/i18n";
import type { EducationItem, ExperienceItem } from "@/modules/public-portfolio/domain/types";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";
import { EASE_OUT } from "@/components/public/motion/motion-tokens";
import { careerTabKeys, formatPeriod, type CareerTabKey } from "@/components/public/sections/career-tabs";

interface CareerCopy {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly tabExperience: string;
  readonly tabEducation: string;
  readonly present: string;
}

interface CareerSectionProps {
  readonly experience: readonly ExperienceItem[];
  readonly education: readonly EducationItem[];
  readonly locale: Locale;
  readonly t: CareerCopy;
}

/** A dataset normalised to the shared timeline grammar (chronological milestones). */
interface Milestone {
  readonly id: string;
  readonly period: string;
  readonly title: string;
  readonly subtitle: string;
  readonly detail: readonly string[];
  readonly isCurrent: boolean;
}

/**
 * CAREER — #career (V2). Recruiter-first verified chronology on the cosmic canvas:
 * a central timeline axis with milestone nodes, strong year metadata, and Syne
 * institution/role authority. State machine:
 *   • only Education present  → render the Education timeline (no useless empty tab);
 *   • Experience + Education  → a real tablist [Experience | Education] with a
 *     crossfade+y panel transition and NO height jump (both panels grid-stacked).
 * The same component upgrades automatically when verified Experience is authored —
 * no rewrite. Motion is restrained (line-draw + milestone stagger, once) and fully
 * reduced-motion gated. Live Neon data only; nothing is fabricated.
 */
export function ExperienceSection({ experience, education, locale, t }: CareerSectionProps) {
  const reduced = useReducedMotionSafe();
  const baseId = useId();

  const experienceMilestones: Milestone[] = experience.map((e) => ({
    id: e.id,
    period: e.period,
    title: pick(e.role, locale),
    subtitle: pick(e.org, locale),
    detail: e.highlights.map((h) => pick(h, locale)),
    isCurrent: false,
  }));
  const educationMilestones: Milestone[] = education.map((e) => ({
    id: e.id,
    period: formatPeriod(e.startYear, e.endYear, e.isCurrent, t.present),
    title: e.institution,
    subtitle: e.field,
    detail: [],
    isCurrent: e.isCurrent,
  }));

  const byKey: Record<CareerTabKey, { label: string; items: Milestone[] }> = {
    experience: { label: t.tabExperience, items: experienceMilestones },
    education: { label: t.tabEducation, items: educationMilestones },
  };
  const keys = careerTabKeys(experienceMilestones.length > 0, educationMilestones.length > 0);
  const tabs = keys.map((key) => ({ key, ...byKey[key] }));

  // Experience-ready default: prefer Experience when both datasets exist.
  const [active, setActive] = useState<CareerTabKey>(keys[0] ?? "education");
  const hasTabs = tabs.length > 1;
  const tablistRef = useRef<HTMLDivElement>(null);

  if (tabs.length === 0) return null; // no verified rows at all (education exists in practice)

  // Roving keyboard nav across the tablist.
  const onTabKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const i = tabs.findIndex((x) => x.key === active);
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : e.key === "ArrowRight" ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
    const key = tabs[next]!.key;
    setActive(key);
    tablistRef.current?.querySelector<HTMLButtonElement>(`#${baseId}-tab-${key}`)?.focus();
  };

  return (
    <section aria-labelledby="career-heading" className="mx-auto w-full max-w-6xl px-6 py-28 lg:py-32">
      {/* Header — stays stationary while the panel content changes. */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="label-mono text-brand-primary-soft">{t.eyebrow}</p>
        <h2 id="career-heading" className="mt-3 font-display text-h2 font-semibold tracking-tight text-fg">
          {t.title}
        </h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-body text-fg-muted">{t.lead}</p>
      </div>

      {/* Tablist — only when BOTH datasets exist. */}
      {hasTabs && (
        <div
          ref={tablistRef}
          role="tablist"
          aria-label={t.title}
          onKeyDown={onTabKeyDown}
          className="mx-auto mt-10 flex w-fit items-center gap-1 rounded-full border border-border bg-surface/40 p-1"
        >
          {tabs.map((tab) => {
            const selected = tab.key === active;
            return (
              <button
                key={tab.key}
                id={`${baseId}-tab-${tab.key}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${tab.key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.key)}
                className={`relative min-h-11 rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
                  selected ? "text-canvas" : "text-fg-muted hover:text-fg"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId={`${baseId}-tabpill`}
                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                    style={{ boxShadow: "var(--glow-primary-soft)" }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    aria-hidden
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Panels — grid-stacked so the section height never jumps between datasets. */}
      <div className="mt-14 grid">
        {tabs.map((tab) => {
          const selected = tab.key === active;
          const visible = hasTabs ? selected : true;
          return (
            <div
              key={tab.key}
              id={`${baseId}-panel-${tab.key}`}
              role={hasTabs ? "tabpanel" : undefined}
              aria-labelledby={hasTabs ? `${baseId}-tab-${tab.key}` : undefined}
              aria-hidden={hasTabs && !selected ? true : undefined}
              inert={hasTabs && !selected ? true : undefined}
              className="col-start-1 row-start-1"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: reduced ? undefined : "opacity 520ms cubic-bezier(0.22,1,0.36,1), transform 520ms cubic-bezier(0.22,1,0.36,1)",
                pointerEvents: visible ? undefined : "none",
              }}
            >
              <Timeline items={tab.items} reduced={reduced} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Central-axis timeline: alternating editorial entries on desktop, a clean
 *  left-rail single column on mobile. Line draws once on entry; nodes stagger. */
function Timeline({
  items,
  reduced,
}: {
  readonly items: readonly Milestone[];
  readonly reduced: boolean;
}) {
  const list: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };
  const node: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE_OUT } },
  };

  return (
    <motion.ol
      className="relative mx-auto max-w-3xl lg:max-w-4xl"
      variants={reduced ? undefined : list}
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* Axis — left rail on mobile, centred on desktop. Draws top→down once. */}
      <motion.span
        aria-hidden
        className="absolute left-[9px] top-1 h-[calc(100%-0.5rem)] w-px bg-gradient-to-b from-border-strong via-border-strong to-transparent lg:left-1/2 lg:-translate-x-1/2"
        style={{ transformOrigin: "top" }}
        initial={reduced ? false : { scaleY: 0 }}
        whileInView={reduced ? undefined : { scaleY: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
      />

      {items.map((it, i) => {
        const rightSide = i % 2 === 1; // desktop alternation
        return (
          <motion.li
            key={it.id}
            variants={reduced ? undefined : node}
            className="relative pb-12 pl-10 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-x-20 lg:pl-0"
          >
            {/* Node marker on the axis */}
            <span
              aria-hidden
              className="absolute left-[9px] top-1.5 z-10 -translate-x-1/2 lg:left-1/2"
            >
              <span className="block h-3 w-3 rounded-full border border-brand-primary-soft bg-canvas">
                <span
                  className="block h-full w-full scale-[0.45] rounded-full bg-brand-primary-soft"
                  style={{ boxShadow: it.isCurrent ? "var(--glow-primary-strong)" : "var(--glow-primary-soft)" }}
                />
              </span>
            </span>

            {/* Content — alternates sides on desktop, right of the rail on mobile */}
            <div
              className={
                rightSide
                  ? "lg:col-start-2 lg:pl-10 lg:text-left"
                  : "lg:col-start-1 lg:pr-10 lg:text-right"
              }
            >
              <p className="label-mono text-brand-secondary-soft">{it.period}</p>
              <h3 className="mt-2 font-display text-h3 font-semibold text-fg">{it.title}</h3>
              {it.subtitle && <p className="mt-1 text-body text-fg-muted">{it.subtitle}</p>}
              {it.detail.length > 0 && (
                <ul className={`mt-3 space-y-1.5 text-body-s text-fg-muted ${rightSide ? "lg:pl-0" : "lg:list-none"}`}>
                  {it.detail.map((d, di) => (
                    <li key={di} className="leading-relaxed">
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
