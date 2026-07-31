"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/shared/i18n";

/** Toggles vi/en while preserving the current route path. */
export function LanguageSwitcher({ locale, label }: { readonly locale: Locale; readonly label: string }) {
  const pathname = usePathname() || `/${locale}`;

  const swap = (target: Locale) => {
    const segments = pathname.split("/");
    segments[1] = target; // replace the leading locale segment
    return segments.join("/") || `/${target}`;
  };

  return (
    <div className="flex items-center gap-0.5 text-xs font-medium" aria-label={label}>
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={swap(l)}
          aria-current={l === locale ? "true" : undefined}
          className={
            l === locale
              ? "rounded-md px-2 py-1 text-fg"
              : "rounded-md px-2 py-1 text-fg-subtle transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          }
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
