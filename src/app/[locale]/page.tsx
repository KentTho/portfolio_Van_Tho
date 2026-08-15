import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick } from "@/shared/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { getPortfolioRepository } from "@/composition/public-portfolio";
import { buildLocaleMetadata } from "@/lib/seo";
import { SITE } from "@/config/site";
import { JsonLd } from "@/components/public/json-ld";
import { HeroSection } from "@/components/public/sections/hero-section";
import { AboutSection } from "@/components/public/sections/about-section";
import { FeaturedProjectsSection } from "@/components/public/sections/featured-projects-section";
import { ExperienceSection } from "@/components/public/sections/experience-section";
import { TechMatrixSection } from "@/components/public/sections/tech-matrix-section";
import { ContactCtaSection } from "@/components/public/sections/contact-cta-section";

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

/**
 * SINGLE LANDING PAGE — the canonical public experience per locale.
 *
 * All public content is composed here as anchored sections (#home … #contact).
 * The former /about, /projects, /articles, /resume, /contact routes redirect to
 * these anchors; project/article detail routes are preserved. Data is read live
 * from Neon via the PortfolioRepository port (FULL_LIVE_NEON, no fixture fallback).
 */
export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const repo = getPortfolioRepository();
  const [profile, groups, projects, experience] = await Promise.all([
    repo.getProfile(),
    repo.getTechGroups(),
    repo.listProjects(),
    repo.listExperience(),
  ]);

  // Graceful empty-state fallbacks (Owner fills the real profile via Admin; these
  // use established config/dict identity, never fabricated personal claims).
  const heroName = profile.name.trim() || SITE.owner;
  const heroRole = pick(profile.role, locale).trim() || dict.meta.homeTitle;
  const heroHeadline = pick(profile.headline, locale).trim() || dict.meta.homeDescription;

  // Contact always offers at least one verified way to reach out. Owner profile
  // socials win; otherwise fall back to the real GitHub repository link (config).
  const contactSocials =
    profile.socials.length > 0
      ? profile.socials
      : [{ kind: "github" as const, label: "GitHub", href: SITE.repositoryUrl }];

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

      <div id="home" className="scroll-mt-20">
        <HeroSection
          name={heroName}
          role={heroRole}
          headline={heroHeadline}
          availability={dict.hero.availability}
          primary={{ label: dict.actions.viewProjects, href: `/${locale}#projects` }}
          secondary={{ label: dict.actions.contactMe, href: `/${locale}#contact` }}
        />
      </div>

      <div id="about" className="scroll-mt-20">
        <AboutSection profile={profile} locale={locale} dict={dict} />
      </div>

      <div id="projects" className="scroll-mt-20">
        <FeaturedProjectsSection projects={projects} locale={locale} dict={dict} />
      </div>

      <div id="career" className="scroll-mt-20">
        <ExperienceSection experience={experience} profile={profile} locale={locale} dict={dict} />
      </div>

      <div id="skills" className="scroll-mt-20">
        <TechMatrixSection groups={groups} locale={locale} dict={dict} />
      </div>

      <div id="contact" className="scroll-mt-20">
        <ContactCtaSection socials={contactSocials} dict={dict} />
      </div>
    </>
  );
}
