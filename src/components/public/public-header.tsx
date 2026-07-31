"use client";

import { useState } from "react";
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

/** Sticky public navigation. Recruiter-facing only — no admin or login links. */
export function PublicHeader({
  locale,
  brand,
  items,
  switchLanguageLabel,
  openLabel,
  closeLabel,
}: PublicHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  const isActive = (href: string) =>
    pathname === href || (href !== `/${locale}` && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href={`/${locale}`}
          className="rounded-sm font-display text-lg italic text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {brand}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={
                isActive(item.href)
                  ? "rounded-full bg-elevated px-3 py-1.5 text-sm text-fg"
                  : "rounded-full px-3 py-1.5 text-sm text-fg-muted transition-colors hover:bg-elevated/60 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              }
            >
              {item.label}
            </Link>
          ))}
          <span className="mx-1 h-5 w-px bg-border" aria-hidden />
          <LanguageSwitcher locale={locale} label={switchLanguageLabel} />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher locale={locale} label={switchLanguageLabel} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? closeLabel : openLabel}
            className="grid h-9 w-9 place-items-center rounded-md border border-border text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            aria-label="Mobile"
            className="border-t border-border bg-surface md:hidden"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={reduced ? {} : { height: "auto", opacity: 1 }}
            exit={reduced ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-6 py-4">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="block rounded-md px-3 py-2 text-fg-muted hover:bg-elevated hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
