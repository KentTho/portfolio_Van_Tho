"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Locale } from "@/shared/i18n";
import { LanguageSwitcher } from "@/components/public/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { NavItem } from "@/components/public/public-header";
import { MOTION_DURATION, MOTION_EASING, MOTION_STAGGER } from "@/styles/motion-tokens";

interface V3OverlayMenuProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly locale: Locale;
  readonly brand: string;
  readonly items: readonly NavItem[];
  readonly switchLanguageLabel: string;
}

export function V3OverlayMenu({
  isOpen,
  onClose,
  locale,
  brand,
  items,
  switchLanguageLabel,
}: V3OverlayMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when overlay menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-[150] flex flex-col justify-between bg-canvas/98 backdrop-blur-2xl px-6 md:px-16 py-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: MOTION_DURATION.interaction, ease: MOTION_EASING.cinematic }}
        >
          {/* Top Bar inside Overlay */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <Link
              href={`/${locale}`}
              onClick={onClose}
              className="flex items-center gap-2 font-mono text-sm tracking-wider uppercase text-fg hover:text-brand-primary-soft transition-colors"
            >
              <span className="text-brand-primary font-bold">{"//"}</span>
              <span className="font-display text-lg tracking-normal">{brand}</span>
            </Link>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageSwitcher locale={locale} label={switchLanguageLabel} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-mono tracking-widest uppercase text-fg hover:bg-white/10 hover:border-brand-primary transition-colors"
              >
                <span>CLOSE</span>
                <X className="size-4 text-brand-primary-soft" />
              </button>
            </div>
          </div>

          {/* Navigation Links with Giant Typography */}
          <nav className="my-auto py-10 flex flex-col items-start gap-3 md:gap-5">
            {items.map((item, idx) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: MOTION_DURATION.section,
                  ease: MOTION_EASING.cinematic,
                  delay: idx * MOTION_STAGGER.tight,
                }}
                className="group relative w-full"
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-baseline justify-between py-2 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display uppercase tracking-tight text-fg/70 hover:text-fg transition-colors duration-200"
                >
                  <span className="flex items-baseline gap-4 md:gap-6">
                    <span className="font-mono text-xs md:text-sm text-brand-primary-soft/60 group-hover:text-brand-primary tracking-widest">
                      0{idx + 1}
                    </span>
                    <span className="group-hover:translate-x-3 transition-transform duration-300">
                      {item.label}
                    </span>
                  </span>
                  <ArrowUpRight className="size-6 md:size-10 text-brand-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </Link>
                <div className="h-[1px] w-full bg-white/10 group-hover:bg-brand-primary/40 transition-colors duration-300" />
              </motion.div>
            ))}
          </nav>

          {/* Bottom Bar inside Overlay */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-6 font-mono text-xs text-fg-subtle">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="uppercase tracking-widest text-fg-muted">Available for high-impact engineering</span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/KentTho"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-primary-soft transition-colors uppercase tracking-wider"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-primary-soft transition-colors uppercase tracking-wider"
              >
                LinkedIn
              </a>
              <a
                href="mailto:kenttho.dev@gmail.com"
                className="hover:text-brand-primary-soft transition-colors uppercase tracking-wider"
              >
                Email
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
