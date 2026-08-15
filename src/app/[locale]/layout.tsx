import { notFound } from "next/navigation";
import { isLocale, LOCALES } from "@/shared/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { getPortfolioRepository } from "@/composition/public-portfolio";
import { SITE } from "@/config/site";
import { CosmicBackground } from "@/components/public/cosmic-background";
import { CursorHalo } from "@/components/public/motion/cursor-halo";
import { IntroCurtain } from "@/components/public/motion/intro-curtain";
import { PublicHeader, type NavItem } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";

// Public data now comes from the live Neon read model, so the [locale] subtree renders
// on demand (revalidated per request) rather than at build. This keeps the build secret-free
// (no DB access during `next build`); can move to ISR once a build-time Neon branch exists (Wave 07).
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const profile = await getPortfolioRepository().getProfile();
  const brand = profile.name.trim() || SITE.owner;

  // Single-landing anchor navigation (locale-aware). Anchors resolve on the
  // landing page and, from a detail route, navigate back to the landing section.
  const nav: NavItem[] = [
    { href: `/${locale}#about`, label: dict.nav.about },
    { href: `/${locale}#projects`, label: dict.nav.projects },
    { href: `/${locale}#career`, label: dict.nav.experience },
    { href: `/${locale}#skills`, label: dict.nav.skills },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

  return (
    <div lang={locale} className="flex min-h-full flex-col">
      <CosmicBackground />
      <CursorHalo />
      <IntroCurtain name={brand} />
      <PublicHeader
        locale={locale}
        brand={brand}
        items={nav}
        switchLanguageLabel={dict.actions.switchLanguage}
        openLabel={dict.actions.openMenu}
        closeLabel={dict.actions.closeMenu}
      />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <PublicFooter profile={profile} dict={dict} />
    </div>
  );
}
