import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/shared/i18n";
import type { Dictionary } from "@/i18n/dictionary";

export function ContactCtaSection({
  locale,
  dict,
}: {
  readonly locale: Locale;
  readonly dict: Dictionary;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-surface/60 to-elevated/40 p-10 text-center">
        <h2 className="font-display text-3xl italic text-fg sm:text-4xl">{dict.sections.contactCta}</h2>
        <p className="mx-auto mt-3 max-w-xl text-fg-muted">{dict.contact.subtitle}</p>
        <div className="mt-6 flex justify-center">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-canvas transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            {dict.actions.contactMe}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
