"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import type { Locale } from "@/shared/i18n";
import { LanguageSwitcher } from "@/components/public/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { V3OverlayMenu } from "@/components/public/v3-overlay-menu";

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

const idOf = (href: string) => href.split("#")[1] ?? "";

/**
 * Ariyana V3 Navigation Header (§19).
 * Features a clean, floating wide top-bar with active dot indicators,
 * direct action toggles, and an Ariyana-style full-canvas overlay menu trigger.
 */
export function PublicHeader({
  locale,
  brand,
  items,
  switchLanguageLabel,
  openLabel,
}: PublicHeaderProps) {
  const pathname = usePathname();
  const isLanding = pathname === `/${locale}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Scroll listener for translucent navbar transition and bottom-of-page detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 80;
      if (isBottom) {
        setActiveId("contact");
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy observer for section anchors
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
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.5, 1] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [isLanding, items]);

  const isActive = (href: string) => isLanding && idOf(href) === activeId && activeId !== "";
  const atHome = isLanding && activeId === "";

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-canvas/85 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[1680px] items-center justify-between px-6 md:px-12 lg:px-16">
          {/* Ariyana-style minimal Brand Logo */}
          <Link
            href={`/${locale}`}
            aria-current={atHome ? "page" : undefined}
            className="group flex items-center gap-2 font-mono text-sm tracking-wider uppercase text-fg hover:text-brand-primary-soft transition-colors"
          >
            <span className="text-brand-primary font-bold">{"//"}</span>
            <span className="font-display text-lg tracking-tight font-normal text-fg">
              {brand}
            </span>
          </Link>

          {/* Desktop quick navigation */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-8">
              {items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "location" : undefined}
                    className="group relative flex items-center gap-2.5 py-1 text-xs font-mono tracking-widest uppercase"
                  >
                    {/* Ariyana Ring Indicator */}
                    <span
                      className={`size-2 rounded-full border transition-all duration-300 ${
                        active
                          ? "border-brand-primary bg-brand-primary shadow-[0_0_12px_rgba(0,240,255,0.7)]"
                          : "border-white/30 bg-transparent group-hover:border-brand-primary-soft"
                      }`}
                    />
                    {/* Ariyana Roll-up Text */}
                    <span className="relative h-4 overflow-hidden block">
                      <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                        <span
                          className={`block h-4 leading-4 transition-colors ${
                            active ? "text-brand-primary-soft font-bold" : "text-fg-muted"
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="block h-4 leading-4 text-brand-primary font-bold">
                          {item.label}
                        </span>
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="h-4 w-px bg-white/10" aria-hidden />

            <div className="flex items-center gap-3">
              <LanguageSwitcher locale={locale} label={switchLanguageLabel} />
              <ThemeToggle />
            </div>

            {/* Ariyana Canvas Menu Trigger */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={openLabel}
              className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-mono tracking-widest uppercase text-fg hover:border-brand-primary hover:bg-brand-primary/10 transition-all duration-200"
            >
              <span>MENU</span>
              <Menu className="size-4 text-brand-primary-soft" />
            </button>
          </nav>

          {/* Tablet & Mobile controls */}
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <LanguageSwitcher locale={locale} label={switchLanguageLabel} />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={openLabel}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-mono tracking-widest uppercase text-fg hover:border-brand-primary transition-colors"
            >
              <span>MENU</span>
              <Menu className="size-4 text-brand-primary-soft" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Canvas Overlay Navigation */}
      <V3OverlayMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        locale={locale}
        brand={brand}
        items={items}
        switchLanguageLabel={switchLanguageLabel}
      />
    </>
  );
}
