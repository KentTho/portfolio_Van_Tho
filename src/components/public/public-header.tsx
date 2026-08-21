"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, UserRound, FolderKanban, Briefcase, Code2, Mail, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Locale } from "@/shared/i18n";
import { LanguageSwitcher } from "@/components/public/language-switcher";
import { useReducedMotionSafe } from "@/components/public/motion/use-reduced-motion-safe";

export interface NavItem {
  readonly href: string;
  readonly label: string;
}

interface PublicHeaderProps {
  readonly locale: Locale;
  readonly brand: string;
  readonly items: readonly NavItem[];
  readonly switchLanguageLabel: string;
  readonly openLabel: string;
  readonly closeLabel: string;
}

/** Section id → semantic icon (adapted, not copied, from Menu-Update). */
const SECTION_ICON: Record<string, LucideIcon> = {
  about: UserRound,
  projects: FolderKanban,
  career: Briefcase,
  skills: Code2,
  contact: Mail,
};
const idOf = (href: string) => href.split("#")[1] ?? "";

/**
 * COSMIC ENGINEERING EDITORIAL — Public Header (V2 global nav).
 *
 * Precision-instrument navigation adapted from Menu-Update: each section is a
 * compact icon capsule that expands to [icon + label] when it is the ACTIVE
 * section (always) or on hover/focus (temporary). Brand = Home (subtle active
 * treatment at the top). Layout-stable — the label expands via a grid-column
 * transition inside the capsule (no header CLS, brand/locale never jump). One
 * IntersectionObserver drives the active section across all six blocks (no
 * dead-zone; Contact stays active through the footer). Mobile keeps an explicit
 * icon + full-label drawer (no icon-only mystery menu). Reduced-motion safe.
 */
export function PublicHeader({
  locale,
  brand,
  items,
  switchLanguageLabel,
  openLabel,
  closeLabel,
}: PublicHeaderProps) {
  const pathname = usePathname();
  const isLanding = pathname === `/${locale}`;
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const reduced = useReducedMotionSafe();

  // Scroll-spy: one observer, all six blocks. Only on the landing page.
  useEffect(() => {
    if (!isLanding) return;
    const targets = items
      .map((item) => idOf(item.href))
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.5, 1] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [isLanding, items]);

  const isActive = (href: string) => isLanding && idOf(href) === activeId && activeId !== "";
  // At the top / Hero (no section active) the brand carries the Home orientation.
  const atHome = isLanding && activeId === "";

  return (
    <header className="sticky top-0 z-50 pointer-events-none w-full transition-all duration-300">
      {/* 
        Header shell is completely transparent to avoid a full-width colored bar seam.
        pointer-events-none allows clicks to pass through to the active scene below,
        while pointer-events-auto on the inner container restores interactivity for nav items.
      */}
      <div className="pointer-events-auto mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between px-6">
        {/* Brand = Home */}
        <Link
          href={`/${locale}`}
          aria-current={atHome ? "page" : undefined}
          className="group font-display text-base font-bold tracking-tight text-fg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          {brand}
          <span
            className={`ml-[3px] transition-all duration-300 ${atHome ? "text-brand-primary-soft" : "text-accent"}`}
            style={atHome ? { textShadow: "var(--glow-primary-soft)" } : undefined}
            aria-hidden
          >
            .
          </span>
        </Link>

        {/* Desktop nav — compact/expanded capsules */}
        <nav aria-label="Primary" className="hidden items-center gap-1.5 md:flex">
          {items.map((item) => {
            const active = isActive(item.href);
            const Icon = SECTION_ICON[idOf(item.href)] ?? UserRound;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "location" : undefined}
                className={`group relative flex h-9 items-center rounded-full border px-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
                  active
                    ? "border-brand-primary-soft/40 bg-brand-primary/10 text-brand-primary-soft"
                    : "border-transparent text-fg-muted hover:border-border-strong/60 hover:bg-surface/50 hover:text-fg focus-visible:text-fg"
                }`}
                style={active ? { boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--brand-secondary) 12%, transparent)" } : undefined}
              >
                <Icon size={18} aria-hidden className="shrink-0" />
                {/* Label expands via grid-column (0fr→1fr): no width jump elsewhere. */}
                <span
                  className={`grid overflow-hidden transition-[grid-template-columns] duration-300 ease-out ${
                    active
                      ? "grid-cols-[1fr]"
                      : "grid-cols-[0fr] group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr]"
                  }`}
                >
                  <span className="min-w-0 overflow-hidden">
                    <span
                      className={`block whitespace-nowrap pl-2 pr-0.5 text-sm font-medium transition-opacity duration-300 ${
                        active ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                      }`}
                    >
                      {item.label}
                    </span>
                  </span>
                </span>
              </Link>
            );
          })}
          <span className="mx-1 h-4 w-px bg-border" aria-hidden />
          <LanguageSwitcher locale={locale} label={switchLanguageLabel} />
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher locale={locale} label={switchLanguageLabel} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? closeLabel : openLabel}
            className="grid h-9 w-9 place-items-center rounded-md border border-border text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile drawer — explicit icon + full label */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            className="pointer-events-auto border-t border-border bg-canvas md:hidden"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={reduced ? {} : { height: "auto", opacity: 1 }}
            exit={reduced ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-6 py-4">
              {items.map((item) => {
                const active = isActive(item.href);
                const Icon = SECTION_ICON[idOf(item.href)] ?? UserRound;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "location" : undefined}
                      className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        active
                          ? "bg-brand-primary/10 text-brand-primary-soft"
                          : "text-fg-muted hover:bg-elevated/60 hover:text-fg"
                      }`}
                    >
                      <Icon size={18} aria-hidden className="shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
