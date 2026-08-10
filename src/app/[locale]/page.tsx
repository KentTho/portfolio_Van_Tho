import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick } from "@/shared/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { getPortfolioRepository } from "@/composition/public-portfolio";
import { buildLocaleMetadata } from "@/lib/seo";
import { SITE } from "@/config/site";
import { JsonLd } from "@/components/public/json-ld";
import { HeroSection } from "@/components/public/sections/hero-section";
import { FocusSection } from "@/components/public/sections/focus-section";
import { FeaturedProjectsSection } from "@/components/public/sections/featured-projects-section";
import { TechMatrixSection } from "@/components/public/sections/tech-matrix-section";
import { PrinciplesSection } from "@/components/public/sections/principles-section";
import { ContactCtaSection } from "@/components/public/sections/contact-cta-section";

/** Popular language/tech logos surfaced in the hero (Software Engineer focus). */
const HERO_TECH = [
  "python",
  "typescript",
  "javascript",
  "react",
  "nextjs",
  "fastapi",
  "postgresql",
  "docker",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildLocaleMetadata({
    locale,
    path: "",
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const repo = getPortfolioRepository();
  const [profile, groups, projects] = await Promise.all([
    repo.getProfile(),
    repo.getTechGroups(),
    repo.listProjects(),
  ]);

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: pick(profile.role, locale),
    address: { "@type": "PostalAddress", addressLocality: pick(profile.location, locale) },
    url: `${SITE.url}/${locale}`,
    sameAs: profile.socials.filter((s) => s.kind !== "email").map((s) => s.href),
  };
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: locale,
  };

  return (
    <>
      <JsonLd data={personLd} />
      <JsonLd data={websiteLd} />
      <HeroSection
        name={profile.name}
        role={pick(profile.role, locale)}
        headline={pick(profile.headline, locale)}
        availability={dict.hero.availability}
        techIds={HERO_TECH}
        primary={{ label: dict.actions.viewProjects, href: `/${locale}/projects` }}
        secondary={{ label: dict.actions.downloadResume, href: `/${locale}/resume` }}
      />
      <FocusSection profile={profile} locale={locale} dict={dict} />
      <FeaturedProjectsSection projects={projects.slice(0, 2)} locale={locale} dict={dict} />
      <TechMatrixSection groups={groups} locale={locale} dict={dict} />
      <PrinciplesSection dict={dict} />
      <ContactCtaSection locale={locale} dict={dict} />
    </>
  );
}
