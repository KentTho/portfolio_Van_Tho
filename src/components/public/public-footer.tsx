import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { Profile } from "@/modules/public-portfolio/domain/types";
import { LanguageSwitcher } from "@/components/public/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/**
 * Ariyana V3 Public Footer (§41).
 * Features near-clone Ariyana footer visual:
 * - Monumental brand wordmark (HÀ VĂN THỌ) spanning the bottom
 * - Navigation links & verified social channels
 * - Back to Top control with smooth scroll
 * - Deterministic server-only copyright year
 */
export function PublicFooter({
  profile,
  locale,
  dict,
}: {
  readonly profile: Profile;
  readonly locale: Locale;
  readonly dict: Dictionary;
}) {
  const year = new Date().getFullYear();

  const footerNav = [
    { href: `/${locale}#home`, label: "Home" },
    { href: `/${locale}#about`, label: dict.nav.about },
    { href: `/${locale}#projects`, label: dict.nav.projects },
    { href: `/${locale}#career`, label: dict.nav.experience },
    { href: `/${locale}#skills`, label: dict.nav.skills },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="relative w-full border-t border-white/10 bg-canvas pt-20 pb-12 overflow-hidden">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-16">
        {/* Top Controls & Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10 items-start">
          {/* Brand Info & Mission (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 font-mono text-sm tracking-wider uppercase text-fg hover:text-brand-primary-soft transition-colors"
            >
              <span className="text-brand-primary font-bold">{"//"}</span>
              <span className="font-display text-xl">{profile.name}</span>
            </Link>
            <p className="text-body-s text-fg-muted max-w-sm leading-relaxed">
              Software Engineer &amp; Full-Stack Architect specialized in resilient web applications, distributed systems, and modern digital craft.
            </p>
            <div className="pt-2">
              <a
                href="mailto:kenttho.dev@gmail.com"
                className="group inline-flex items-center gap-2 text-xs font-mono tracking-widest text-brand-primary-soft hover:text-fg uppercase transition-colors"
              >
                <span>kenttho.dev@gmail.com</span>
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Quick Nav Links (4 cols) */}
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-widest text-fg-subtle mb-4">
              DIRECTORY
            </p>
            <div className="grid grid-cols-2 gap-3">
              {footerNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-mono text-xs uppercase tracking-wider text-fg-muted hover:text-brand-primary-soft transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials & Back to top (3 cols) */}
          <div className="md:col-span-3 flex flex-col items-start md:items-end justify-between h-full space-y-6">
            <div className="flex flex-wrap gap-2">
              {profile.socials
                .filter((s) => s.kind !== "resume")
                .map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-10 rounded-full border border-white/10 flex items-center justify-center font-mono text-xs text-fg-muted hover:border-brand-primary hover:text-brand-primary-soft hover:bg-white/5 transition-colors uppercase"
                    title={s.label}
                  >
                    {s.kind.slice(0, 2)}
                  </a>
                ))}
            </div>

            <a
              href={`/${locale}#home`}
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-fg hover:border-brand-primary hover:bg-brand-primary/10 transition-all"
            >
              <span>{dict.footer.backToTop || "BACK TO TOP"}</span>
              <ArrowUp className="size-3.5 text-brand-primary transition-transform duration-300 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* ── GIANT ARIYANA WORDMARK ────────────────────────────────────────── */}
        <div className="py-12 sm:py-16 overflow-hidden select-none text-center">
          <p className="text-mega font-display text-white/[0.08] hover:text-white/[0.14] transition-colors duration-500 tracking-tight leading-none uppercase">
            {profile.name || "HÀ VĂN THỌ"}
          </p>
        </div>

        {/* Bottom Legal, Locale & Theme Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-fg-subtle">
          <p>© {year} {profile.name}. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <LanguageSwitcher locale={locale} label={dict.actions?.switchLanguage || "Language"} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
