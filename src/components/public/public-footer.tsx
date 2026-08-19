import { ArrowUp } from "lucide-react";
import type { Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import type { Profile } from "@/modules/public-portfolio/domain/types";

/**
 * COSMIC ENGINEERING EDITORIAL — Public Footer (V2)
 *
 * Minimal page closure — not another section: brand + copyright/year (left),
 * verified links + a restrained Back-to-Top control (right). Hairline top border.
 * Server component, so the year is computed once server-side (deterministic — no
 * client divergence, no hydration risk). Hover INCREASES affordance (never dims).
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
  const year = new Date().getFullYear(); // server-only render → deterministic

  return (
    <footer className="mt-32 border-t border-border/50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        {/* Left: identity + copyright */}
        <div>
          <p className="font-display text-base font-bold tracking-tight text-fg">
            {profile.name}
            <span className="ml-[3px] text-accent" aria-hidden>
              .
            </span>
          </p>
          <p className="mt-1 text-xs text-fg-subtle">{dict.footer.madeWith}</p>
          <p className="mt-0.5 text-xs text-fg-subtle">
            © {year} {profile.name}
          </p>
        </div>

        {/* Right: verified links + Back-to-Top */}
        <div className="flex flex-wrap items-center gap-2">
          {profile.socials
            .filter((s) => s.kind !== "resume")
            .map((social) => {
              const external = social.kind !== "email";
              return (
                <a
                  key={social.kind}
                  href={social.href}
                  aria-label={social.label}
                  className="label-mono flex min-h-11 items-center rounded-full border border-border px-3 text-fg-subtle transition-colors hover:border-brand-primary-soft/50 hover:text-brand-primary-soft focus-visible:text-brand-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {social.kind}
                </a>
              );
            })}

          <a
            href={`/${locale}#home`}
            className="group ml-1 flex min-h-11 items-center gap-1.5 rounded-full border border-border px-4 text-xs font-medium text-fg-muted transition-colors hover:border-brand-primary-soft/50 hover:text-fg focus-visible:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {dict.footer.backToTop}
            <ArrowUp
              size={14}
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
