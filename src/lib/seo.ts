import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/shared/i18n";
import { SITE } from "@/config/site";

/**
 * Build per-route metadata with canonical + hreflang locale alternates.
 * `path` is the route beneath the locale segment (e.g. "" or "/projects").
 */
export function buildLocaleMetadata({
  locale,
  path,
  title,
  description,
  index = true,
}: {
  readonly locale: Locale;
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly index?: boolean;
}): Metadata {
  const url = `${SITE.url}/${locale}${path}`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE.url}/${l}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    robots: index ? undefined : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
