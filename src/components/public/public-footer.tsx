import { Code2, Mail } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionary";
import type { Profile } from "@/modules/public-portfolio/domain/types";

const ICONS = { github: Code2, email: Mail } as const;

/** Public footer: brand line + verified social links. No admin surface. */
export function PublicFooter({
  profile,
  dict,
}: {
  readonly profile: Profile;
  readonly dict: Dictionary;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border bg-surface/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg italic text-fg">{profile.name}</p>
          <p className="mt-1 max-w-md text-sm text-fg-subtle">{dict.footer.madeWith}</p>
          <p className="mt-1 text-xs text-fg-subtle">
            © {year} {profile.name}. {dict.footer.rights}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {profile.socials.map((social) => {
            const Icon = ICONS[social.kind as keyof typeof ICONS] ?? Mail;
            const external = social.kind !== "email";
            return (
              <a
                key={social.kind}
                href={social.href}
                aria-label={social.label}
                className="grid h-9 w-9 place-items-center rounded-md border border-border text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <Icon size={16} aria-hidden />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
