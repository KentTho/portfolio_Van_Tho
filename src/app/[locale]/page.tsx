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
import { FocusSection } from "@/components/public/sections/focus-section";
import { FeaturedProjectsSection } from "@/components/public/sections/featured-projects-section";
import { ExperienceSection } from "@/components/public/sections/experience-section";
import { TechMatrixSection } from "@/components/public/sections/tech-matrix-section";
import { PrinciplesSection } from "@/components/public/sections/principles-section";
import { ArticlesSection } from "@/components/public/sections/articles-section";
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
  const [profile, groups, projects, articles, experience] = await Promise.all([
    repo.getProfile(),
    repo.getTechGroups(),
    repo.listProjects(),
    repo.listArticles(),
    repo.listExperience(),
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

      <div id="home" className="scroll-mt-20">
        <HeroSection
          name={profile.name}
          role={pick(profile.role, locale)}
          headline={pick(profile.headline, locale)}
          availability={dict.hero.availability}
          techIds={HERO_TECH}
          primary={{ label: dict.actions.viewProjects, href: `/${locale}#projects` }}
          secondary={{ label: dict.actions.contactMe, href: `/${locale}#contact` }}
        />
      </div>

      <div id="about" className="scroll-mt-20">
        <AboutSection profile={profile} locale={locale} dict={dict} />
      </div>

      <div id="focus" className="scroll-mt-20">
        <FocusSection profile={profile} locale={locale} dict={dict} />
      </div>

      <div id="projects" className="scroll-mt-20">
        <FeaturedProjectsSection projects={projects} locale={locale} dict={dict} />
      </div>

      <div id="experience" className="scroll-mt-20">
        <ExperienceSection experience={experience} profile={profile} locale={locale} dict={dict} />
      </div>

      <div id="skills" className="scroll-mt-20">
        <TechMatrixSection groups={groups} locale={locale} dict={dict} />
      </div>

      <div id="principles" className="scroll-mt-20">
        <PrinciplesSection dict={dict} />
      </div>

      <div id="articles" className="scroll-mt-20">
        <ArticlesSection articles={articles} locale={locale} dict={dict} />
      </div>

      <div id="contact" className="scroll-mt-20">
        <ContactCtaSection profile={profile} dict={dict} />
      </div>
    </>
  );
}
