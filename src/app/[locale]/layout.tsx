import { notFound } from "next/navigation";
import { isLocale, LOCALES } from "@/shared/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { getPortfolioRepository } from "@/composition/public-portfolio";
import { CosmicBackground } from "@/components/public/cosmic-background";
import { PublicHeader, type NavItem } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";

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

  const nav: NavItem[] = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/projects`, label: dict.nav.projects },
    { href: `/${locale}/articles`, label: dict.nav.articles },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/resume`, label: dict.nav.resume },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <div lang={locale} className="flex min-h-full flex-col">
      <CosmicBackground />
      <PublicHeader
        locale={locale}
        brand={profile.name}
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
