import type { Dictionary } from "@/i18n/dictionary";
import type { Profile } from "@/modules/public-portfolio/domain/types";

/**
 * COSMIC ENGINEERING EDITORIAL — Public Footer
 *
 * Minimal: name + nav + socials + locale + year.
 * Hairline top border. No giant footer blocks.
 */
export function PublicFooter({
  profile,
  dict,
}: {
  readonly profile: Profile;
  readonly dict: Dictionary;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-border/50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        {/* Left: identity */}
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

        {/* Right: social links */}
        <div className="flex items-center gap-2">
          {profile.socials.map((social) => {
            const external = social.kind !== "email";
            return (
              <a
                key={social.kind}
                href={social.href}
                aria-label={social.label}
                className="label-mono rounded border border-border px-3 py-1.5 text-fg-subtle transition-colors hover:border-accent/40 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {social.kind}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
