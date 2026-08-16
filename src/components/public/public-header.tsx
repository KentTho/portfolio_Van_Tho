"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Locale } from "@/shared/i18n";
import { LanguageSwitcher } from "@/components/public/language-switcher";

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

/**
 * COSMIC ENGINEERING EDITORIAL — Public Header
 *
 * Single-line desktop nav. Max height 72px. Sticky with backdrop-blur that
 * activates after 40px scroll (avoids top-of-page blur competing with hero).
 * Active link: left-margin accent indicator (not a background fill).
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
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("");
  const reduced = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy: highlight the nav anchor for the section currently in view.
  // Only active on the landing page; detail routes have no in-page sections.
  useEffect(() => {
    // Off-landing (e.g. a detail route) there are no in-page sections to observe.
    // activeId keeps its last value but isActive() ignores it while !isLanding.
    if (!isLanding) return;
    const targets = items
      .map((item) => item.href.split("#")[1])
      .filter((id): id is string => Boolean(id))
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

  const isActive = (href: string) => {
    const hash = href.split("#")[1];
    return isLanding && !!hash && hash === activeId;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/50 bg-canvas/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between px-6">
        {/* Brand wordmark */}
        <Link
          href={`/${locale}`}
          className="font-display text-base font-bold tracking-tight text-fg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          {brand}
          <span className="ml-[3px] text-accent" aria-hidden>
            .
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active
                    ? "text-fg"
                    : "text-fg-muted hover:text-fg focus-visible:text-fg"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md bg-elevated"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    aria-hidden
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
          <span className="mx-2 h-4 w-px bg-border" aria-hidden />
          <LanguageSwitcher locale={locale} label={switchLanguageLabel} />
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher locale={locale} label={switchLanguageLabel} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? closeLabel : openLabel}
            className="grid h-8 w-8 place-items-center rounded-md border border-border text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {open ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            className="border-t border-border bg-canvas md:hidden"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={reduced ? {} : { height: "auto", opacity: 1 }}
            exit={reduced ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="mx-auto flex w-full max-w-6xl flex-col gap-0.5 px-6 py-4">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`block rounded-md px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isActive(item.href)
                        ? "bg-elevated text-fg"
                        : "text-fg-muted hover:bg-elevated/60 hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
